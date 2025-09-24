'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add soft delete fields to products table
    await queryInterface.addColumn('products', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('products', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Add index for soft delete queries
    await queryInterface.addIndex('products', ['is_deleted'], {
      name: 'idx_products_is_deleted'
    });

    await queryInterface.addIndex('products', ['deleted_at'], {
      name: 'idx_products_deleted_at'
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('products', 'idx_products_is_deleted');
    await queryInterface.removeIndex('products', 'idx_products_deleted_at');

    // Remove columns
    await queryInterface.removeColumn('products', 'is_deleted');
    await queryInterface.removeColumn('products', 'deleted_at');
  }
};
