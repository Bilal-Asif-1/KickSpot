import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { sequelize } from './lib/sequelize.js'
import router from './routes/index.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate()
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

app.use('/api', router)

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Internal Server Error' })
})

const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  // Handle admin room joining
  socket.on('join_admin_room', (adminId: number) => {
    socket.join(`admin_${adminId}`)
    console.log(`Admin ${adminId} joined room admin_${adminId}`)
  })
  
  // Handle user room joining
  socket.on('join_user_room', (userId: number) => {
    socket.join(`user_${userId}`)
    console.log(`User ${userId} joined room user_${userId}`)
  })
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000

async function start() {
  try {
    console.log('🔄 Connecting to MySQL database...')
    if (process.env.DATABASE_URL) {
      console.log('🔗 Using DATABASE_URL for connection...')
      console.log('🔗 Connection URL:', process.env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@'))
    } else {
      console.log(`📊 Database: ${process.env.MYSQL_DB || 'kickspot'}`)
      console.log(`👤 User: ${process.env.MYSQL_USER || 'root'}`)
      console.log(`🌐 Host: ${process.env.MYSQL_HOST || 'localhost'}`)
    }
    
    await sequelize.authenticate()
    console.log('✅ MySQL database connected successfully!')
    
    console.log('🔄 Syncing database tables (auto-migrate)...')
    // Use alter=true so missing columns like products.seller_id are added automatically
    await sequelize.sync({ alter: true })
    console.log('✅ Database tables synced successfully!')
    
    server.listen(PORT, () => {
      console.log('🚀 KickSpot API Server Started!')
      console.log(`📡 Server running on: http://localhost:${PORT}`)
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`)
      console.log(`📚 API Base: http://localhost:${PORT}/api/v1`)
    })
  } catch (e: any) {
    console.error('❌ Failed to start server!')
    console.error('')
    
    if (e.message.includes('Access denied')) {
      console.error('🔐 MySQL Access Denied Error:')
      console.error('   - Check your MySQL username and password')
      console.error('   - Make sure MySQL server is running')
      console.error('   - Verify database credentials in .env file')
    } else if (e.message.includes('ECONNREFUSED')) {
      console.error('🔌 MySQL Connection Refused:')
      console.error('   - MySQL server is not running')
      console.error('   - Start MySQL service: net start mysql (Windows) or brew services start mysql (Mac)')
      console.error('   - Check if MySQL is running on the correct port (3306)')
    } else if (e.message.includes('Unknown database')) {
      console.error('🗄️ Database Not Found:')
      console.error('   - Database "kickspot" does not exist')
      console.error('   - Create it: CREATE DATABASE kickspot;')
    } else {
      console.error('💥 Unexpected Error:', e.message)
    }
    
    console.error('')
    console.error('🔧 Troubleshooting Steps:')
    console.error('   1. Check if MySQL server is running')
    console.error('   2. Verify .env file has correct database credentials')
    console.error('   3. Create database: CREATE DATABASE kickspot;')
    console.error('   4. Check MySQL user permissions')
    console.error('')
    console.error('📝 Current .env settings:')
    console.error(`   MYSQL_HOST=${process.env.MYSQL_HOST || 'localhost'}`)
    console.error(`   MYSQL_DB=${process.env.MYSQL_DB || 'kickspot'}`)
    console.error(`   MYSQL_USER=${process.env.MYSQL_USER || 'root'}`)
    console.error(`   MYSQL_PASSWORD=${process.env.MYSQL_PASSWORD ? '***set***' : '***not set***'}`)
    
    process.exit(1)
  }
}

start()


