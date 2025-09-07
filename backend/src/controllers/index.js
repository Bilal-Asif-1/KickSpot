/**
 * Controllers Index
 * Export all controllers
 */

import * as userControllers from './user/index.js';
import * as productControllers from './product/index.js';

export {
  // User Controllers
  ...userControllers,
  
  // Product Controllers
  ...productControllers
};
