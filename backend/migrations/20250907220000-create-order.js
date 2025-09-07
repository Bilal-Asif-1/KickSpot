'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      // Buyer Details
      buyerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      buyerEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      buyerPhone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // Shipping Address
      shippingAddress: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shippingCity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shippingState: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shippingZip: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shippingCountry: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'USA'
      },
      // Payment Info
      paymentMethod: {
        type: Sequelize.ENUM('credit_card', 'debit_card', 'paypal', 'cash_on_delivery'),
        allowNull: false,
        defaultValue: 'cash_on_delivery'
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending'
      },
      // Order Notes
      orderNotes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      adminNotes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      // Tracking
      trackingNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      estimatedDelivery: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deliveredAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Orders');
  }
};
