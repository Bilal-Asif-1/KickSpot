import { Response } from 'express';
import { Op } from 'sequelize';
import Stripe from 'stripe';
import { Order, OrderItem, Product, User, Notification } from '../models';
import { io } from '../index';
import { AuthRequest } from '../middleware/auth';

// Initialize Stripe with environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil',
});

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { items, customerInfo } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
        orderItems: JSON.stringify(orderItems),
        customerInfo: JSON.stringify(customerInfo),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      totalAmount,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

export const createCODOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, customerInfo } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Validate customer info
    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ error: 'Complete customer information is required for COD' });
    }

    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderItems = [];
    const sellerIds = new Set<number>();

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      if (product.seller_id) {
        sellerIds.add(product.seller_id);
      }

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });
    }

    // Create COD order
    const order = await Order.create({
      user_id: userId,
      total_price: totalAmount,
      status: 'pending',
      payment_method: 'cod',
      payment_status: 'pending',
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      delivery_address: customerInfo.address,
    });

    // Create order items and update stock
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });

      // Decrement product stock
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId },
      });
    }

    // Send notifications to sellers
    for (const sellerId of sellerIds) {
      // Real-time notification
      io.to(`seller_${sellerId}`).emit('new_order', {
        orderId: order.id,
        message: 'New COD order received!',
        type: 'order',
        timestamp: new Date().toISOString(),
      });

      // Database notification
      await Notification.create({
        userId: sellerId,
        type: 'order',
        title: 'New COD Order',
        message: `You have received a new Cash on Delivery order #${order.id}`,
        data: {
          orderId: order.id,
          paymentMethod: 'cod',
          totalAmount: totalAmount,
        },
        isRead: false,
      });
    }

    // Send notification to buyer
    io.to(`user_${userId}`).emit('order_confirmed', {
      orderId: order.id,
      message: 'Your COD order has been placed successfully!',
      type: 'order',
      timestamp: new Date().toISOString(),
    });

    // Database notification for buyer
    await Notification.create({
      userId,
      type: 'order',
      title: 'Order Confirmed',
      message: `Your COD order #${order.id} has been placed successfully!`,
      data: {
        orderId: order.id,
        paymentMethod: 'cod',
        totalAmount: totalAmount,
      },
      isRead: false,
    });

    res.json({
      success: true,
      orderId: order.id,
      message: 'COD order placed successfully',
      totalAmount,
    });
  } catch (error) {
    console.error('COD order creation error:', error);
    res.status(500).json({ error: 'Failed to create COD order' });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Extract order data from metadata
    const orderItems = JSON.parse(paymentIntent.metadata.orderItems);
    const customerInfo = JSON.parse(paymentIntent.metadata.customerInfo);

    // Create order
    const order = await Order.create({
      user_id: userId,
      total_price: paymentIntent.amount / 100,
      status: 'confirmed',
      payment_method: 'stripe',
      payment_status: 'completed',
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      delivery_address: customerInfo.address,
    });

    // Create order items and update stock
    const sellerIds = new Set<number>();

    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      });

      // Get product to find seller
      const product = await Product.findByPk(item.productId);
      if (product && product.seller_id) {
        sellerIds.add(product.seller_id);
      }

      // Decrement product stock
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId },
      });
    }

    // Send notifications to sellers
    for (const sellerId of sellerIds) {
      // Real-time notification
      io.to(`seller_${sellerId}`).emit('new_order', {
        orderId: order.id,
        message: 'New order received!',
        type: 'order',
        timestamp: new Date().toISOString(),
      });

      // Database notification
      await Notification.create({
        userId: sellerId,
        type: 'order',
        title: 'New Order',
        message: `You have received a new order #${order.id}`,
        data: {
          orderId: order.id,
          paymentMethod: 'stripe',
          totalAmount: order.total_price,
        },
        isRead: false,
      });
    }

    // Send notification to buyer
    io.to(`user_${userId}`).emit('order_confirmed', {
      orderId: order.id,
      message: 'Your order has been confirmed!',
      type: 'order',
      timestamp: new Date().toISOString(),
    });

    // Database notification for buyer
    await Notification.create({
      userId,
      type: 'order',
      title: 'Order Confirmed',
      message: `Your order #${order.id} has been confirmed!`,
      data: {
        orderId: order.id,
        paymentMethod: 'stripe',
        totalAmount: order.total_price,
      },
      isRead: false,
    });

    res.json({
      success: true,
      orderId: order.id,
      message: 'Payment confirmed and order created',
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

export const webhook = async (req: Request, res: Response) => {
  try {
    // For now, just acknowledge webhook receipt
    // In production, you would verify the signature and handle events
    console.log('Webhook received:', req.body);
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};
