const express = require('express');
const router = express.Router();
const { AuthController, ProfileController } = require('../controllers/user');
const auth = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  passwordChangeValidation
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthController.login);

// Protected routes
router.get('/profile', auth, ProfileController.getProfile);
router.put('/profile', auth, profileUpdateValidation, ProfileController.updateProfile);
router.put('/change-password', auth, passwordChangeValidation, ProfileController.changePassword);

module.exports = router;
