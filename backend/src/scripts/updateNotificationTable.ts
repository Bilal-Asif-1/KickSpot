import { sequelize } from '../lib/sequelize.js'

async function updateNotificationTable() {
  try {
    console.log('Updating notification table...')
    
    // Check if table exists
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'notifications'")
    if (tables.length === 0) {
      console.log('Notification table does not exist. Creating...')
      await sequelize.query(`
        CREATE TABLE notifications (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL DEFAULT 'Notification',
          message TEXT NOT NULL,
          type ENUM('order_update', 'account_security', 'cart_wishlist', 'offers_promotions', 'order', 'new-customer', 'low-stock', 'product-updated', 'payment-received', 'inventory-alert') NOT NULL,
          is_read BOOLEAN NOT NULL DEFAULT FALSE,
          admin_id INT UNSIGNED NULL,
          user_id INT UNSIGNED NULL,
          priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
          metadata TEXT NULL,
          order_id INT UNSIGNED NULL,
          product_id INT UNSIGNED NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_admin_id (admin_id),
          INDEX idx_user_id (user_id),
          INDEX idx_order_id (order_id),
          INDEX idx_product_id (product_id),
          INDEX idx_is_read (is_read)
        )
      `)
      console.log('Notification table created successfully!')
    } else {
      console.log('Notification table exists. Checking for missing columns...')
      
      // Check existing columns
      const [columns] = await sequelize.query('DESCRIBE notifications')
      const columnNames = columns.map((col: any) => col.Field)
      
      // Add missing columns
      if (!columnNames.includes('title')) {
        await sequelize.query('ALTER TABLE notifications ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT "Notification"')
        console.log('Added title column')
      }
      
      if (!columnNames.includes('user_id')) {
        await sequelize.query('ALTER TABLE notifications ADD COLUMN user_id INT UNSIGNED NULL')
        console.log('Added user_id column')
      }
      
      if (!columnNames.includes('order_id')) {
        await sequelize.query('ALTER TABLE notifications ADD COLUMN order_id INT UNSIGNED NULL')
        console.log('Added order_id column')
      }
      
      if (!columnNames.includes('product_id')) {
        await sequelize.query('ALTER TABLE notifications ADD COLUMN product_id INT UNSIGNED NULL')
        console.log('Added product_id column')
      }
      
      // Update type enum if needed
      try {
        await sequelize.query(`
          ALTER TABLE notifications 
          MODIFY COLUMN type ENUM('order_update', 'account_security', 'cart_wishlist', 'offers_promotions', 'order', 'new-customer', 'low-stock', 'product-updated', 'payment-received', 'inventory-alert') NOT NULL
        `)
        console.log('Updated type enum')
      } catch (e) {
        console.log('Type enum already up to date')
      }
      
      console.log('Notification table updated successfully!')
    }
    
  } catch (error) {
    console.error('Error updating notification table:', error)
  } finally {
    await sequelize.close()
  }
}

updateNotificationTable()
