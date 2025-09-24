import { sequelize } from '../lib/sequelize.js';

/**
 * 🔍 INDEX VERIFICATION SCRIPT
 * 
 * This script checks if indexes exist in the database
 * Run this after any database changes to verify indexes
 */
async function checkIndexes() {
  console.log('🔄 Connecting to MySQL database...');
  
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL database connected successfully!');
  } catch (error: any) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }

  console.log('🔍 Checking database indexes...\n');

  // Function to check indexes for a table
  async function checkTableIndexes(tableName: string) {
    console.log(`📊 ${tableName.toUpperCase()} TABLE INDEXES`);
    console.log('=' .repeat(50));
    
    try {
      const [results] = await sequelize.query(`SHOW INDEX FROM ${tableName}`);
      
      if (results.length === 0) {
        console.log('❌ No indexes found');
        return;
      }
      
      console.log('✅ Indexes found:');
      results.forEach((row: any) => {
        console.log(`   - ${row.Key_name}: ${row.Column_name} (${row.Index_type})`);
      });
      
    } catch (error: any) {
      console.error(`❌ Error checking ${tableName} indexes:`, error.message);
    }
    console.log('');
  }

  // Check all tables
  await checkTableIndexes('users');
  await checkTableIndexes('products');
  await checkTableIndexes('orders');
  await checkTableIndexes('order_items');

  // Check specific essential indexes
  console.log('🎯 ESSENTIAL INDEXES VERIFICATION');
  console.log('=' .repeat(50));
  
  const essentialIndexes = [
    { table: 'users', index: 'idx_users_email', column: 'email' },
    { table: 'users', index: 'idx_users_role', column: 'role' },
    { table: 'products', index: 'idx_products_category', column: 'category' },
    { table: 'products', index: 'idx_products_seller_id', column: 'seller_id' },
    { table: 'products', index: 'idx_products_is_deleted', column: 'is_deleted' },
    { table: 'orders', index: 'idx_orders_user_id', column: 'user_id' },
    { table: 'orders', index: 'idx_orders_status', column: 'status' },
    { table: 'order_items', index: 'idx_order_items_order_id', column: 'order_id' },
    { table: 'order_items', index: 'idx_order_items_product_id', column: 'product_id' }
  ];

  for (const { table, index, column } of essentialIndexes) {
    try {
      const [results] = await sequelize.query(
        `SHOW INDEX FROM ${table} WHERE Key_name = '${index}'`
      );
      
      if (results.length > 0) {
        console.log(`✅ ${index} on ${table}.${column} - EXISTS`);
      } else {
        console.log(`❌ ${index} on ${table}.${column} - MISSING`);
      }
    } catch (error: any) {
      console.log(`❌ ${index} on ${table}.${column} - ERROR: ${error.message}`);
    }
  }

  console.log('\n📊 INDEX VERIFICATION SUMMARY');
  console.log('=' .repeat(50));
  console.log('✅ Check results above to see which indexes exist');
  console.log('❌ Missing indexes need to be recreated');
  console.log('🚀 All ✅ means your database is optimized!');
  
  process.exit(0);
}

checkIndexes();
