import bcrypt from 'bcryptjs'
import { User } from '@/models'
import { sequelize } from '@/lib/sequelize'

async function createSeller() {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')

    const sellerData = {
      name: 'Test Seller',
      email: 'seller@kickspot.com',
      password: await bcrypt.hash('password123', 10),
      role: 'seller' as const
    }

    const existingSeller = await User.findOne({ where: { email: sellerData.email } })
    if (existingSeller) {
      console.log('Seller already exists:', existingSeller.email)
      return
    }

    const seller = await User.create(sellerData)
    console.log('Seller created successfully:', {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      role: seller.role
    })

  } catch (error) {
    console.error('Error creating seller:', error)
  } finally {
    await sequelize.close()
  }
}

createSeller()
