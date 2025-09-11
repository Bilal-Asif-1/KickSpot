import { Sequelize } from 'sequelize'

const dbName = process.env.MYSQL_DB || 'kickspot'
const dbUser = process.env.MYSQL_USER || 'root'
const dbPass = process.env.MYSQL_PASSWORD || '11221122'
const dbHost = process.env.MYSQL_HOST || 'localhost'

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
})


