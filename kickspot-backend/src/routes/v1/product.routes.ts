import { Router } from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { createProduct, createProductValidators, deleteProduct, deleteProductValidators, getProduct, listProducts, updateProduct, updateProductValidators } from '@/controllers/product.controller'

const r = Router()

r.get('/', listProducts)
r.get('/:id', getProduct)

r.post('/', authenticate, authorize(['admin']), createProductValidators, createProduct)
r.put('/:id', authenticate, authorize(['admin']), updateProductValidators, updateProduct)
r.delete('/:id', authenticate, authorize(['admin']), deleteProductValidators, deleteProduct)

export default r


