import { sequelize } from './src/lib/sequelize.ts'

async function addBuyCountField() {
  try {
    // Add buyCount column to products table
    await sequelize.query(`
      ALTER TABLE products 
      ADD COLUMN buyCount INT UNSIGNED NOT NULL DEFAULT 0
    `)
    console.log('✅ buyCount field added successfully!')
    
    // Add some sample products if none exist
    const [products] = await sequelize.query('SELECT COUNT(*) as count FROM products')
    if (products[0].count === 0) {
      await sequelize.query(`
        INSERT INTO products (name, category, price, stock, description, image_url, seller_id, buyCount) VALUES
        ('Nike Air Max 270', 'Men', 150.00, 50, 'Comfortable running shoes', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', 1, 25),
        ('Adidas Ultraboost 22', 'Men', 180.00, 30, 'Premium running shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', 1, 18),
        ('Nike Air Force 1', 'Women', 90.00, 40, 'Classic white sneakers', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', 1, 32),
        ('Converse Chuck Taylor', 'Women', 65.00, 60, 'Timeless canvas shoes', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop', 1, 15),
        ('Nike Air Jordan 1', 'Kids', 120.00, 25, 'Kids basketball shoes', 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=1000&fit=crop', 1, 8),
        ('Adidas Stan Smith', 'Kids', 80.00, 35, 'Kids casual shoes', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop', 1, 12),
        ('Nike React Element 55', 'Men', 130.00, 45, 'Modern lifestyle shoes', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', 1, 20),
        ('Puma Suede Classic', 'Women', 75.00, 55, 'Retro style sneakers', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', 1, 28)
      `)
      console.log('✅ Sample products added successfully!')
    }
    
    console.log('🎉 Database setup complete!')
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('✅ buyCount field already exists!')
    } else {
      console.error('❌ Error:', error.message)
    }
  } finally {
    await sequelize.close()
  }
}

addBuyCountField()
