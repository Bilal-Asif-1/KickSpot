/**
 * 🚀 CAP THEOREM CONTROLLER
 * 
 * Basic CAP Theorem monitoring endpoints
 */

import { Request, Response } from 'express';
import { CapService } from '../services/capService.js';

/**
 * Get system health status
 */
export async function getHealthStatus(req: Request, res: Response) {
  try {
    const health = await CapService.getHealthStatus();
    res.json({
      success: true,
      data: health,
      message: 'System health retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get system health'
    });
  }
}

/**
 * Test CAP Theorem properties
 */
export async function testCapTheorem(req: Request, res: Response) {
  try {
    // Test consistency
    const health = await CapService.getHealthStatus();
    
    res.json({
      success: true,
      data: {
        capTheorem: {
          system: 'CP System (Consistency + Partition Tolerance)',
          consistency: health.consistency,
          availability: health.availability,
          partitionTolerance: 'Implemented'
        },
        tests: {
          consistency: health.consistency === 'strong' ? 'Passed' : 'Failed',
          availability: health.availability === 'available' ? 'Passed' : 'Failed'
        }
      },
      message: 'CAP Theorem test completed'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'CAP Theorem test failed'
    });
  }
}
