import { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { loadCartFromStorage, clearCart } from '@/store/cartSlice'
import type { CartItem } from '@/store/cartSlice'

export function useCartPersistence() {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector(state => state.cart)
  const { user } = useAppSelector(state => state.auth)
  const isInitialized = useRef(false)
  const currentUserId = useRef<number | null>(null)

  // Get user-specific storage key
  const getCartStorageKey = (userId: number) => `kickspot_cart_${userId}`

  // Load cart from localStorage when user changes or on app start
  useEffect(() => {
    if (!user) {
      // If no user, clear cart and don't load anything
      if (currentUserId.current !== null) {
        dispatch(clearCart())
        currentUserId.current = null
      }
      return
    }

    // If user changed, clear current cart and load new user's cart
    if (currentUserId.current !== user.id) {
      dispatch(clearCart())
      currentUserId.current = user.id
      
      try {
        const storageKey = getCartStorageKey(user.id)
        const savedCart = localStorage.getItem(storageKey)
        if (savedCart) {
          const cartItems: CartItem[] = JSON.parse(savedCart)
          dispatch(loadCartFromStorage(cartItems))
          console.log(`Loaded cart for user ${user.id}:`, cartItems.length, 'items')
        }
        isInitialized.current = true
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
        isInitialized.current = true
      }
    }
  }, [dispatch, user])

  // Save cart to localStorage whenever it changes (only for logged-in users)
  useEffect(() => {
    if (!isInitialized.current || !user) return // Don't save until we've loaded initial data and user is logged in
    
    try {
      const storageKey = getCartStorageKey(user.id)
      console.log(`Saving cart for user ${user.id}:`, items.length, 'items')
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [items, user])

  return null
}
