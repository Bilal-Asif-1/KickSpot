const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'payment_intent_id', {
      type: DataTypes.STRING,
      allowNull: true
    })
    
    await queryInterface.addColumn('orders', 'customer_details', {
      type: DataTypes.JSON,
      allowNull: true
    })
    
    await queryInterface.addColumn('orders', 'items', {
      type: DataTypes.JSON,
      allowNull: true
    })
    
    // Update status enum to include 'cancelled'
    await queryInterface.changeColumn('orders', 'status', {
      type: DataTypes.ENUM('pending', 'processing', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'payment_intent_id')
    await queryInterface.removeColumn('orders', 'customer_details')
    await queryInterface.removeColumn('orders', 'items')
    
    // Revert status enum
    await queryInterface.changeColumn('orders', 'status', {
      type: DataTypes.ENUM('pending', 'processing', 'delivered'),
      allowNull: false,
      defaultValue: 'pending'
    })
  }
}

