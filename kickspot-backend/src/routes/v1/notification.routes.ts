import { Router } from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { listNotifications, markAsRead } from '@/controllers/notification.controller'

const r = Router()

r.get('/', authenticate, authorize(['admin']), listNotifications)
r.put('/:id/read', authenticate, authorize(['admin']), markAsRead)

export default r

