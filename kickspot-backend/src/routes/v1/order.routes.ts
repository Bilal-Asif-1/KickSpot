import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { listOrders, placeOrder, placeOrderValidators, updateStatus, updateStatusValidators } from '../../controllers/order.controller.js'

const r = Router()

r.get('/', authenticate, listOrders)
r.post('/', authenticate, authorize(['user']), placeOrderValidators, placeOrder)
r.put('/:id/status', authenticate, authorize(['admin']), updateStatusValidators, updateStatus)

export default r


