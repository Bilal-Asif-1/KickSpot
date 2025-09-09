import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { deleteCustomer, deleteCustomerValidators, getCustomer, getCustomerValidators, listCustomers } from '../../controllers/customer.controller.js'

const r = Router()

r.get('/', authenticate, authorize(['admin']), listCustomers)
r.get('/:id', authenticate, authorize(['admin']), getCustomerValidators, getCustomer)
r.delete('/:id', authenticate, authorize(['admin']), deleteCustomerValidators, deleteCustomer)

export default r


