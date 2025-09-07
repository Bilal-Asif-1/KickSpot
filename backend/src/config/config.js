import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '11221122',
    database: process.env.DB_NAME || 'crud_app',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '11221122',
    database: process.env.DB_NAME || 'crud_app',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '11221122',
    database: process.env.DB_NAME || 'crud_app',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  }
};