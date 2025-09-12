const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'contactNumber', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    });
    
    await queryInterface.addColumn('users', 'deliveryAddress', {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    });
    
    await queryInterface.addColumn('users', 'businessAddress', {
      type: DataTypes.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('users', 'cnicNumber', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('users', 'bankAccountNumber', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('users', 'bankName', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'contactNumber');
    await queryInterface.removeColumn('users', 'deliveryAddress');
    await queryInterface.removeColumn('users', 'businessAddress');
    await queryInterface.removeColumn('users', 'cnicNumber');
    await queryInterface.removeColumn('users', 'bankAccountNumber');
    await queryInterface.removeColumn('users', 'bankName');
  }
};

