import { Request, Response } from 'express'
import { Product, User } from '../models/index.js'
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

    // Check if user is admin
    const user = await User.findByPk(seller_id)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create products' })
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
  const product = await Product.findByPk(id)
  if (!product) return res.status(404).json({ message: 'Not found' })

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
  const product = await Product.findByPk(id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  await product.destroy()
  res.status(204).send()
}

export async function listProducts(_req: Request, res: Response) {
  const products = await Product.findAll()
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



