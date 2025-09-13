import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface FavoriteItem {
  id: number
  name: string
  price: number
  image_url?: string
  category?: string
  originalPrice?: number
  discount?: number
  isOnSale?: boolean
}

interface FavoritesState {
  items: FavoriteItem[]
}

const initialState: FavoritesState = {
  items: []
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites(state, action: PayloadAction<FavoriteItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (!existingItem) {
        state.items.push(action.payload)
      }
    },
    removeFromFavorites(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    toggleFavorite(state, action: PayloadAction<FavoriteItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        state.items = state.items.filter(item => item.id !== action.payload.id)
      } else {
        state.items.push(action.payload)
      }
    },
    clearFavorites(state) {
      state.items = []
    },
    loadFavoritesFromStorage(state, action: PayloadAction<FavoriteItem[]>) {
      state.items = action.payload
    }
  },
})

export const { 
  addToFavorites, 
  removeFromFavorites, 
  toggleFavorite, 
  clearFavorites, 
  loadFavoritesFromStorage 
} = favoritesSlice.actions

export default favoritesSlice.reducer
