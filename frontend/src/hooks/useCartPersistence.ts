import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { loadCartFromStorage } from '@/store/cartSlice'
import type { CartItem } from '@/store/cartSlice'

const CART_STORAGE_KEY = 'kickspot_cart'

export function useCartPersistence() {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector(state => state.cart)

  // Load cart from localStorage on app start
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const cartItems: CartItem[] = JSON.parse(savedCart)
        dispatch(loadCartFromStorage(cartItems))
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }, [dispatch])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [items])

  return null
}
