import express from "express";
import { sequelize } from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import responseHandler from "./middleware/responseHandler.js";
import cors from "cors";
import { body, validationResult } from "express-validator";
import configureRoutes from "./routes/index.js";
import appConfig from "./config/app.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);

// CORS middleware (using cors package)
app.use(cors(appConfig.cors));

// Frontend static files serving removed - using Postman for API testing only

// Configure all routes
configureRoutes(app);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database (create tables if they don't exist)
await sequelize.sync(); // no alter

    console.log('✅ Database synchronized successfully.');
    
    // Start server
    app.listen(appConfig.port, () => {
      console.log(`Server running on port ${appConfig.port}`);
      console.log(`Health Check: http://localhost:${appConfig.port}/health`);
      console.log(`Test API: http://localhost:${appConfig.port}/api/test`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    console.log('Make sure MySQL is running and credentials are correct in .env file');
    process.exit(1);
  }
};

startServer();
