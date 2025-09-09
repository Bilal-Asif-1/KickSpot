import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { createProduct, createProductValidators, deleteProduct, deleteProductValidators, getProduct, listProducts, updateProduct, updateProductValidators } from '../../controllers/product.controller.js'
import { uploadSingle } from '../../middleware/upload.js'

const r = Router()

// Public routes
r.get('/', listProducts)
r.get('/:id', getProduct)

// Admin routes
r.post('/', authenticate, authorize(['admin']), uploadSingle, createProduct)
r.put('/:id', authenticate, authorize(['admin']), uploadSingle, updateProductValidators, updateProduct)
r.delete('/:id', authenticate, authorize(['admin']), deleteProductValidators, deleteProduct)


export default r


