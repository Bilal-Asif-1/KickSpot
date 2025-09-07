
import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';

const configureRoutes = (app) => {
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);

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
        products: '/api/products',
        orders: '/api/orders'
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

export default configureRoutes;
