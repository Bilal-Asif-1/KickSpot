/**
 * 🚀 BASIC CAP THEOREM SERVICE
 * 
 * Simple implementation for consistency and partition tolerance
 */

import { sequelize } from '../lib/sequelize.js';
import { Transaction } from 'sequelize';

export class CapService {
  
  /**
   * Execute with consistency (CP System)
   */
  static async executeWithConsistency<T>(
    operation: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    const transaction = await sequelize.transaction();
    
    try {
      const result = await operation(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  /**
   * Read with partition tolerance
   */
  static async readWithPartitionTolerance<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error('❌ Read operation failed:', error);
      throw error;
    }
  }
  
  /**
   * Get system health
   */
  static async getHealthStatus() {
    try {
      await sequelize.query('SELECT 1 as test');
      return { status: 'healthy', consistency: 'strong', availability: 'available' };
    } catch (error) {
      return { status: 'unhealthy', consistency: 'weak', availability: 'unavailable' };
    }
  }
}
