import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  description?: string
  image_url?: string
}

interface ProductsState {
  items: Product[]
  loading: boolean
  error?: string
}

const initialState: ProductsState = { items: [], loading: false }

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/products`)
  return res.data
})

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default productsSlice.reducer


