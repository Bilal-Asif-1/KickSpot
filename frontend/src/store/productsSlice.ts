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
  buyCount: number
  originalPrice?: number
  discount?: number
  isOnSale?: boolean
}

interface ProductsState {
  items: Product[]
  saleProducts: Product[]
  bestSellers: Product[]
  menProducts: Product[]
  womenProducts: Product[]
  kidsProducts: Product[]
  loading: boolean
  error?: string
}

const initialState: ProductsState = { 
  items: [], 
  saleProducts: [],
  bestSellers: [],
  menProducts: [],
  womenProducts: [],
  kidsProducts: [],
  loading: false 
}

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/products`)
  return res.data
})

export const fetchSaleProducts = createAsyncThunk('products/fetchSaleProducts', async () => {
  try {
    const res = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/products/sale`)
    return res.data
  } catch (error) {
    console.log('Sale Products API not available, using sample data')
    return []
  }
})

export const fetchBestSellers = createAsyncThunk('products/fetchBestSellers', async () => {
  try {
    const res = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/products/bestsellers`)
    return res.data
  } catch (error) {
    console.log('Best Sellers API not available, using sample data')
    return []
  }
})

export const fetchMenProducts = createAsyncThunk('products/fetchMenProducts', async () => {
  try {
    const res = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/products/category/Men`)
    return res.data
  } catch (error) {
    console.log('Men Products API not available, using sample data')
    return []
  }
})

export const fetchWomenProducts = createAsyncThunk('products/fetchWomenProducts', async () => {
  try {
    const res = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/products/category/Women`)
    return res.data
  } catch (error) {
    console.log('Women Products API not available, using sample data')
    return []
  }
})

export const fetchKidsProducts = createAsyncThunk('products/fetchKidsProducts', async () => {
  try {
    const res = await axios.get<Product[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/products/category/Kids`)
    return res.data
  } catch (error) {
    console.log('Kids Products API not available, using sample data')
    return []
  }
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
      .addCase(fetchSaleProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.saleProducts = action.payload
      })
      .addCase(fetchBestSellers.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.bestSellers = action.payload
      })
      .addCase(fetchMenProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.menProducts = action.payload
      })
      .addCase(fetchWomenProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.womenProducts = action.payload
      })
      .addCase(fetchKidsProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.kidsProducts = action.payload
      })
  },
})

export default productsSlice.reducer


