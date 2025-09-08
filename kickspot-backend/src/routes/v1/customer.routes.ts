import { Router } from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { deleteCustomer, deleteCustomerValidators, getCustomer, getCustomerValidators, listCustomers } from '@/controllers/customer.controller'

const r = Router()

r.get('/', authenticate, authorize(['admin']), listCustomers)
r.get('/:id', authenticate, authorize(['admin']), getCustomerValidators, getCustomer)
r.delete('/:id', authenticate, authorize(['admin']), deleteCustomerValidators, deleteCustomer)

export default r


