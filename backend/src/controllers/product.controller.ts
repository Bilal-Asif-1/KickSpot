import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Product, User, OrderItem } from '../models/index.js'
import { body, param, validationResult } from 'express-validator'
import { uploadSingle } from '../middleware/upload.js'
import path from 'path'

export const createProductValidators = [
  body('name').isString().notEmpty(),
  body('category').isIn(['Men', 'Women', 'Kids']),
  body('price').isFloat({ gt: 0 }),
  body('stock').isInt({ min: 0 }),
  body('description').optional().isString(),
  body('image_url').optional().isString(),
]

export async function createProduct(req: Request, res: Response) {
  try {
    // Get seller_id from authenticated user
    const seller_id = (req as any).user?.id
    if (!seller_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // Check if user is seller
    const user = await User.findByPk(seller_id)
    if (!user || user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can create products' })
    }

    // Validate required fields
    const { name, category, price, stock, description, image_url } = req.body
    
    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, category, price, stock' 
      })
    }

    if (!['Men', 'Women', 'Kids'].includes(category)) {
      return res.status(400).json({ 
        message: 'Category must be Men, Women, or Kids' 
      })
    }

    if (parseFloat(price) <= 0) {
      return res.status(400).json({ 
        message: 'Price must be greater than 0' 
      })
    }

    if (parseInt(stock) < 0) {
      return res.status(400).json({ 
        message: 'Stock must be 0 or greater' 
      })
    }

    // Handle file upload
    let finalImageUrl = image_url || null
    if (req.file) {
      // Create URL for the uploaded file
      finalImageUrl = `/uploads/products/${req.file.filename}`
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

    const product = await Product.create(productData)
    res.status(201).json(product)
  } catch (error: any) {
    console.error('Error creating product:', error)
    
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
      message: 'Internal server error',
      error: error.message 
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
    updates.image_url = `/uploads/products/${req.file.filename}`
  } else if (image_url !== undefined) {
    updates.image_url = image_url || null
  }

  await product.update(updates)
  res.json(product)
}

export const deleteProductValidators = [param('id').isInt()]

export async function deleteProduct(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { id } = req.params
  const adminId = (req as any).user?.id
  
  const product = await Product.findByPk(id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  
  // Check if admin owns this product
  if (product.seller_id !== adminId) {
    return res.status(403).json({ message: 'You can only delete your own products' })
  }
  
  try {
    // Prevent deleting products that have order history
    const count = await OrderItem.count({ where: { product_id: product.id } as any })
    if (count > 0) {
      await product.update({ stock: 0 })
      return res.status(200).json({ 
        archived: true,
        message: 'Product has existing orders. Stock set to 0 and hidden from listings.'
      })
    }
    await product.destroy()
    res.status(204).send()
  } catch (error: any) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'Cannot delete product due to existing references (orders).',
        error: 'FK_CONSTRAINT'
      })
    }
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export async function listProducts(_req: Request, res: Response) {
  // Show only products with stock > 0 (hide archived items)
  const products = await Product.findAll({ where: { stock: { [Op.gt]: 0 } } })
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
    
    // Get products and add sale prices (20% off)
    const products = await Product.findAll({
      where: { stock: { [Op.gt]: 0 } },
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
      where: { stock: { [Op.gt]: 0 } },
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
      stock: { [Op.gt]: 0 }
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



