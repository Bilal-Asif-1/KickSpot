import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { Order, OrderItem, Product, Notification } from '../models/index.js'
import { body, param, validationResult } from 'express-validator'
import { io } from '../index.js'

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
  for (const it of items) {
    const p = byId.get(it.product_id)!
    await OrderItem.create({ order_id: order.id, product_id: p.id, quantity: it.quantity, price: p.price })
    await p.update({ stock: p.stock - it.quantity })
    if (p.stock - it.quantity <= 5) {
      const n = await Notification.create({ type: 'low-stock', message: `${p.name} low stock: ${p.stock - it.quantity}` })
      io.emit('notification', n.toJSON())
    }
  }

  const n = await Notification.create({ type: 'order', message: `New order #${order.id}` })
  io.emit('notification', n.toJSON())

  res.status(201).json({ id: order.id, total_price: order.total_price, status: order.status })
}

export async function listOrders(req: AuthRequest, res: Response) {
  if (req.user!.role === 'admin') {
    const orders = await Order.findAll({ include: [OrderItem] })
    return res.json(orders)
  }
  const orders = await Order.findAll({ where: { user_id: req.user!.id }, include: [OrderItem] })
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
  await order.update({ status: req.body.status })
  res.json(order)
}


