import { Request, Response } from 'express'
import { User, Product, Order, OrderItem } from '../models/index.js'
import { Op } from 'sequelize'
import { body, param, validationResult } from 'express-validator'
import { sequelize } from '../lib/sequelize.js'

// Get admin dashboard stats
export async function getAdminDashboard(req: Request, res: Response) {
  try {
    const admin_id = (req as any).user?.id
    if (!admin_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // Get admin info
    const admin = await User.findByPk(admin_id, {
      attributes: ['id', 'name', 'email', 'created_at']
    })

    // Get total products for this admin (including archived ones)
    const totalProducts = await Product.count({
      where: { seller_id: admin_id }
    })

    // Get order IDs that contain admin's products
    const adminOrderItems = await OrderItem.findAll({
      include: [{
        model: Product,
        as: 'product',
        where: { seller_id: admin_id },
        attributes: []
      }],
      attributes: ['order_id'],
      group: ['order_id']
    })

    const adminOrderIds = adminOrderItems.map(item => item.order_id)

    // Get total orders for admin's products
    const totalOrders = adminOrderIds.length

    // Get total revenue from admin's products only
    const revenueResult = await OrderItem.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'total_revenue']
      ],
      include: [{
        model: Product,
        as: 'product',
        where: { seller_id: admin_id },
        attributes: []
      }],
      raw: true
    })

    const totalRevenue = revenueResult[0]?.total_revenue || 0

    // Get unique buyers who purchased admin's products
    const buyerIds = adminOrderIds.length > 0 ? await Order.findAll({
      where: { id: adminOrderIds },
      attributes: ['user_id'],
      group: ['user_id']
    }) : []

    const totalBuyers = buyerIds.length

    // Get recent orders containing admin's products
    const recentOrders = adminOrderIds.length > 0 ? await Order.findAll({
      where: { id: adminOrderIds },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id: admin_id },
          attributes: ['id', 'name', 'price']
        }]
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit: 5
    }) : []

    res.json({
      admin,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: parseFloat(totalRevenue),
        totalBuyers
      },
      recentOrders
    })
  } catch (error) {
    console.error('Error fetching admin dashboard:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get admin's products
export async function getAdminProducts(req: Request, res: Response) {
  try {
    const admin_id = (req as any).user?.id
    if (!admin_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const products = await Product.findAll({
      where: { seller_id: admin_id },
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    })

    res.json(products)
  } catch (error) {
    console.error('Error fetching admin products:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get admin's orders (only orders containing admin's products)
export async function getAdminOrders(req: Request, res: Response) {
  try {
    const admin_id = (req as any).user?.id
    if (!admin_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // First, get all order IDs that contain this admin's products
    const orderItems = await OrderItem.findAll({
      include: [{
        model: Product,
        as: 'product',
        where: { seller_id: admin_id },
        attributes: []
      }],
      attributes: ['order_id'],
      group: ['order_id']
    })

    const orderIds = orderItems.map(item => item.order_id)

    if (orderIds.length === 0) {
      return res.json([])
    }

    // Now get the complete orders with only this admin's products
    const orders = await Order.findAll({
      where: { id: orderIds },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id: admin_id },
          attributes: ['id', 'name', 'price', 'image_url']
        }]
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']]
    })

    res.json(orders)
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get admin's buyers (only those who bought admin's products)
export async function getAdminBuyers(req: Request, res: Response) {
  try {
    const admin_id = (req as any).user?.id
    if (!admin_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // First, get order IDs that contain admin's products
    const adminOrderItems = await OrderItem.findAll({
      include: [{
        model: Product,
        as: 'product',
        where: { seller_id: admin_id },
        attributes: []
      }],
      attributes: ['order_id'],
      group: ['order_id']
    })

    const adminOrderIds = adminOrderItems.map(item => item.order_id)

    if (adminOrderIds.length === 0) {
      return res.json([])
    }

    // Get unique user IDs who placed these orders
    const buyerOrders = await Order.findAll({
      where: { id: adminOrderIds },
      attributes: ['user_id'],
      group: ['user_id']
    })

    const buyerIds = buyerOrders.map(order => order.user_id)

    // Get buyer details
    const buyers = await User.findAll({
      where: { id: buyerIds, role: 'user' },
      attributes: ['id', 'name', 'email', 'created_at'],
      order: [['created_at', 'DESC']]
    })

    res.json(buyers)
  } catch (error) {
    console.error('Error fetching admin buyers:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Update admin profile
export const updateAdminProfileValidators = [
  body('name').optional().isString().notEmpty(),
  body('email').optional().isEmail(),
]

export async function updateAdminProfile(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const admin_id = (req as any).user?.id
    if (!admin_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const admin = await User.findByPk(admin_id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    await admin.update(req.body)
    res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    })
  } catch (error) {
    console.error('Error updating admin profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
