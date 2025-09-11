import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('kickspot', 'root', '11221122', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
})

async function testDatabase() {
  try {
    // Test if buyCount column exists
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' AND COLUMN_NAME = 'buyCount'
    `)
    
    if (results.length === 0) {
      console.log('❌ buyCount column does not exist, adding it...')
      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN buyCount INT UNSIGNED NOT NULL DEFAULT 0
      `)
      console.log('✅ buyCount column added!')
    } else {
      console.log('✅ buyCount column already exists')
    }
    
    // Test the bestsellers query
    const [products] = await sequelize.query(`
      SELECT id, name, category, price, buyCount 
      FROM products 
      WHERE stock > 0 
      ORDER BY buyCount DESC 
      LIMIT 8
    `)
    
    console.log('📊 Best Sellers Query Results:')
    console.log(products)
    
  } catch (error) {
    console.error('❌ Database Error:', error.message)
  } finally {
    await sequelize.close()
  }
}

testDatabase()
