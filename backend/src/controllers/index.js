/**
 * Controllers Index
 * Export all controllers
 */

const userControllers = require('./user');
const productControllers = require('./product');

module.exports = {
  // User Controllers
  ...userControllers,
  
  // Product Controllers
  ...productControllers
};