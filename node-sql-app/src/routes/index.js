
const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');

const configureRoutes = (app) => {
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);

  // Default route
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'API Server Running',
      documentation: 'Use Postman collection for testing endpoints'
    });
  });

  // Test endpoint
  app.get('/api/test', (req, res) => {
    res.json({
      success: true,
      message: 'API is working!',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users', 
        products: '/api/products'
      }
    });
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  });

  // 404 handler - must be after all other routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      note: 'Please check the API documentation for valid endpoints'
    });
  });
};

module.exports = configureRoutes;