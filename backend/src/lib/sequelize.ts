import { Sequelize } from 'sequelize'

const dbName = process.env.MYSQL_DB || 'kickspot'
const dbUser = process.env.MYSQL_USER || 'root'
const dbPass = process.env.MYSQL_PASSWORD || '11221122'
const dbHost = process.env.MYSQL_HOST || 'localhost'
const dbPort = parseInt(process.env.MYSQL_PORT || '3306')

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})


