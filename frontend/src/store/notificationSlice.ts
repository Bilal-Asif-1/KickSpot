import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/lib/api'

export interface Notification {
  id: number
  title: string
  message: string
  type: 'order_update' | 'account_security' | 'cart_wishlist' | 'offers_promotions' | 'order' | 'new-customer' | 'low-stock' | 'product-updated' | 'payment-received' | 'inventory-alert'
  priority: 'low' | 'medium' | 'high'
  is_read: boolean
  admin_id?: number
  user_id?: number
  created_at: string
  order_id?: number
  product_id?: number
  metadata?: {
    orderId?: number
    productId?: number
    customerId?: number
    action?: string
    [key: string]: any
  }
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  page: number
  hasMore: boolean
  totalPages: number
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  totalPages: 1
}

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await api.get(`/api/v1/notifications?page=${page}&limit=${limit}`)
    return response.data
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async () => {
    const response = await api.get('/api/v1/notifications/unread-count')
    return response.data.count
  }
)

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: number) => {
    await api.patch(`/api/v1/notifications/${notificationId}/read`)
    return notificationId
  }
)

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    await api.patch('/api/v1/notifications/mark-all-read')
    return true
  }
)

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: number) => {
    await api.delete(`/api/v1/notifications/${notificationId}`)
    return notificationId
  }
)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add new notification to the beginning of the list
      state.notifications.unshift(action.payload)
      if (!action.payload.is_read) {
        state.unreadCount += 1
      }
    },
    resetNotifications: (state) => {
      state.notifications = []
      state.page = 1
      state.hasMore = true
      state.error = null
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        const { notifications, page, hasMore, totalPages } = action.payload
        
        if (page === 1) {
          state.notifications = notifications
        } else {
          state.notifications.push(...notifications)
        }
        
        state.page = page
        state.hasMore = hasMore
        state.totalPages = totalPages
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch notifications'
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload
        const notification = state.notifications.find(n => n.id === notificationId)
        if (notification && !notification.is_read) {
          notification.is_read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.is_read = true
        })
        state.unreadCount = 0
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload
        const notificationIndex = state.notifications.findIndex(n => n.id === notificationId)
        if (notificationIndex !== -1) {
          const notification = state.notifications[notificationIndex]
          if (!notification.is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
          state.notifications.splice(notificationIndex, 1)
        }
      })
  }
})

export const { addNotification, resetNotifications, setUnreadCount } = notificationSlice.actions
export default notificationSlice.reducer
