import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Product, User, OrderItem } from '../models/index.js'
import { body, param, validationResult } from 'express-validator'
import { uploadSingle, uploadToCloudinary } from '../middleware/upload.js'
import path from 'path'
import fs from 'fs'
import { sequelize } from '../lib/sequelize.js'

export const createProductValidators = [
  body('name').isString().notEmpty(),
  body('category').isIn(['Men', 'Women', 'Kids']),
  body('price').isFloat({ gt: 0 }),
  body('stock').isInt({ min: 0 }),
  body('description').optional().isString(),
  body('image_url').optional().isString(),
]

/**
 * 🚀 CREATE PRODUCT WITH ACID PROPERTIES IMPLEMENTATION
 * 
 * ACID PROPERTIES:
 * - ATOMICITY: All operations wrapped in database transaction
 * - CONSISTENCY: Data validation and business rules enforced
 * - ISOLATION: Row-level locking to prevent race conditions
 * - DURABILITY: Proper error handling and logging
 */
export async function createProduct(req: Request, res: Response) {
  // ✅ ATOMICITY: Start database transaction
  const transaction = await sequelize.transaction()
  
  try {
    console.log('🔄 Starting product creation transaction')
    
    // Get seller_id from authenticated user
    const seller_id = (req as any).user?.id
    if (!seller_id) {
      throw new Error('Authentication required')
    }

    // ✅ ISOLATION: Lock user to prevent role changes during product creation
    const user = await User.findByPk(seller_id, { 
      lock: true, // Row-level locking for isolation
      transaction 
    })
    if (!user || user.role !== 'seller') {
      throw new Error('Only sellers can create products')
    }

    // ✅ CONSISTENCY: Validate required fields
    const { name, category, price, stock, description, image_url } = req.body
    
    if (!name || !category || !price || stock === undefined) {
      throw new Error('Missing required fields: name, category, price, stock')
    }

    if (!['Men', 'Women', 'Kids'].includes(category)) {
      throw new Error('Category must be Men, Women, or Kids')
    }

    if (parseFloat(price) <= 0) {
      throw new Error('Price must be greater than 0')
    }

    if (parseInt(stock) < 0) {
      throw new Error('Stock must be 0 or greater')
    }

    // ✅ CONSISTENCY: Additional business rule validations
    if (name.length < 2 || name.length > 100) {
      throw new Error('Product name must be between 2 and 100 characters')
    }
    
    if (parseFloat(price) > 10000) {
      throw new Error('Product price cannot exceed $10,000')
    }
    
    if (parseInt(stock) > 10000) {
      throw new Error('Product stock cannot exceed 10,000 units')
    }

    // Handle file upload
    console.log('📤 File upload check - req.file:', req.file)
    let finalImageUrl = image_url || null
    if (req.file) {
      console.log('✅ File received:', req.file.filename, 'at path:', req.file.path)
      try {
        // Upload to Cloudinary
        finalImageUrl = await uploadToCloudinary(req.file.path)
        console.log('Image uploaded to Cloudinary:', finalImageUrl)
        
        // Clean up temporary file
        fs.unlinkSync(req.file.path)
        
        // If Cloudinary is not configured, use a placeholder
        if (finalImageUrl === null) {
          finalImageUrl = 'https://via.placeholder.com/400x400?text=No+Image'
          console.log('Using placeholder image due to missing Cloudinary config')
        }
      } catch (error) {
        console.error('Failed to upload to Cloudinary:', error)
        // Clean up temporary file on error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
        throw new Error('Failed to upload image')
      }
    }

    const productData = {
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || null,
      seller_id,
      image_url: finalImageUrl
    }

    // ✅ ATOMICITY: Create product within transaction
    const product = await Product.create(productData, { transaction })
    
    // ✅ DURABILITY: Commit transaction - product is now permanent
    await transaction.commit()
    console.log(`🎉 Product ${product.id} created successfully with ACID properties`)
    
    // ✅ DURABILITY: Log successful product creation
    console.log(`📊 Product Summary: ID=${product.id}, Name=${name}, Price=${price}, Stock=${stock}, Seller=${seller_id}`)
    
    res.status(201).json({
      ...product.toJSON(),
      message: 'Product created successfully with ACID properties'
    })
    
  } catch (error: any) {
    // ✅ ATOMICITY: Rollback transaction on any error
    await transaction.rollback()
    
    // ✅ DURABILITY: Log error for debugging
    console.error('❌ Product creation transaction failed:', error.message)
    console.error('🔄 Transaction rolled back successfully')
    
    // Handle specific database errors
    if (error.name === 'SequelizeConnectionError') {
      return res.status(500).json({ 
        message: 'Database connection failed. Please check if MySQL server is running.',
        error: 'DATABASE_CONNECTION_ERROR'
      })
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors.map((err: any) => ({
          field: err.path,
          message: err.message
        }))
      })
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'Invalid seller_id. User not found.',
        error: 'INVALID_SELLER'
      })
    }
    
    res.status(500).json({ 
      message: 'Product creation failed',
      error: error.message,
      details: 'Transaction rolled back - no partial data created'
    })
  }
}

export const updateProductValidators = [
  param('id').isInt(),
  body('price').optional().isFloat({ gt: 0 }),
  body('stock').optional().isInt({ min: 0 }),
]

export async function updateProduct(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { id } = req.params
  const adminId = (req as any).user?.id
  
  const product = await Product.findByPk(id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  
  // Check if admin owns this product
  if (product.seller_id !== adminId) {
    return res.status(403).json({ message: 'You can only update your own products' })
  }

  const updates: any = {}
  const { name, category, price, stock, description, image_url } = req.body as any
  if (name !== undefined) updates.name = name
  if (category !== undefined) {
    if (!['Men', 'Women', 'Kids'].includes(category)) {
      return res.status(400).json({ message: 'Category must be Men, Women, or Kids' })
    }
    updates.category = category
  }
  if (price !== undefined) {
    const p = parseFloat(price)
    if (!(p > 0)) return res.status(400).json({ message: 'Price must be greater than 0' })
    updates.price = p
  }
  if (stock !== undefined) {
    const s = parseInt(stock)
    if (isNaN(s) || s < 0) return res.status(400).json({ message: 'Stock must be 0 or greater' })
    updates.stock = s
  }
  if (description !== undefined) updates.description = description || null

  // Image: prefer uploaded file; otherwise respect provided image_url (can be empty string to clear)
  if (req.file) {
    try {
      // Upload to Cloudinary
      updates.image_url = await uploadToCloudinary(req.file.path)
      console.log('Image updated on Cloudinary:', updates.image_url)
      
      // Clean up temporary file
      fs.unlinkSync(req.file.path)
    } catch (error) {
      console.error('Failed to upload to Cloudinary:', error)
      // Clean up temporary file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(500).json({ 
        message: 'Failed to upload image',
        error: 'UPLOAD_ERROR'
      })
    }
  } else if (image_url !== undefined) {
    updates.image_url = image_url || null
  }

  await product.update(updates)
  res.json(product)
}

export const deleteProductValidators = [param('id').isInt()]

/**
 * 🚀 DELETE PRODUCT WITH PROPER SOFT DELETE IMPLEMENTATION
 * 
 * This function implements proper soft delete for products:
 * - Products with order history: Soft delete (is_deleted = true)
 * - Products without order history: Hard delete (actual removal)
 * - Maintains data integrity and order history
 */
export async function deleteProduct(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  
  const { id } = req.params
  const adminId = (req as any).user?.id
  
  // ✅ ATOMICITY: Start transaction for delete operation
  const transaction = await sequelize.transaction()
  
  try {
    console.log(`🔄 Starting product deletion transaction for product ${id}`)
    
    // ✅ ISOLATION: Lock product to prevent concurrent modifications
    const product = await Product.findByPk(id, { 
      lock: true, // Row-level locking
      transaction 
    })
    
    if (!product) {
      throw new Error('Product not found')
    }
    
    // ✅ CONSISTENCY: Check if admin owns this product
    if (product.seller_id !== adminId) {
      throw new Error('You can only delete your own products')
    }
    
    // ✅ CONSISTENCY: Check if product is already deleted
    if ((product as any).is_deleted) {
      throw new Error('Product is already deleted')
    }
    
    // Check if product has order history
    const orderCount = await OrderItem.count({ 
      where: { product_id: product.id },
      transaction 
    })
    
    if (orderCount > 0) {
             // ✅ SOFT DELETE: Product has order history - mark as deleted
             await product.update({ 
               is_deleted: true,
               deleted_at: new Date(),
               stock: 0 // Also set stock to 0 to hide from listings
             } as any, { transaction })
      
      // ✅ DURABILITY: Commit transaction
      await transaction.commit()
      console.log(`🎉 Product ${id} soft deleted successfully (has order history)`)
      
      return res.status(200).json({ 
        deleted: true,
        softDelete: true,
        message: 'Product archived successfully. It has order history so it was soft deleted.',
        orderCount: orderCount
      })
    } else {
      // ✅ HARD DELETE: Product has no order history - actually delete it
      await product.destroy({ transaction })
      
      // ✅ DURABILITY: Commit transaction
      await transaction.commit()
      console.log(`🎉 Product ${id} hard deleted successfully (no order history)`)
      
      return res.status(200).json({ 
        deleted: true,
        softDelete: false,
        message: 'Product deleted permanently. It had no order history.',
        orderCount: 0
      })
    }
    
  } catch (error: any) {
    // ✅ ATOMICITY: Rollback transaction on any error
    await transaction.rollback()
    
    // ✅ DURABILITY: Log error for debugging
    console.error('❌ Product deletion transaction failed:', error.message)
    console.error('🔄 Transaction rolled back successfully')
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'Cannot delete product due to existing references (orders).',
        error: 'FK_CONSTRAINT'
      })
    }
    
    res.status(500).json({ 
      message: 'Product deletion failed',
      error: error.message,
      details: 'Transaction rolled back - no changes made'
    })
  }
}

export async function listProducts(_req: Request, res: Response) {
  // ✅ Show only active products (not soft deleted and with stock > 0)
  const products = await Product.findAll({ 
    where: { 
      stock: { [Op.gt]: 0 },
      is_deleted: false // Exclude soft deleted products
    } 
  })
  res.json(products)
}

export async function getProduct(req: Request, res: Response) {
  const { id } = req.params
  const product = await Product.findByPk(id, {
    include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }]
  })
  if (!product) return res.status(404).json({ message: 'Not found' })
  res.json(product)
}

// Get Sale Products (products with discounted prices)
export async function getSaleProducts(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 8
    
    // ✅ Get active products and add sale prices (20% off)
    const products = await Product.findAll({
      where: { 
        stock: { [Op.gt]: 0 },
        is_deleted: false // Exclude soft deleted products
      },
      order: [['created_at', 'DESC']],
      limit,
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }]
    })
    
    // Add sale prices to products
    const saleProducts = products.map(product => ({
      ...product.toJSON(),
      originalPrice: product.price,
      price: Math.round(product.price * 0.8), // 20% discount
      salePrice: Math.round(product.price * 0.8),
      discount: 20,
      isOnSale: true
    }))
    
    res.json(saleProducts)
  } catch (error: any) {
    console.error('Error fetching sale products:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Get Best Sellers (products sorted by buyCount)
export async function getBestSellers(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 8
    const products = await Product.findAll({
      where: { 
        stock: { [Op.gt]: 0 },
        is_deleted: false // Exclude soft deleted products
      },
      order: [['buyCount', 'DESC']],
      limit,
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }]
    })
    res.json(products)
  } catch (error: any) {
    console.error('Error fetching best sellers:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Get products by category
export async function getProductsByCategory(req: Request, res: Response) {
  try {
    const { category } = req.params
    const limit = Math.min(parseInt(req.query.limit as string) || 8, 100)
    const page = Math.max(parseInt(req.query.page as string) || 1, 1)
    const offset = (page - 1) * limit
    
    if (!['Men', 'Women', 'Kids'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Must be Men, Women, or Kids' })
    }
    
    const where = { 
      category,
      stock: { [Op.gt]: 0 },
      is_deleted: false // Exclude soft deleted products
    }

    // Provide paginated response with totals for UI
    const { rows, count } = await Product.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      offset,
      limit,
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }]
    })

    const totalPages = Math.max(1, Math.ceil(count / limit))
    return res.json({ items: rows, total: count, totalPages, page, limit })
  } catch (error: any) {
    console.error('Error fetching products by category:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// Update product buyCount (called when order is placed)
export async function updateProductBuyCount(productId: number, quantity: number) {
  try {
    const product = await Product.findByPk(productId)
    if (product) {
      await product.increment('buyCount', { by: quantity })
    }
  } catch (error) {
    console.error('Error updating product buyCount:', error)
  }
}



