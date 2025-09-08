import { Request, Response } from 'express'
import { Notification } from '@/models'

export async function listNotifications(_req: Request, res: Response) {
  const notifications = await Notification.findAll({ order: [['created_at', 'DESC']] })
  res.json(notifications)
}

export async function markAsRead(req: Request, res: Response) {
  const { id } = req.params
  const notification = await Notification.findByPk(id)
  if (!notification) return res.status(404).json({ message: 'Not found' })
  await notification.update({ is_read: true })
  res.json(notification)
}

