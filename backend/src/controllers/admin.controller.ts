import { Request, Response } from 'express'
import { User, Product, Order, OrderItem } from '../models/index.js'
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

    // Get total products for this admin
    const totalProducts = await Product.count({
      where: { seller_id: admin_id }
    })

    // Get total orders for admin's products
    const totalOrders = await Order.count({
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id: admin_id },
          attributes: []
        }]
      }]
    })

    // Get total revenue
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
    const totalBuyers = await User.count({
      include: [{
        model: Order,
        as: 'orders',
        include: [{
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            where: { seller_id: admin_id },
            attributes: []
          }]
        }]
      }],
      where: {
        '$orders.orderItems.product.seller_id$': admin_id
      },
      distinct: true
    })

    // Get recent orders
    const recentOrders = await Order.findAll({
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
    })

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

// Get admin's orders
export async function getAdminOrders(req: Request, res: Response) {
  try {
    const admin_id = (req as any).user?.id
    if (!admin_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const orders = await Order.findAll({
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

    // Get unique buyers who purchased this admin's products
    const buyers = await User.findAll({
      attributes: ['id', 'name', 'email', 'created_at'],
      include: [{
        model: Order,
        as: 'orders',
        include: [{
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            where: { seller_id: admin_id },
            attributes: ['id', 'name', 'price']
          }]
        }]
      }],
      where: {
        '$orders.orderItems.product.seller_id$': admin_id
      },
      distinct: true,
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
