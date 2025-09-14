import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { createProduct, createProductValidators, deleteProduct, deleteProductValidators, getProduct, listProducts, updateProduct, updateProductValidators, getBestSellers, getProductsByCategory, getSaleProducts } from '../../controllers/product.controller.js'
import { uploadSingle } from '../../middleware/upload.js'

const r = Router()

// Public routes
r.get('/', listProducts)
r.get('/sale', getSaleProducts)
r.get('/bestsellers', getBestSellers)
r.get('/category/:category', getProductsByCategory)
r.get('/:id', getProduct)

// Seller routes
r.post('/', authenticate, authorize(['seller']), uploadSingle, createProduct)
r.put('/:id', authenticate, authorize(['seller']), uploadSingle, updateProductValidators, updateProduct)
r.delete('/:id', authenticate, authorize(['seller']), deleteProductValidators, deleteProduct)


export default r


