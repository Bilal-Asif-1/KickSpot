import BaseController from '../base/BaseController.js';
import { orderService } from '../../services/index.js';

class AdminOrderController extends BaseController {

  // Get all orders (Admin)
  getAllOrders = async (req, res, next) => {
    try {
      const queryOptions = req.query;
      
      const result = await orderService.getAllOrders(queryOptions);
      
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

  // Update order status (Admin)
  updateOrderStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const statusData = req.body;

      try {
        const order = await orderService.updateOrderStatus(id, statusData);
        
        return this.sendSuccess(
          res, 
          'Order status updated successfully', 
          { order }
        );
      } catch (error) {
        if (error.message.includes('not found')) {
          return this.sendError(res, error.message, 404);
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };

  // Get order statistics for dashboard (Admin)
  getOrderStats = async (req, res, next) => {
    try {
      const stats = await orderService.getOrderStats();
      
      return this.sendSuccess(
        res, 
        'Order statistics retrieved successfully', 
        { stats }
      );
    } catch (error) {
      next(error);
    }
  };

  // Get order by ID with full details (Admin)
  getOrderDetails = async (req, res, next) => {
    try {
      const { id } = req.params;

      const order = await orderService.getOrderById(id); // Admin gets all orders
      
      if (!order) {
        return this.sendError(res, 'Order not found', 404);
      }
      
      return this.sendSuccess(
        res, 
        'Order details retrieved successfully', 
        { order }
      );
    } catch (error) {
      next(error);
    }
  };

}

export default new AdminOrderController();
