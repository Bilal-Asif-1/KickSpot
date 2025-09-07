

import { body, param, query, validationResult } from 'express-validator';


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.badRequest('Validation failed', errors.array());
  }
  next();
};

const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];


const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];


const profileUpdateValidation = [
  body('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email address'),
  validate
];


const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate
];


const productCreateValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('categoryId')
    .optional()
    .isInt().withMessage('Category ID must be an integer'),
  validate
];


const productUpdateValidation = [
  body('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
  body('description')
    .optional()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0.01 }).withMessage('Price must be greater than 0'),
  body('categoryId')
    .optional()
    .isInt().withMessage('Category ID must be an integer'),
  validate
];

const idParamValidation = [
  param('id')
    .isInt().withMessage('ID must be an integer'),
  validate
];


const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate
];

// Order validation
const orderCreateValidation = [
  body('items')
    .notEmpty().withMessage('Order items are required')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .notEmpty().withMessage('Product ID is required for each item')
    .isInt().withMessage('Product ID must be an integer'),
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required for each item')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('shippingDetails.name')
    .notEmpty().withMessage('Shipping name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('shippingDetails.email')
    .notEmpty().withMessage('Shipping email is required')
    .isEmail().withMessage('Must be a valid email address'),
  body('shippingDetails.phone')
    .optional()
    .isLength({ min: 10, max: 15 }).withMessage('Phone must be between 10 and 15 characters'),
  body('shippingDetails.address')
    .notEmpty().withMessage('Shipping address is required'),
  body('shippingDetails.city')
    .notEmpty().withMessage('City is required'),
  body('shippingDetails.state')
    .notEmpty().withMessage('State is required'),
  body('shippingDetails.zip')
    .notEmpty().withMessage('ZIP code is required'),
  body('paymentDetails.method')
    .optional()
    .isIn(['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  validate
];

const orderStatusUpdateValidation = [
  body('status')
    .notEmpty().withMessage('Order status is required')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('adminNotes')
    .optional()
    .isString().withMessage('Admin notes must be a string'),
  body('trackingNumber')
    .optional()
    .isString().withMessage('Tracking number must be a string'),
  body('estimatedDelivery')
    .optional()
    .isISO8601().withMessage('Estimated delivery must be a valid date'),
  validate
];

export {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
  passwordChangeValidation,
  productCreateValidation,
  productUpdateValidation,
  idParamValidation,
  paginationValidation,
  orderCreateValidation,
  orderStatusUpdateValidation,
  validate
};
