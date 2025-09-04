const express = require('express');
const router = express.Router();
const { AdminController } = require('../controllers/user');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const { idParamValidation, paginationValidation } = require('../middleware/validationMiddleware');

// Admin routes
router.get('/', auth, isAdmin, paginationValidation, AdminController.getAllUsers);
router.get('/:id', auth, isAdmin, idParamValidation, AdminController.getUserById);
router.delete('/:id', auth, isAdmin, idParamValidation, AdminController.deleteUser);

module.exports = router;
