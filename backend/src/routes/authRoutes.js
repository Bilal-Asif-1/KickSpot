import express from 'express';
const router = express.Router();
import { AuthController, ProfileController } from '../controllers/user/index.js';
import auth from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  passwordChangeValidation
} from '../middleware/validationMiddleware.js';

// Public routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

// Protected routes
router.get('/profile', auth, ProfileController.getProfile);
router.put('/profile', auth, profileUpdateValidation, ProfileController.updateProfile);
router.put('/change-password', auth, passwordChangeValidation, ProfileController.changePassword);

export default router;
