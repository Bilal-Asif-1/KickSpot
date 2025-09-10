import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CartItem { 
  id: number
  name: string
  price: number
  quantity: number
  image_url?: string
  color?: string
  size?: string
  category?: string
}

interface CartState {
  items: CartItem[]
  total: number
}

const initialState: CartState = { 
  items: [],
  total: 0
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.color === action.payload.color && 
        item.size === action.payload.size
      )
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      
      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity)
        if (item.quantity === 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id)
        }
      }
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    clearCart(state) {
      console.log('Clearing cart - items before:', state.items.length)
      state.items = []
      state.total = 0
      console.log('Cart cleared - items after:', state.items.length)
      // Also clear localStorage
      try {
        localStorage.removeItem('kickspot_cart')
        console.log('localStorage cleared')
      } catch (error) {
        console.error('Failed to clear cart from localStorage:', error)
      }
    },
    loadCartFromStorage(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCartFromStorage } = cartSlice.actions
export default cartSlice.reducer


