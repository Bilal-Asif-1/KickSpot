'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');
    if (!table.Availability) {
      await queryInterface.addColumn('Users', 'Availability', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Available'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'Availability');
  }
};

