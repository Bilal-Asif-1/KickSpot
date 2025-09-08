import { Router } from 'express'
import authRoutes from './v1/auth.routes'
import productRoutes from './v1/product.routes'
import orderRoutes from './v1/order.routes'
import customerRoutes from './v1/customer.routes'
import notificationRoutes from './v1/notification.routes'

const router = Router()
router.use('/v1/auth', authRoutes)
router.use('/v1/products', productRoutes)
router.use('/v1/orders', orderRoutes)
router.use('/v1/customers', customerRoutes)
router.use('/v1/notifications', notificationRoutes)

export default router


