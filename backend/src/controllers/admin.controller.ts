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

    const user_role = (req as any).user?.role

    if (user_role === 'seller') {
      // Seller sees only their own data
      const totalProducts = await Product.count({ where: { seller_id: admin_id } })
      
      // Get orders that contain seller's products
      const sellerOrderItems = await OrderItem.findAll({
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id: admin_id },
          attributes: []
        }],
        attributes: ['order_id'],
        group: ['order_id']
      })
      
      const sellerOrderIds = sellerOrderItems.map(item => item.order_id)
      const totalOrders = sellerOrderIds.length
      
      // Calculate revenue from seller's products only
      const revenueResult = await OrderItem.findAll({
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id: admin_id },
          attributes: []
        }],
        attributes: [
          [sequelize.fn('SUM', sequelize.literal('quantity * price')), 'total_revenue']
        ],
        raw: true
      })
      const totalRevenue = (revenueResult[0] as any)?.total_revenue || 0
      
      // Count unique buyers who purchased seller's products
      const buyerIds = await OrderItem.findAll({
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id: admin_id },
          attributes: []
        }, {
          model: Order,
          as: 'order',
          attributes: ['user_id']
        }],
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('order.user_id')), 'user_id']],
        raw: true
      })
      const totalBuyers = buyerIds.length
      
      // Get recent orders containing seller's products
      let recentOrders: any[] = []
      if (sellerOrderIds.length > 0) {
        recentOrders = await Order.findAll({
          where: { id: sellerOrderIds },
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
      }

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
    } else {
      // Buyer role - return empty dashboard or redirect
      return res.status(403).json({ message: 'Access denied. Sellers only.' })
    }
  } catch (error) {
    console.error('Error fetching admin dashboard:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get products (all products for admin, own products for seller)
export async function getAdminProducts(req: Request, res: Response) {
  try {
    const user_id = (req as any).user?.id
    const user_role = (req as any).user?.role
    if (!user_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    if (user_role === 'seller') {
      // Sellers can only see their own products
      const products = await Product.findAll({
        where: { seller_id: user_id },
        include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }],
        order: [['created_at', 'DESC']]
      })
      res.json(products)
    } else {
      // Buyer role - access denied
      return res.status(403).json({ message: 'Access denied. Sellers only.' })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get orders (all orders for admin, own orders for seller)
export async function getAdminOrders(req: Request, res: Response) {
  try {
    const user_id = (req as any).user?.id
    const user_role = (req as any).user?.role
    if (!user_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    if (user_role === 'seller') {
      // Sellers can only see orders containing their products
      const sellerOrderItems = await OrderItem.findAll({
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id: user_id },
          attributes: []
        }],
        attributes: ['order_id'],
        group: ['order_id']
      })

      const sellerOrderIds = sellerOrderItems.map(item => item.order_id)

      if (sellerOrderIds.length === 0) {
        return res.json([])
      }

      const orders = await Order.findAll({
        where: { id: sellerOrderIds },
        include: [{
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            where: { seller_id: user_id },
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
    } else {
      // Buyer role - access denied
      return res.status(403).json({ message: 'Access denied. Sellers only.' })
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get buyers (all users for admin, own customers for seller)
export async function getAdminBuyers(req: Request, res: Response) {
  try {
    const user_id = (req as any).user?.id
    const user_role = (req as any).user?.role
    if (!user_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    if (user_role === 'seller') {
      // Sellers can only see buyers who purchased their products
      const sellerOrderItems = await OrderItem.findAll({
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id: user_id },
          attributes: []
        }],
        attributes: ['order_id'],
        group: ['order_id']
      })

      const sellerOrderIds = sellerOrderItems.map(item => item.order_id)

      if (sellerOrderIds.length === 0) {
        return res.json([])
      }

      const buyerOrders = await Order.findAll({
        where: { id: sellerOrderIds },
        attributes: ['user_id'],
        group: ['user_id']
      })

      const buyerIds = buyerOrders.map(order => order.user_id)

      const buyers = await User.findAll({
        where: { id: buyerIds, role: 'buyer' },
        attributes: ['id', 'name', 'email', 'created_at'],
        order: [['created_at', 'DESC']]
      })
      res.json(buyers)
    } else {
      // Buyer role - access denied
      return res.status(403).json({ message: 'Access denied. Sellers only.' })
    }
  } catch (error) {
    console.error('Error fetching buyers:', error)
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
