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
    console.log('Create payment intent request:', req.body);
    const { items, customerInfo } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log('User ID:', userId);
    console.log('Items:', items);
    console.log('Customer Info:', customerInfo);

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
    console.log('Creating Stripe payment intent with amount:', Math.round(totalAmount * 100));
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
        orderItems: JSON.stringify(orderItems),
        customerInfo: JSON.stringify(customerInfo),
      },
    });
    console.log('Payment intent created:', paymentIntent.id);

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
      console.log(`Creating COD order item for product ${item.productId}:`, {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: (item as any).size
      });
      
      await OrderItem.create({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: (item as any).size || null,
      });

      // Decrement product stock
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.productId },
      });
    }

    // Send notifications to sellers
    console.log(`Sending notifications to ${sellerIds.size} sellers for COD order ${order.id}`);
    for (const sellerId of sellerIds) {
      try {
        console.log(`Processing seller ${sellerId} for COD order ${order.id}`);
        
        // Real-time notification
        io.to(`seller_${sellerId}`).emit('new_order', {
          orderId: order.id,
          message: 'New COD order received!',
          type: 'order',
          timestamp: new Date().toISOString(),
        });

        // Database notification with complete buyer details
        console.log(`Creating notification for seller ${sellerId} for COD order ${order.id}`);
        
        // Get buyer details from User model
        const buyer = await User.findByPk(userId, {
          attributes: ['id', 'name', 'email', 'contactNumber', 'deliveryAddress']
        });
        console.log(`Buyer details for seller ${sellerId}:`, buyer ? {
          id: buyer.id,
          name: buyer.name,
          email: buyer.email,
          contactNumber: buyer.contactNumber,
          deliveryAddress: buyer.deliveryAddress
        } : 'Buyer not found');
        
        // Get order items for this seller's products
        const sellerOrderItems = await OrderItem.findAll({
          where: { order_id: order.id },
          include: [{
            model: Product,
            as: 'product',
            where: { seller_id: sellerId },
            attributes: ['id', 'name', 'price']
          }]
        });
        console.log(`Order items for seller ${sellerId}:`, sellerOrderItems.length);

        const orderDetails = sellerOrderItems.map((item: any) => ({
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
          size: item.size || 'N/A'
        }));

        const notification = await Notification.create({
          user_id: sellerId,
          type: 'order',
          title: 'New COD Order',
          message: `You have received a new Cash on Delivery order #${order.id} from ${buyer?.name || 'Unknown Customer'}`,
          metadata: JSON.stringify({
            orderId: order.id,
            customerName: buyer?.name || 'Unknown Customer',
            customerEmail: buyer?.email || 'N/A',
            customerPhone: buyer?.contactNumber || 'N/A',
            deliveryAddress: buyer?.deliveryAddress || 'N/A',
            paymentMethod: 'cod',
            totalAmount: totalAmount,
            orderItems: orderDetails,
            orderDate: order.created_at || new Date().toISOString()
          }),
          is_read: false,
        });
        console.log(`✅ Notification created with ID: ${notification.id} for seller ${sellerId}`);
      } catch (error) {
        console.error(`❌ Error creating notification for seller ${sellerId}:`, error);
      }
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
      user_id: userId,
      type: 'order',
      title: 'Order Confirmed',
      message: `Your COD order #${order.id} has been placed successfully!`,
      metadata: JSON.stringify({
        orderId: order.id,
        paymentMethod: 'cod',
        totalAmount: totalAmount,
      }),
      is_read: false,
    });

    // Create admin notifications with complete order details
    try {
      console.log('Creating admin notifications for COD order...');
      const adminUsers = await User.findAll({ where: { role: 'admin' } });
      console.log(`Found ${adminUsers.length} admin users`);
      for (const admin of adminUsers) {
        console.log(`Creating notification for admin ${admin.id} (${admin.name})`);
        // Get order items with product details
        const orderItemsWithProducts = await OrderItem.findAll({
          where: { order_id: order.id },
          include: [{ model: Product, as: 'product' }]
        });

        const orderDetails = orderItemsWithProducts.map((item: any) => ({
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
          size: item.size || 'N/A'
        }));

        console.log(`Creating notification for admin ${admin.id} with order details:`, orderDetails);
        const notification = await Notification.create({
          admin_id: admin.id,
          type: 'order',
          title: 'New COD Order Received',
          message: `New COD order #${order.id} from ${customerInfo.name}`,
          metadata: JSON.stringify({
            orderId: order.id,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            deliveryAddress: customerInfo.address,
            paymentMethod: 'cod',
            totalAmount: totalAmount,
            orderItems: orderDetails,
            orderDate: new Date().toISOString()
          }),
          is_read: false,
        });
        console.log(`Admin notification created with ID: ${notification.id} for admin ${admin.id}`);
      }
    } catch (error) {
      console.error('Error creating admin notifications for COD order:', error);
    }

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
    console.log('Confirm payment request:', req.body);
    const { paymentIntentId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    console.log('Retrieving payment intent:', paymentIntentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('Payment intent retrieved:', paymentIntent.status);

    if (paymentIntent.status !== 'succeeded') {
      console.log('Payment not succeeded, status:', paymentIntent.status);
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Extract order data from metadata
    console.log('Payment intent metadata:', paymentIntent.metadata);
    const orderItems = JSON.parse(paymentIntent.metadata.orderItems);
    const customerInfo = JSON.parse(paymentIntent.metadata.customerInfo);
    console.log('Parsed order items:', orderItems);
    console.log('Parsed customer info:', customerInfo);

    // Create order
    const order = await Order.create({
      user_id: userId,
      total_price: paymentIntent.amount / 100,
      status: 'processing',
      payment_method: 'stripe',
      payment_status: 'succeeded',
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      delivery_address: customerInfo.address,
    });

    // Create order items and update stock
    const sellerIds = new Set<number>();

    for (const item of orderItems) {
      console.log(`Creating Stripe order item for product ${item.productId}:`, {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: (item as any).size
      });
      
      await OrderItem.create({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: (item as any).size || null,
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
    console.log(`Sending notifications to ${sellerIds.size} sellers for Stripe order ${order.id}`);
    for (const sellerId of sellerIds) {
      try {
        console.log(`Processing seller ${sellerId} for Stripe order ${order.id}`);
        
        // Real-time notification
        io.to(`seller_${sellerId}`).emit('new_order', {
          orderId: order.id,
          message: 'New order received!',
          type: 'order',
          timestamp: new Date().toISOString(),
        });

        // Database notification with complete buyer details
        console.log(`Creating notification for seller ${sellerId} for Stripe order ${order.id}`);
        
        // Get buyer details from User model
        const buyer = await User.findByPk(userId, {
          attributes: ['id', 'name', 'email', 'contactNumber', 'deliveryAddress']
        });
        console.log(`Buyer details for seller ${sellerId}:`, buyer ? {
          id: buyer.id,
          name: buyer.name,
          email: buyer.email,
          contactNumber: buyer.contactNumber,
          deliveryAddress: buyer.deliveryAddress
        } : 'Buyer not found');
        
        // Get order items for this seller's products
        const sellerOrderItems = await OrderItem.findAll({
          where: { order_id: order.id },
          include: [{
            model: Product,
            as: 'product',
            where: { seller_id: sellerId },
            attributes: ['id', 'name', 'price']
          }]
        });
        console.log(`Order items for seller ${sellerId}:`, sellerOrderItems.length);

        const orderDetails = sellerOrderItems.map((item: any) => ({
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
          size: item.size || 'N/A'
        }));

        const notification = await Notification.create({
          user_id: sellerId,
          type: 'order',
          title: 'New Order',
          message: `You have received a new order #${order.id} from ${buyer?.name || 'Unknown Customer'}`,
          metadata: JSON.stringify({
            orderId: order.id,
            customerName: buyer?.name || 'Unknown Customer',
            customerEmail: buyer?.email || 'N/A',
            customerPhone: buyer?.contactNumber || 'N/A',
            deliveryAddress: buyer?.deliveryAddress || 'N/A',
            paymentMethod: 'stripe',
            totalAmount: order.total_price,
            orderItems: orderDetails,
            orderDate: order.created_at || new Date().toISOString()
          }),
          is_read: false,
        });
        console.log(`✅ Notification created with ID: ${notification.id} for seller ${sellerId}`);
      } catch (error) {
        console.error(`❌ Error creating notification for seller ${sellerId}:`, error);
      }
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
      user_id: userId,
      type: 'order',
      title: 'Order Confirmed',
      message: `Your order #${order.id} has been confirmed!`,
      metadata: JSON.stringify({
        orderId: order.id,
        paymentMethod: 'stripe',
        totalAmount: order.total_price,
      }),
      is_read: false,
    });

    // Create admin notifications with complete order details
    try {
      console.log('Creating admin notifications for Stripe order...');
      const adminUsers = await User.findAll({ where: { role: 'admin' } });
      console.log(`Found ${adminUsers.length} admin users`);
      for (const admin of adminUsers) {
        console.log(`Creating notification for admin ${admin.id} (${admin.name})`);
        // Get order items with product details
        const orderItemsWithProducts = await OrderItem.findAll({
          where: { order_id: order.id },
          include: [{ model: Product, as: 'product' }]
        });

        const orderDetails = orderItemsWithProducts.map((item: any) => ({
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
          size: item.size || 'N/A'
        }));

        console.log(`Creating notification for admin ${admin.id} with order details:`, orderDetails);
        const notification = await Notification.create({
          admin_id: admin.id,
          type: 'order',
          title: 'New Order Received',
          message: `New order #${order.id} from ${customerInfo.name}`,
          metadata: JSON.stringify({
            orderId: order.id,
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            deliveryAddress: customerInfo.address,
            paymentMethod: 'stripe',
            totalAmount: order.total_price,
            orderItems: orderDetails,
            orderDate: new Date().toISOString()
          }),
          is_read: false,
        });
        console.log(`Admin notification created with ID: ${notification.id} for admin ${admin.id}`);
      }
    } catch (error) {
      console.error('Error creating admin notifications for Stripe order:', error);
    }

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

