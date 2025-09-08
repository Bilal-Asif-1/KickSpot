import { Router } from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { getSellerDashboard, getSellerOrders, updateSellerProfile, updateSellerProfileValidators } from '@/controllers/seller.controller'

const r = Router()

// All seller routes require authentication and seller role
r.use(authenticate)
r.use(authorize(['seller', 'admin']))

// Seller dashboard
r.get('/dashboard', getSellerDashboard)

// Seller orders
r.get('/orders', getSellerOrders)

// Update seller profile
r.put('/profile', updateSellerProfileValidators, updateSellerProfile)

export default r
