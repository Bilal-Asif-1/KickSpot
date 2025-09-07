import { Order, OrderItem, Product, User } from '../models/index.js';
import { Op } from 'sequelize';

// Create a new order
export const createOrder = async (orderData, userId) => {
  const { items, shippingDetails, paymentDetails, orderNotes } = orderData;

  // Validate items
  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Calculate total and validate products
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    // Check stock availability
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
    }

    const itemTotal = item.quantity * product.price;
    totalAmount += itemTotal;

    orderItems.push({
      productId: product.id,
      productName: product.name,
      productDescription: product.description,
      productCategory: product.category,
      productBrand: product.brand,
      productImageUrl: product.imageUrl,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice: itemTotal,
      size: item.size || null,
      color: item.color || null,
      variant: item.variant || null,
    });
  }

  // Get user details for buyer info
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Create order
  const order = await Order.create({
    userId,
    totalAmount,
    buyerName: shippingDetails.name || user.name,
    buyerEmail: shippingDetails.email || user.email,
    buyerPhone: shippingDetails.phone,
    shippingAddress: shippingDetails.address,
    shippingCity: shippingDetails.city,
    shippingState: shippingDetails.state,
    shippingZip: shippingDetails.zip,
    shippingCountry: shippingDetails.country || 'USA',
    paymentMethod: paymentDetails?.method || 'cash_on_delivery',
    orderNotes: orderNotes,
  });

  // Create order items
  const createdItems = await OrderItem.bulkCreate(
    orderItems.map(item => ({ ...item, orderId: order.id }))
  );

  // Update product stock
  for (const item of items) {
    await Product.decrement('stock', {
      by: item.quantity,
      where: { id: item.productId }
    });
  }

  // Return order with items
  return await Order.findByPk(order.id, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'category', 'brand']
          }
        ]
      },
      {
        model: User,
        as: 'customer',
        attributes: ['id', 'name', 'email']
      }
    ]
  });
};

// Get all orders (admin)
export const getAllOrders = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = options;

  const offset = (page - 1) * limit;

  // Build where clause
  const whereClause = {};
  if (status) {
    whereClause.status = status;
  }
  if (startDate || endDate) {
    whereClause.createdAt = {};
    if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
    if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
  }

  const { count, rows: orders } = await Order.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: offset,
    order: [[sortBy, sortOrder]],
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'category', 'brand']
          }
        ]
      },
      {
        model: User,
        as: 'customer',
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  return {
    orders,
    pagination: {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit)
    }
  };
};

// Get user's orders
export const getUserOrders = async (userId, options = {}) => {
  const { page = 1, limit = 10 } = options;
  const offset = (page - 1) * limit;

  const { count, rows: orders } = await Order.findAndCountAll({
    where: { userId },
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'category', 'brand']
          }
        ]
      }
    ]
  });

  return {
    orders,
    pagination: {
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit)
    }
  };
};

// Get order by ID
export const getOrderById = async (orderId, userId = null) => {
  const whereClause = { id: orderId };
  if (userId) {
    whereClause.userId = userId; // For users, only show their own orders
  }

  return await Order.findOne({
    where: whereClause,
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'category', 'brand', 'imageUrl']
          }
        ]
      },
      {
        model: User,
        as: 'customer',
        attributes: ['id', 'name', 'email']
      }
    ]
  });
};

// Update order status (admin)
export const updateOrderStatus = async (orderId, statusData) => {
  const { status, adminNotes, trackingNumber, estimatedDelivery } = statusData;

  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  const updateData = { status };
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
  if (estimatedDelivery !== undefined) updateData.estimatedDelivery = new Date(estimatedDelivery);
  
  if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  }

  await order.update(updateData);

  return await getOrderById(orderId);
};

// Cancel order
export const cancelOrder = async (orderId, userId = null) => {
  const whereClause = { id: orderId };
  if (userId) {
    whereClause.userId = userId; // Users can only cancel their own orders
  }

  const order = await Order.findOne({
    where: whereClause,
    include: [{ model: OrderItem, as: 'items' }]
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status === 'delivered' || order.status === 'cancelled') {
    throw new Error('Cannot cancel order with current status');
  }

  // Restore product stock
  for (const item of order.items) {
    await Product.increment('stock', {
      by: item.quantity,
      where: { id: item.productId }
    });
  }

  await order.update({ status: 'cancelled' });

  return await getOrderById(orderId, userId);
};

// Get order statistics (admin dashboard)
export const getOrderStats = async () => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const stats = await Promise.all([
    // Total orders
    Order.count(),
    
    // Orders today
    Order.count({
      where: {
        createdAt: {
          [Op.gte]: startOfToday
        }
      }
    }),
    
    // Orders this month
    Order.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      }
    }),
    
    // Total revenue
    Order.sum('totalAmount', {
      where: {
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    }),
    
    // Revenue today
    Order.sum('totalAmount', {
      where: {
        createdAt: {
          [Op.gte]: startOfToday
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    }),
    
    // Revenue this month
    Order.sum('totalAmount', {
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    }),
    
    // Order status breakdown
    Order.findAll({
      attributes: [
        'status',
        [Order.sequelize.fn('COUNT', Order.sequelize.col('status')), 'count']
      ],
      group: ['status']
    }),
    
    // Recent orders
    Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email']
        }
      ]
    })
  ]);

  return {
    totalOrders: stats[0] || 0,
    ordersToday: stats[1] || 0,
    ordersThisMonth: stats[2] || 0,
    totalRevenue: parseFloat(stats[3]) || 0,
    revenueToday: parseFloat(stats[4]) || 0,
    revenueThisMonth: parseFloat(stats[5]) || 0,
    statusBreakdown: stats[6].reduce((acc, item) => {
      acc[item.status] = parseInt(item.dataValues.count);
      return acc;
    }, {}),
    recentOrders: stats[7]
  };
};
