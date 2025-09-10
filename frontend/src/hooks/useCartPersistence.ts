import { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { loadCartFromStorage } from '@/store/cartSlice'
import type { CartItem } from '@/store/cartSlice'

const CART_STORAGE_KEY = 'kickspot_cart'

export function useCartPersistence() {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector(state => state.cart)
  const isInitialized = useRef(false)

  // Load cart from localStorage on app start (only once)
  useEffect(() => {
    if (isInitialized.current) return
    
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const cartItems: CartItem[] = JSON.parse(savedCart)
        dispatch(loadCartFromStorage(cartItems))
      }
      isInitialized.current = true
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      isInitialized.current = true
    }
  }, [dispatch])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized.current) return // Don't save until we've loaded initial data
    
    try {
      console.log('Saving cart to localStorage:', items.length, 'items')
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [items])

  return null
}
