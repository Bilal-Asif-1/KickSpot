import BaseController from '../base/BaseController.js';
import { orderService } from '../../services/index.js';

class OrderController extends BaseController {

  // Create new order (User)
  createOrder = async (req, res, next) => {
    try {
      const orderData = req.body;
      const userId = req.userId;

      try {
        const order = await orderService.createOrder(orderData, userId);
        
        return this.sendSuccess(
          res, 
          'Order created successfully', 
          { order }, 
          201
        );
      } catch (error) {
        if (error.message.includes('not found') || 
            error.message.includes('Insufficient stock') ||
            error.message.includes('must contain at least one item')) {
          return this.sendError(res, error.message, 400);
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };

  // Get order by ID
  getOrderById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user?.role === 'admin' ? null : req.userId;

      const order = await orderService.getOrderById(id, userId);
      
      if (!order) {
        return this.sendError(res, 'Order not found', 404);
      }
      
      return this.sendSuccess(
        res, 
        'Order retrieved successfully', 
        { order }
      );
    } catch (error) {
      next(error);
    }
  };

  // Get user's orders
  getUserOrders = async (req, res, next) => {
    try {
      const userId = req.userId;
      const queryOptions = req.query;
      
      const result = await orderService.getUserOrders(userId, queryOptions);
      
      return this.sendPagination(
        res, 
        { orders: result.orders },
        result.pagination,
        'Orders retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  // Cancel order
  cancelOrder = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user?.role === 'admin' ? null : req.userId;

      try {
        const order = await orderService.cancelOrder(id, userId);
        
        return this.sendSuccess(
          res, 
          'Order cancelled successfully', 
          { order }
        );
      } catch (error) {
        if (error.message.includes('not found')) {
          return this.sendError(res, error.message, 404);
        }
        if (error.message.includes('Cannot cancel')) {
          return this.sendError(res, error.message, 400);
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();
