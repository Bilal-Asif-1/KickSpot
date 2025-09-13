import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import productsReducer from '@/store/productsSlice'
import cartReducer from '@/store/cartSlice'
import authReducer from '@/store/authSlice'
import notificationReducer from '@/store/notificationSlice'
import favoritesReducer from '@/store/favoritesSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    notifications: notificationReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


