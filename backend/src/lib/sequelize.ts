import { Sequelize } from 'sequelize'

// Check if DATABASE_URL is provided (Railway format)
if (process.env.DATABASE_URL) {
  console.log('🔄 Using DATABASE_URL for connection...')
  console.log('🔗 Connection URL:', process.env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@')) // Hide credentials in logs
  export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
} else {
  // Railway MySQL environment variables
  const dbName = process.env.MYSQL_DATABASE || process.env.MYSQL_DB || 'kickspot'
  const dbUser = process.env.MYSQL_USER || 'root'
  const dbPass = process.env.MYSQL_PASSWORD || '11221122'
  const dbHost = process.env.MYSQL_HOST || 'localhost'
  const dbPort = parseInt(process.env.MYSQL_PORT || '3306')

  console.log('🔄 Connecting to MySQL database...')
  console.log('📊 Database:', dbName)
  console.log('👤 User:', dbUser)
  console.log('🌐 Host:', dbHost)
  console.log('🔌 Port:', dbPort)

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
}


