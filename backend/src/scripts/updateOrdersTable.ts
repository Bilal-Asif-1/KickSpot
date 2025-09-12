import { sequelize } from '../lib/sequelize.ts'
import { DataTypes } from 'sequelize'

async function updateOrdersTable() {
  try {
    console.log('Updating orders table...')
    
    // Add new columns to orders table
    await sequelize.getQueryInterface().addColumn('orders', 'payment_intent_id', {
      type: DataTypes.STRING,
      allowNull: true
    })
    console.log('Added payment_intent_id column')
    
    await sequelize.getQueryInterface().addColumn('orders', 'customer_details', {
      type: DataTypes.JSON,
      allowNull: true
    })
    console.log('Added customer_details column')
    
    await sequelize.getQueryInterface().addColumn('orders', 'items', {
      type: DataTypes.JSON,
      allowNull: true
    })
    console.log('Added items column')
    
    // Update status enum to include 'cancelled'
    await sequelize.getQueryInterface().changeColumn('orders', 'status', {
      type: DataTypes.ENUM('pending', 'processing', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    })
    console.log('Updated status enum to include cancelled')
    
    console.log('Orders table updated successfully!')
  } catch (error) {
    console.error('Error updating orders table:', error)
  } finally {
    await sequelize.close()
  }
}

updateOrdersTable()
