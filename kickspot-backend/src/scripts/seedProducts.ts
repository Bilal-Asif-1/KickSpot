import { Product, User } from '@/models'
import { sequelize } from '@/lib/sequelize'

async function seedProducts() {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')

    // Find or create a seller
    let seller = await User.findOne({ where: { role: 'seller' } })
    if (!seller) {
      seller = await User.create({
        name: 'Test Seller',
        email: 'seller@kickspot.com',
        password: '$2b$10$hashedpassword', // This would be hashed in real scenario
        role: 'seller'
      })
      console.log('Created test seller:', seller.email)
    }

    const sampleProducts = [
      {
        name: 'Nike Air Max 270',
        category: 'Men',
        price: 150.00,
        stock: 25,
        description: 'Comfortable running shoes with Air Max technology',
        image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
        seller_id: seller.id
      },
      {
        name: 'Adidas Ultraboost 22',
        category: 'Men',
        price: 180.00,
        stock: 20,
        description: 'Premium running shoes with Boost technology',
        image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop',
        seller_id: seller.id
      },
      {
        name: 'Nike Air Force 1',
        category: 'Women',
        price: 90.00,
        stock: 30,
        description: 'Classic basketball-inspired sneakers',
        image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
        seller_id: seller.id
      },
      {
        name: 'Converse Chuck Taylor',
        category: 'Kids',
        price: 60.00,
        stock: 40,
        description: 'Timeless canvas sneakers for kids',
        image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
        seller_id: seller.id
      },
      {
        name: 'Vans Old Skool',
        category: 'Women',
        price: 70.00,
        stock: 35,
        description: 'Classic skateboarding shoes',
        image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop',
        seller_id: seller.id
      },
      {
        name: 'Jordan 1 Retro',
        category: 'Men',
        price: 170.00,
        stock: 15,
        description: 'Iconic basketball shoes',
        image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
        seller_id: seller.id
      }
    ]

    // Clear existing products
    await Product.destroy({ where: {} })
    console.log('Cleared existing products')

    // Create sample products
    for (const productData of sampleProducts) {
      await Product.create(productData)
    }

    console.log(`Created ${sampleProducts.length} sample products`)
    console.log('Sample products seeded successfully!')

  } catch (error) {
    console.error('Error seeding products:', error)
  } finally {
    await sequelize.close()
  }
}

seedProducts()
