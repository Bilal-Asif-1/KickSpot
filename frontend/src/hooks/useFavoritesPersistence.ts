import { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { loadFavoritesFromStorage, clearFavorites } from '@/store/favoritesSlice'
import type { FavoriteItem } from '@/store/favoritesSlice'

export function useFavoritesPersistence() {
  const dispatch = useAppDispatch()
  const { items } = useAppSelector(state => state.favorites)
  const { user } = useAppSelector(state => state.auth)
  const isInitialized = useRef(false)
  const currentUserId = useRef<number | null>(null)

  // Get user-specific storage key
  const getFavoritesStorageKey = (userId: number) => `kickspot_favorites_${userId}`

  // Load favorites from localStorage when user changes or on app start
  useEffect(() => {
    if (!user) {
      // If no user, clear favorites and don't load anything
      if (currentUserId.current !== null) {
        dispatch(clearFavorites())
        currentUserId.current = null
      }
      return
    }

    // If user changed, clear current favorites and load new user's favorites
    if (currentUserId.current !== user.id) {
      dispatch(clearFavorites())
      currentUserId.current = user.id
      
      try {
        const storageKey = getFavoritesStorageKey(user.id)
        const savedFavorites = localStorage.getItem(storageKey)
        if (savedFavorites) {
          const favoriteItems: FavoriteItem[] = JSON.parse(savedFavorites)
          dispatch(loadFavoritesFromStorage(favoriteItems))
          console.log(`Loaded favorites for user ${user.id}:`, favoriteItems.length, 'items')
        }
        isInitialized.current = true
      } catch (error) {
        console.error('Failed to load favorites from localStorage:', error)
        isInitialized.current = true
      }
    }
  }, [dispatch, user])

  // Save favorites to localStorage whenever it changes (only for logged-in users)
  useEffect(() => {
    if (!isInitialized.current || !user) return // Don't save until we've loaded initial data and user is logged in
    
    try {
      const storageKey = getFavoritesStorageKey(user.id)
      console.log(`Saving favorites for user ${user.id}:`, items.length, 'items')
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error)
    }
  }, [items, user])

  return null
}
