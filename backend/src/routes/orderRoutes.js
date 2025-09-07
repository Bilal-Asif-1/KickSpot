import express from 'express';
const router = express.Router();
import { OrderController, AdminOrderController } from '../controllers/order/index.js';
import auth from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import {
  orderCreateValidation,
  orderStatusUpdateValidation,
  idParamValidation,
  paginationValidation
} from '../middleware/validationMiddleware.js';

// User Order Routes (Protected)
router.use(auth); // All order routes require authentication

// Create order (Users)
router.post('/', orderCreateValidation, OrderController.createOrder);

// Get user's orders (Users)
router.get('/my-orders', paginationValidation, OrderController.getUserOrders);

// Get order by ID (Users can only see their own orders, Admins can see all)
router.get('/:id', idParamValidation, OrderController.getOrderById);

// Cancel order (Users can only cancel their own orders, Admins can cancel any)
router.put('/:id/cancel', idParamValidation, OrderController.cancelOrder);

// Admin Order Routes (Admin only)
router.use(isAdmin);

// Get all orders (Admin only)
router.get('/admin/all', paginationValidation, AdminOrderController.getAllOrders);

// Get order statistics for dashboard (Admin only)
router.get('/admin/stats', AdminOrderController.getOrderStats);

// Get order details (Admin only)
router.get('/admin/:id/details', idParamValidation, AdminOrderController.getOrderDetails);

// Update order status (Admin only)
router.put('/admin/:id/status', idParamValidation, orderStatusUpdateValidation, AdminOrderController.updateOrderStatus);

export default router;
