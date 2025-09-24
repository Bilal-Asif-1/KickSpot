/**
 * 🚀 CAP THEOREM ROUTES
 */

import { Router } from 'express';
import { getHealthStatus, testCapTheorem } from '../../controllers/cap.controller.js';

const router = Router();

router.get('/health', getHealthStatus);
router.get('/test', testCapTheorem);

export default router;
