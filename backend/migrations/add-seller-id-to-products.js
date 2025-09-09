'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'seller_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Add index for better performance
    await queryInterface.addIndex('products', ['seller_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('products', ['seller_id']);
    await queryInterface.removeColumn('products', 'seller_id');
  }
};
