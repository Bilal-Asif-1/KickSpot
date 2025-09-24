import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  markAsReadValidators,
  deleteNotificationValidators 
} from '../../controllers/notification.controller.js'

const r = Router()

// Get notifications (for both admin and regular users)
r.get('/', authenticate, getNotifications)

// Get unread notification count (for both admin and regular users)
r.get('/unread-count', authenticate, getUnreadCount)

// Mark notification as read
r.patch('/:id/read', authenticate, markAsReadValidators, markAsRead)

// Mark all notifications as read
r.patch('/mark-all-read', authenticate, markAllAsRead)

// Delete notification
r.delete('/:id', authenticate, deleteNotification)

export default r

