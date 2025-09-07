'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'brand', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'brand');
  }
};

