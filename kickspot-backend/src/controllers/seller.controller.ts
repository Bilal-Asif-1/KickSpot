import { Request, Response } from 'express'
import { User, Product, Order, OrderItem } from '@/models'
import { body, validationResult } from 'express-validator'
import { sequelize } from '@/lib/sequelize'

// Get seller dashboard stats
export async function getSellerDashboard(req: Request, res: Response) {
  try {
    const seller_id = (req as any).user?.id
    if (!seller_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // Get seller info
    const seller = await User.findByPk(seller_id, {
      attributes: ['id', 'name', 'email', 'created_at']
    })

    // Get total products
    const totalProducts = await Product.count({
      where: { seller_id }
    })

    // Get total orders for seller's products
    const totalOrders = await Order.count({
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id },
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
        where: { seller_id },
        attributes: []
      }],
      raw: true
    })

    const totalRevenue = revenueResult[0]?.total_revenue || 0

    // Get recent orders
    const recentOrders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id },
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
      seller,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: parseFloat(totalRevenue)
      },
      recentOrders
    })
  } catch (error) {
    console.error('Error fetching seller dashboard:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get seller's order history
export async function getSellerOrders(req: Request, res: Response) {
  try {
    const seller_id = (req as any).user?.id
    if (!seller_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          where: { seller_id },
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
    console.error('Error fetching seller orders:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Update seller profile
export const updateSellerProfileValidators = [
  body('name').optional().isString().notEmpty(),
  body('email').optional().isEmail(),
]

export async function updateSellerProfile(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const seller_id = (req as any).user?.id
    if (!seller_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const seller = await User.findByPk(seller_id)
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' })
    }

    await seller.update(req.body)
    res.json({
      id: seller.id,
      name: seller.name,
      email: seller.email,
      role: seller.role
    })
  } catch (error) {
    console.error('Error updating seller profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
