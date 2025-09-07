import BaseController from '../base/BaseController.js';
import { userService } from '../../services/index.js';

class AuthController extends BaseController {

  register = async (req, res, next) => {
    try {
      const userData = req.body;

      try {
        const result = await userService.register(userData);
        
        return this.sendSuccess(
          res, 
          'User registered successfully', 
          result, 
          201
        );
      } catch (error) {
        if (error.message === 'User with this email already exists') {
          return this.sendError(res, error.message, 400);
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };


  login = async (req, res, next) => {
    try {
      const credentials = req.body;

      try {
        const result = await userService.login(credentials);
        
        return this.sendSuccess(
          res, 
          'Login successful', 
          result
        );
      } catch (error) {
        if (error.message === 'Invalid credentials') {
          return this.sendError(res, error.message, 401);
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
