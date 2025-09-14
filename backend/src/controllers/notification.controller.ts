import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { NotificationService } from '../services/notificationService.js'
import { param, query, validationResult } from 'express-validator'

// Get user notifications (for both admin and regular users)
export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    console.log(`Fetching notifications for user ${userId} with role ${userRole}`);

    let result
    if (userRole === 'admin') {
      result = await NotificationService.getAdminNotifications(userId, page, limit)
    } else {
      // For regular users (including sellers), get their notifications
      result = await NotificationService.getUserNotifications(userId, page, limit)
    }
    
    console.log(`Found ${result.notifications.length} notifications for user ${userId}`);
    res.json(result)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    // Return empty notifications if database is not available
    res.json({
      notifications: [],
      total: 0,
      page: 1,
      totalPages: 0
    })
  }
}

// Get unread notification count (for both admin and regular users)
export async function getUnreadCount(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    
    let count
    if (userRole === 'admin') {
      count = await NotificationService.getUnreadCount(userId)
    } else {
      // For regular users (including sellers), get their unread count
      count = await NotificationService.getUserUnreadCount(userId)
    }
    res.json({ count })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    // Return 0 count if database is not available
    res.json({ count: 0 })
  }
}

// Mark notification as read
export const markAsReadValidators = [
  param('id').isInt({ min: 1 })
]

export async function markAsRead(req: AuthRequest, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    const notificationId = parseInt(req.params.id)

    const success = await NotificationService.markAsRead(notificationId, userId, userRole)
    if (!success) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Mark all notifications as read
export async function markAllAsRead(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    
    let updatedCount
    if (userRole === 'admin') {
      updatedCount = await NotificationService.markAllAsRead(userId)
    } else {
      // For regular users, we need to implement markAllAsRead for users
      updatedCount = await NotificationService.markAllUserNotificationsAsRead(userId)
    }
    
    res.json({ message: `${updatedCount} notifications marked as read` })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Delete notification
export const deleteNotificationValidators = [
  param('id').isInt({ min: 1 })
]

export async function deleteNotification(req: AuthRequest, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    const notificationId = parseInt(req.params.id)

    const success = await NotificationService.deleteNotification(notificationId, userId, userRole)
    if (!success) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json({ message: 'Notification deleted' })
  } catch (error) {
    console.error('Error deleting notification:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}