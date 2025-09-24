/**
 * 🚀 ESSENTIAL CTE SERVICE
 * 
 * Basic Common Table Expressions for essential analytics
 */

import { sequelize } from '../lib/sequelize.js';

export class CTEService {
  
  /**
   * Get top selling products by category
   */
  static async getTopSellingProducts() {
    const query = `
      WITH product_sales AS (
        SELECT 
          p.id, p.name, p.category, p.price,
          COALESCE(SUM(oi.quantity), 0) as total_sold,
          COALESCE(SUM(oi.quantity * oi.price), 0) as total_revenue
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'delivered'
        WHERE p.is_deleted = false
        GROUP BY p.id, p.name, p.category, p.price
      ),
      ranked_products AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY category ORDER BY total_sold DESC) as rank
        FROM product_sales
        WHERE total_sold > 0
      )
      SELECT * FROM ranked_products WHERE rank <= 3 ORDER BY category, rank;
    `;
    
    return await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }
  
  /**
   * Get customer lifetime value
   */
  static async getCustomerLifetimeValue() {
    const query = `
      WITH customer_orders AS (
        SELECT 
          u.id, u.name, u.email,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(o.total_price) as total_spent,
          AVG(o.total_price) as avg_order_value
        FROM users u
        JOIN orders o ON u.id = o.user_id
        WHERE u.role = 'buyer' AND o.status = 'delivered'
        GROUP BY u.id, u.name, u.email
      ),
      customer_segments AS (
        SELECT *,
               CASE 
                 WHEN total_spent >= 1000 THEN 'VIP'
                 WHEN total_spent >= 500 THEN 'Premium'
                 WHEN total_spent >= 100 THEN 'Regular'
                 ELSE 'New'
               END as segment
        FROM customer_orders
      )
      SELECT segment, COUNT(*) as customer_count, AVG(total_spent) as avg_lifetime_value
      FROM customer_segments
      GROUP BY segment
      ORDER BY avg_lifetime_value DESC;
    `;
    
    return await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }
  
  /**
   * Get monthly sales trend
   */
  static async getMonthlySalesTrend() {
    const query = `
      WITH monthly_sales AS (
        SELECT 
          DATE_FORMAT(o.created_at, '%Y-%m') as month,
          COUNT(DISTINCT o.id) as total_orders,
          SUM(o.total_price) as total_revenue,
          AVG(o.total_price) as avg_order_value
        FROM orders o
        WHERE o.status = 'delivered'
        GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
        ORDER BY month
      ),
      monthly_growth AS (
        SELECT *,
               LAG(total_revenue) OVER (ORDER BY month) as prev_month_revenue
        FROM monthly_sales
      )
      SELECT 
        month, total_orders, total_revenue, avg_order_value,
        CASE 
          WHEN prev_month_revenue IS NULL THEN 0
          ELSE ROUND(((total_revenue - prev_month_revenue) / prev_month_revenue) * 100, 2)
        END as growth_percent
      FROM monthly_growth
      ORDER BY month;
    `;
    
    return await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }
}
