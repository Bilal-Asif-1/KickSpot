import { Request, Response } from 'express'
import { Product, User } from '@/models'
import { body, param, validationResult } from 'express-validator'
import { uploadSingle } from '@/middleware/upload'
import path from 'path'

export const createProductValidators = [
  body('name').isString().notEmpty(),
  body('category').isIn(['Men', 'Women', 'Kids']),
  body('price').isFloat({ gt: 0 }),
  body('stock').isInt({ min: 0 }),
  body('description').optional().isString(),
]

export async function createProduct(req: Request, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  
  try {
    // Get seller_id from authenticated user
    const seller_id = (req as any).user?.id
    if (!seller_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // Check if user is seller or admin
    const user = await User.findByPk(seller_id)
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return res.status(403).json({ message: 'Only sellers and admins can create products' })
    }

    // Handle file upload
    let image_url = null
    if (req.file) {
      // Create URL for the uploaded file
      image_url = `/uploads/products/${req.file.filename}`
    }

    const productData = {
      ...req.body,
      seller_id,
      image_url
    }

    const product = await Product.create(productData)
    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ message: 'Internal server error' })
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
  await product.update(req.body)
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

// Get products by seller
export async function getSellerProducts(req: Request, res: Response) {
  try {
    const seller_id = (req as any).user?.id
    if (!seller_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const products = await Product.findAll({
      where: { seller_id },
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }]
    })
    res.json(products)
  } catch (error) {
    console.error('Error fetching seller products:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get buyers who purchased seller's products
export async function getSellerBuyers(req: Request, res: Response) {
  try {
    const seller_id = (req as any).user?.id
    if (!seller_id) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    // Get unique buyers who purchased this seller's products through orders
    const { Order, OrderItem } = await import('@/models')
    
    const buyers = await User.findAll({
      attributes: ['id', 'name', 'email', 'created_at'],
      include: [{
        model: Order,
        as: 'orders',
        include: [{
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            where: { seller_id },
            attributes: []
          }]
        }]
      }],
      where: {
        '$orders.orderItems.product.seller_id$': seller_id
      },
      distinct: true
    })

    res.json(buyers)
  } catch (error) {
    console.error('Error fetching seller buyers:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


