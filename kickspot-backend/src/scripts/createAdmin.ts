import 'dotenv/config'
import { User } from '@/models'
import bcrypt from 'bcryptjs'
import { sequelize } from '@/lib/sequelize'

async function createAdmin() {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@kickspot.com' } })
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@kickspot.com',
      password: hashedPassword,
      role: 'admin'
    })
    
    console.log('Admin user created successfully:', { id: admin.id, email: admin.email })
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await sequelize.close()
  }
}

createAdmin()
