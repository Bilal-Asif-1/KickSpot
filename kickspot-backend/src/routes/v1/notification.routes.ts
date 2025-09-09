import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { listNotifications, markAsRead } from '../../controllers/notification.controller.js'

const r = Router()

r.get('/', authenticate, authorize(['admin']), listNotifications)
r.put('/:id/read', authenticate, authorize(['admin']), markAsRead)

export default r

