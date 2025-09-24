/**
 * 🚀 CTE ROUTES
 */

import { Router } from 'express';
import { 
  getTopSellingProducts, 
  getCustomerLifetimeValue, 
  getMonthlySalesTrend 
} from '../../controllers/cte.controller.js';

const router = Router();

router.get('/top-selling-products', getTopSellingProducts);
router.get('/customer-lifetime-value', getCustomerLifetimeValue);
router.get('/monthly-sales-trend', getMonthlySalesTrend);

export default router;
