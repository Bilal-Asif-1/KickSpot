'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Classic White Sneakers',
        description: 'Timeless design, perfect for everyday wear.',
        price: 75.00,
        category: 'Sneakers',
        brand: 'Nike',
        imageUrl: 'https://via.placeholder.com/300x300?text=Classic+White+Sneakers',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Running Shoes Pro',
        description: 'Advanced cushioning for optimal performance.',
        price: 120.00,
        category: 'Running',
        brand: 'Adidas',
        imageUrl: 'https://via.placeholder.com/300x300?text=Running+Shoes+Pro',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Leather Boots Elite',
        description: 'Durable and stylish, ideal for any adventure.',
        price: 150.00,
        category: 'Boots',
        brand: 'Timberland',
        imageUrl: 'https://via.placeholder.com/300x300?text=Leather+Boots+Elite',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Casual Loafers',
        description: 'Comfortable and elegant for a relaxed look.',
        price: 90.00,
        category: 'Casual',
        brand: 'Clarks',
        imageUrl: 'https://via.placeholder.com/300x300?text=Casual+Loafers',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'High-Top Basketball Shoes',
        description: 'Excellent ankle support and grip for the court.',
        price: 110.00,
        category: 'Basketball',
        brand: 'Jordan',
        imageUrl: 'https://via.placeholder.com/300x300?text=High-Top+Basketball+Shoes',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Formal Dress Shoes',
        description: 'Sleek and sophisticated, perfect for special occasions.',
        price: 180.00,
        category: 'Formal',
        brand: 'Cole Haan',
        imageUrl: 'https://via.placeholder.com/300x300?text=Formal+Dress+Shoes',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Trail Running Sneakers',
        description: 'Rugged and responsive for off-road adventures.',
        price: 95.00,
        category: 'Running',
        brand: 'Salomon',
        imageUrl: 'https://via.placeholder.com/300x300?text=Trail+Running+Sneakers',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Winter Snow Boots',
        description: 'Insulated and waterproof for extreme cold.',
        price: 130.00,
        category: 'Boots',
        brand: 'Sorel',
        imageUrl: 'https://via.placeholder.com/300x300?text=Winter+Snow+Boots',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};