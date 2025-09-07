/**
 * Database Configuration
 */

import { Sequelize } from 'sequelize';
import config from './config.js';

// Create Sequelize instance with configuration from environment
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false, // Disabled for cleaner console output
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export {
  sequelize,
  Sequelize
};
