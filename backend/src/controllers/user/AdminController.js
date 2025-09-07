import BaseController from '../base/BaseController.js';
import { userService } from '../../services/index.js';

class AdminController extends BaseController {

  getAllUsers = async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();

      return this.sendSuccess(res, 'Users retrieved successfully', { 
        users,
        count: users.length 
      });
    } catch (error) {
      next(error);
    }
  };


  getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const user = await userService.getUserById(id);

      if (!user) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, 'User retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  };


  deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const success = await userService.deleteUser(id);

      if (!success) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminController();
