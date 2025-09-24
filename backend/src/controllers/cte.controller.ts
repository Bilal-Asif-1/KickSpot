/**
 * 🚀 CTE CONTROLLER
 * 
 * Basic CTE analytics endpoints
 */

import { Request, Response } from 'express';
import { CTEService } from '../services/cteService.js';

/**
 * Get top selling products
 */
export async function getTopSellingProducts(req: Request, res: Response) {
  try {
    const results = await CTEService.getTopSellingProducts();
    res.json({
      success: true,
      data: results,
      message: 'Top selling products retrieved using CTE'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get top selling products'
    });
  }
}

/**
 * Get customer lifetime value
 */
export async function getCustomerLifetimeValue(req: Request, res: Response) {
  try {
    const results = await CTEService.getCustomerLifetimeValue();
    res.json({
      success: true,
      data: results,
      message: 'Customer lifetime value analysis retrieved using CTE'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get customer lifetime value'
    });
  }
}

/**
 * Get monthly sales trend
 */
export async function getMonthlySalesTrend(req: Request, res: Response) {
  try {
    const results = await CTEService.getMonthlySalesTrend();
    res.json({
      success: true,
      data: results,
      message: 'Monthly sales trend retrieved using CTE'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to get monthly sales trend'
    });
  }
}
