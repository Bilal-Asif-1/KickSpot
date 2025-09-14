import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { listOrders, placeOrder, placeOrderValidators, updateStatus, updateStatusValidators, deleteOrder, deleteOrderValidators } from '../../controllers/order.controller.js'

const r = Router()

r.get('/', authenticate, listOrders)
r.post('/', authenticate, authorize(['buyer']), placeOrderValidators, placeOrder)
r.put('/:id/status', authenticate, authorize(['seller']), updateStatusValidators, updateStatus)
r.delete('/:id', authenticate, deleteOrderValidators, deleteOrder)

export default r


