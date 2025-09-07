'use strict';

export default {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Users');
    
    if (!tableInfo.role) {
      await queryInterface.addColumn('Users', 'role', {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'role');
  }
};
