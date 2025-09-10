'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notifications', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Notification'
    });

    await queryInterface.addColumn('notifications', 'user_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    });

    await queryInterface.addColumn('notifications', 'order_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id'
      }
    });

    await queryInterface.addColumn('notifications', 'product_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id'
      }
    });

    // Update the type enum to include new notification types
    await queryInterface.changeColumn('notifications', 'type', {
      type: Sequelize.ENUM(
        'order_update', 
        'account_security', 
        'cart_wishlist', 
        'offers_promotions',
        'order', 
        'new-customer', 
        'low-stock', 
        'product-updated', 
        'payment-received', 
        'inventory-alert'
      ),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('notifications', 'title');
    await queryInterface.removeColumn('notifications', 'user_id');
    await queryInterface.removeColumn('notifications', 'order_id');
    await queryInterface.removeColumn('notifications', 'product_id');

    // Revert the type enum
    await queryInterface.changeColumn('notifications', 'type', {
      type: Sequelize.ENUM(
        'order', 
        'new-customer', 
        'low-stock', 
        'product-updated', 
        'payment-received', 
        'inventory-alert'
      ),
      allowNull: false
    });
  }
};
