import BaseController from '../base/BaseController.js';
import { userService } from '../../services/index.js';

class ProfileController extends BaseController {

  getProfile = async (req, res, next) => {
    try {
      const userId = req.userId;
      const user = await userService.getUserById(userId);

      if (!user) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, 'Profile retrieved successfully', { user });
    } catch (error) {
      next(error);
    }
  };


  updateProfile = async (req, res, next) => {
    try {
      const { name, email } = req.body;
      const userId = req.userId;

      const updatedUser = await userService.updateUser(userId, { name, email });
      
      if (!updatedUser) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(
        res, 
        'Profile updated successfully', 
        { user: updatedUser }
      );
    } catch (error) {
      if (error.message === 'Email already in use') {
        return this.sendError(res, error.message, 400);
      }
      next(error);
    }
  };


  changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.userId;

      const success = await userService.changePassword(userId, currentPassword, newPassword);
      
      if (!success) {
        return this.sendError(res, 'Failed to change password', 400);
      }

      return this.sendSuccess(res, 'Password changed successfully');
    } catch (error) {
      if (error.message === 'Current password is incorrect' || 
          error.message === 'User not found') {
        return this.sendError(res, error.message, 400);
      }
      next(error);
    }
  };
}

export default new ProfileController();
