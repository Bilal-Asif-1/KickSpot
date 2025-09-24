import { Router } from 'express'
import authRoutes from './v1/auth.routes.js'
import productRoutes from './v1/product.routes.js'
import orderRoutes from './v1/order.routes.js'
import customerRoutes from './v1/customer.routes.js'
import notificationRoutes from './v1/notification.routes.js'
import cartRoutes from './v1/cart.routes.js'
import adminRoutes from './v1/admin.routes.js'
import paymentRoutes from './payment.routes.js'
import capRoutes from './v1/cap.routes.js'
import cteRoutes from './v1/cte.routes.js'

const router = Router()
router.use('/v1/auth', authRoutes)
router.use('/v1/products', productRoutes)
router.use('/v1/orders', orderRoutes)
router.use('/v1/customers', customerRoutes)
router.use('/v1/notifications', notificationRoutes)
router.use('/v1/cart', cartRoutes)
router.use('/v1/admin', adminRoutes)
router.use('/v1/payments', paymentRoutes)
router.use('/v1/cap', capRoutes)
router.use('/v1/cte', cteRoutes)

export default router


