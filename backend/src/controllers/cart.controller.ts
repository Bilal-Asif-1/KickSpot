import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'
import { Product } from '../models/index.js'

export const addToCartValidators = [
  body('product_id').isInt({ min: 1 }),
  body('quantity').isInt({ min: 1 }),
  body('color').optional().isString(),
  body('size').optional().isString()
]

export async function addToCart(req: AuthRequest, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { product_id, quantity, color, size } = req.body
    const userId = req.user!.id

    // Check if product exists and is available
    const product = await Product.findByPk(product_id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' })
    }

    // For now, we'll just return success
    // In a real implementation, you'd save to a cart table or session
    res.json({
      message: 'Item added to cart',
      cart_item: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        color,
        size,
        image_url: product.image_url,
        category: product.category
      }
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateCartItemValidators = [
  body('product_id').isInt({ min: 1 }),
  body('quantity').isInt({ min: 0 })
]

export async function updateCartItem(req: AuthRequest, res: Response) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { product_id, quantity } = req.body
    const userId = req.user!.id

    if (quantity === 0) {
      // Remove from cart
      res.json({ message: 'Item removed from cart' })
    } else {
      // Update quantity
      res.json({ message: 'Cart item updated', quantity })
    }
  } catch (error) {
    console.error('Error updating cart item:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function getCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id
    
    // For now, return empty cart
    // In a real implementation, you'd fetch from cart table
    res.json({
      items: [],
      total: 0
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function clearCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id
    
    // For now, just return success
    // In a real implementation, you'd clear the cart table
    res.json({ message: 'Cart cleared' })
  } catch (error) {
    console.error('Error clearing cart:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
