import { Router } from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { createProduct, createProductValidators, deleteProduct, deleteProductValidators, getProduct, getSellerBuyers, getSellerProducts, listProducts, updateProduct, updateProductValidators } from '@/controllers/product.controller'
import { uploadSingle } from '@/middleware/upload'

const r = Router()

// Public routes
r.get('/', listProducts)
r.get('/:id', getProduct)

// Admin/Seller routes
r.post('/', authenticate, authorize(['admin', 'seller']), uploadSingle, createProductValidators, createProduct)
r.put('/:id', authenticate, authorize(['admin']), updateProductValidators, updateProduct)
r.delete('/:id', authenticate, authorize(['admin']), deleteProductValidators, deleteProduct)

// Seller-specific routes
r.get('/seller/my-products', authenticate, authorize(['seller', 'admin']), getSellerProducts)
r.get('/seller/my-buyers', authenticate, authorize(['seller', 'admin']), getSellerBuyers)

export default r


