import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { getAdminDashboard, getAdminProducts, getAdminOrders, getAdminBuyers, updateAdminProfile, updateAdminProfileValidators } from '../../controllers/admin.controller.js'

const r = Router()

// All admin routes require authentication and seller role
r.use(authenticate)
r.use(authorize(['seller']))

// Admin dashboard
r.get('/dashboard', getAdminDashboard)

// Admin products
r.get('/products', getAdminProducts)

// Admin orders
r.get('/orders', getAdminOrders)

// Admin buyers
r.get('/buyers', getAdminBuyers)

// Update admin profile
r.put('/profile', updateAdminProfileValidators, updateAdminProfile)

export default r
