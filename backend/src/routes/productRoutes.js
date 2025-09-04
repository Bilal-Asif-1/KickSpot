const express = require('express');
const router = express.Router();
const { ProductController, ProductQueryController } = require('../controllers/product');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const {
  productCreateValidation,
  productUpdateValidation,
  idParamValidation,
  paginationValidation
} = require('../middleware/validationMiddleware');

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

module.exports = router;
