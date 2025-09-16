import bcrypt from 'bcryptjs'
import { User } from '@/models'
import { sequelize } from '@/lib/sequelize'

async function createAdmin() {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')

    const adminData = {
      name: 'Test Admin',
      email: 'admin@kickspot.com',
      password: await bcrypt.hash('password123', 10),
        role: 'seller' as const,
      contactNumber: '+1234567890',
      deliveryAddress: 'Admin Office, KickSpot HQ'
    }

    const existingAdmin = await User.findOne({ where: { email: adminData.email } })
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email)
      return
    }

    const admin = await User.create(adminData)
    console.log('Admin created successfully:', {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    })

  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await sequelize.close()
  }
}

createAdmin()