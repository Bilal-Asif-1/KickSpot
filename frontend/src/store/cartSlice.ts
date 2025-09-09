import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from './productsSlice'

export interface CartItem { product: Product; quantity: number }

interface CartState {
  items: CartItem[]
}

const initialState: CartState = { items: [] }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex(i => i.product.id === action.payload.id)
      if (idx >= 0) state.items[idx].quantity += 1
      else state.items.push({ product: action.payload, quantity: 1 })
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.product.id !== action.payload)
    },
    setQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const item = state.items.find(i => i.product.id === action.payload.id)
      if (item) item.quantity = Math.max(1, action.payload.quantity)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer


