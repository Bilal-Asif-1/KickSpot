import { sequelize } from '../lib/sequelize.js'
import { QueryTypes } from 'sequelize'

async function updateUserTable() {
  try {
    console.log('🔄 Updating users table schema...')
    
    // Make deliveryAddress nullable
    await sequelize.query(
      'ALTER TABLE users MODIFY COLUMN deliveryAddress TEXT NULL',
      { type: QueryTypes.RAW }
    )
    
    console.log('✅ Users table updated successfully!')
    console.log('✅ deliveryAddress is now nullable')
    
  } catch (error) {
    console.error('❌ Error updating users table:', error)
  } finally {
    await sequelize.close()
  }
}

updateUserTable()
