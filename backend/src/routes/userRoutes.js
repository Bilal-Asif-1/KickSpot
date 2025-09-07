import express from 'express';
const router = express.Router();
import { AdminController } from '../controllers/user/index.js';
import auth from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import { idParamValidation, paginationValidation } from '../middleware/validationMiddleware.js';

// Admin routes
router.get('/', auth, isAdmin, paginationValidation, AdminController.getAllUsers);
router.get('/:id', auth, isAdmin, idParamValidation, AdminController.getUserById);
router.delete('/:id', auth, isAdmin, idParamValidation, AdminController.deleteUser);

export default router;
