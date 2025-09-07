'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Only add new columns, don't recreate table
    const tableInfo = await queryInterface.describeTable('Users');
    
    if (!tableInfo.role) {
      await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user',
      });
    }

    if (!tableInfo.isActive) {
      await queryInterface.addColumn('Users', 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Users');

    if (tableInfo.role) {
      await queryInterface.removeColumn('Users', 'role');
    }
    if (tableInfo.isActive) {
      await queryInterface.removeColumn('Users', 'isActive');
    }
  }
};
