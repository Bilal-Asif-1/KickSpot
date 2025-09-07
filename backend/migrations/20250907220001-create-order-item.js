'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // Product details at time of order
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      productCategory: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productBrand: {
        type: Sequelize.STRING,
        allowNull: true
      },
      productImageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Order specific details
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      // Size/Variant info
      size: {
        type: Sequelize.STRING,
        allowNull: true
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true
      },
      variant: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderItems');
  }
};
