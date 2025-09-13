import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { Order, OrderItem, Product, Notification, User } from '../models/index.js'
import { body, param, validationResult } from 'express-validator'
import { NotificationService } from '../services/notificationService.js'
import { io } from '../index.js'
import { updateProductBuyCount } from './product.controller.js'

export const placeOrderValidators = [
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt(),
  body('items.*.quantity').isInt({ min: 1 }),
]

export async function placeOrder(req: AuthRequest, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const userId = req.user!.id
  const items: Array<{ product_id: number; quantity: number }> = req.body.items

  const products = await Product.findAll({ where: { id: items.map(i => i.product_id) } as any })
  const byId = new Map(products.map(p => [p.id, p]))
  let total = 0
  for (const it of items) {
    const p = byId.get(it.product_id)
    if (!p || p.stock < it.quantity) return res.status(400).json({ message: 'Invalid stock' })
    total += p.price * it.quantity
  }

  const order = await Order.create({ user_id: userId, total_price: total, status: 'pending' })
  
  // Get customer info for notifications
  const customer = await User.findByPk(userId, { attributes: ['id', 'name', 'email'] })
  const customerName = customer?.name || 'Unknown Customer'
  
  // Track admins who should receive notifications and check for new customers
  const adminNotifications = new Map<number, { products: string[], isNewCustomer: boolean }>()
  
  for (const it of items) {
    const p = byId.get(it.product_id)!
    await OrderItem.create({ order_id: order.id, product_id: p.id, quantity: it.quantity, price: p.price })
    await p.update({ stock: p.stock - it.quantity })
    
    // Update product buyCount
    await updateProductBuyCount(p.id, it.quantity)
    
    // Track admin for this product
    if (p.seller_id) {
      if (!adminNotifications.has(p.seller_id)) {
        // Check if this is customer's first purchase from this admin
        const previousOrders = await Order.count({
          where: { user_id: userId },
          include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [{
              model: Product,
              as: 'product',
              where: { seller_id: p.seller_id }
            }]
          }]
        })
        
        adminNotifications.set(p.seller_id, { 
          products: [], 
          isNewCustomer: previousOrders === 0 
        })
      }
      adminNotifications.get(p.seller_id)!.products.push(p.name)
    }
    
    // Low stock notification for specific admin
    if (p.stock - it.quantity <= 5 && p.seller_id) {
      await NotificationService.createLowStockNotification(
        p.id, 
        p.name, 
        p.stock - it.quantity, 
        p.seller_id
      )
    }
  }

  // Create order notifications for each affected admin
  for (const [adminId, data] of adminNotifications) {
    // Calculate admin's portion of the order total
    const adminOrderItems = await OrderItem.findAll({
      where: { order_id: order.id },
      include: [{
        model: Product,
        as: 'product',
        where: { seller_id: adminId }
      }]
    })
    
    const adminTotal = adminOrderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    
    // Create order notification
    await NotificationService.createOrderNotification(
      order.id,
      adminId,
      customerName,
      adminTotal
    )
    
    // Create new customer notification if applicable
    if (data.isNewCustomer && customer) {
      await NotificationService.createNewCustomerNotification(
        customer.id,
        customer.name,
        customer.email,
        adminId
      )
    }
  }

  // Create user notification for order placement
  await NotificationService.createOrderUpdateNotification(
    userId,
    order.id,
    'pending',
    'high'
  )

  res.status(201).json({ id: order.id, total_price: order.total_price, status: order.status })
}

export async function listOrders(req: AuthRequest, res: Response) {
  const commonInclude = [
    { model: OrderItem, as: 'orderItems', include: [{ model: Product, as: 'product' }] }
  ]

  if (req.user!.role === 'admin') {
    // Admin should only see orders containing their products
    const adminOrderItems = await OrderItem.findAll({
      include: [{
        model: Product,
        as: 'product',
        where: { seller_id: req.user!.id },
        attributes: []
      }],
      attributes: ['order_id'],
      group: ['order_id']
    })

    const adminOrderIds = adminOrderItems.map(item => item.order_id)
    
    if (adminOrderIds.length === 0) {
      return res.json([])
    }

    const orders = await Order.findAll({ 
      where: { id: adminOrderIds },
      include: [{
        model: OrderItem, 
        as: 'orderItems', 
        include: [{ 
          model: Product, 
          as: 'product',
          where: { seller_id: req.user!.id }
        }]
      }]
    })
    return res.json(orders)
  }
  const orders = await Order.findAll({ where: { user_id: req.user!.id }, include: commonInclude })
  res.json(orders)
}

export const updateStatusValidators = [
  param('id').isInt(),
  body('status').isIn(['pending', 'processing', 'delivered'])
]

export async function updateStatus(req: AuthRequest, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const order = await Order.findByPk(req.params.id)
  if (!order) return res.status(404).json({ message: 'Not found' })
  
  const oldStatus = order.status
  await order.update({ status: req.body.status })
  
  // Create order status change notification for buyer
  if (oldStatus !== req.body.status) {
    try {
      await NotificationService.createOrderStatusChangeNotification(
        order.user_id,
        order.id,
        oldStatus,
        req.body.status
      )
    } catch (error) {
      console.error('Failed to create order status notification:', error)
      // Don't fail the status update if notification fails
    }
  }
  
  res.json(order)
}

export const deleteOrderValidators = [param('id').isInt()]

export async function deleteOrder(req: AuthRequest, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  
  const { id } = req.params
  const userId = req.user!.id
  const userRole = req.user!.role
  
  try {
    const order = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'seller_id']
        }]
      }]
    })
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    // Check permissions
    if (userRole === 'admin') {
      // Admin can only delete orders that contain their products
      const hasAdminProducts = order.orderItems?.some(item => 
        item.product?.seller_id === userId
      )
      if (!hasAdminProducts) {
        return res.status(403).json({ message: 'You can only delete orders containing your products' })
      }
    } else {
      // Regular user can only delete their own orders
      if (order.user_id !== userId) {
        return res.status(403).json({ message: 'You can only delete your own orders' })
      }
    }
    
    // Delete order items first (cascade)
    if (order.orderItems) {
      await OrderItem.destroy({
        where: { order_id: order.id }
      })
    }
    
    // Delete the order
    await order.destroy()
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting order:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


