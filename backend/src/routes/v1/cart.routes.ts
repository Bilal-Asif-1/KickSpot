import { Router } from 'express'
import { authenticate, authorize } from '../../middleware/auth.js'
import { 
  addToCart, 
  updateCartItem, 
  getCart, 
  clearCart,
  addToCartValidators,
  updateCartItemValidators 
} from '../../controllers/cart.controller.js'

const r = Router()

// Add item to cart
r.post('/', authenticate, authorize(['user']), addToCartValidators, addToCart)

// Update cart item quantity
r.put('/', authenticate, authorize(['user']), updateCartItemValidators, updateCartItem)

// Get user's cart
r.get('/', authenticate, authorize(['user']), getCart)

// Clear cart
r.delete('/', authenticate, authorize(['user']), clearCart)

export default r
