import express from 'express';
const router = express.Router();
import { ProductController, ProductQueryController } from '../controllers/product/index.js';
import auth from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';
import {
  productCreateValidation,
  productUpdateValidation,
  idParamValidation,
  paginationValidation
} from '../middleware/validationMiddleware.js';

// Public routes (no authentication required)
router.get('/', paginationValidation, ProductQueryController.getAllProducts);
router.get('/category/:category', paginationValidation, ProductQueryController.getProductsByCategory);

// Protected routes (authentication required)
router.use(auth);

// Get user's products (must come before /:id route)
router.get('/user/my-products', paginationValidation, ProductQueryController.getUserProducts);

// Create product (admin only)
router.post('/', productCreateValidation, isAdmin, ProductController.createProduct);

// Get Product by ID (must come after specific routes)
router.get('/:id', idParamValidation, ProductController.getProductById);

// Update product (admin only)
router.put('/:id', idParamValidation, productUpdateValidation, isAdmin, ProductController.updateProduct);

// Delete product (admin only)
router.delete('/:id', idParamValidation, isAdmin, ProductController.deleteProduct);

export default router;
