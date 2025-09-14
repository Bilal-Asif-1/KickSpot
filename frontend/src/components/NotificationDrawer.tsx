import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppDispatch } from '@/store'
import { markAllAsRead as markAllAsReadAction, setUnreadCount } from '@/store/notificationSlice'
import { 
  Bell, 
  X, 
  Package, 
  ShoppingCart, 
  Shield, 
  Gift, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

type Notification = {
  id: number
  type: 'order_update' | 'account_security' | 'cart_wishlist' | 'offers_promotions'
  priority: 'high' | 'medium' | 'low'
  title: string
  message: string
  is_read: boolean
  created_at: string
  order_id?: number
  product_id?: number
  metadata?: any
}

type NotificationDrawerProps = {
  isOpen: boolean
  onClose: () => void
  onUnreadCountChange?: (count: number) => void
}

export default function NotificationDrawer({ isOpen, onClose, onUnreadCountChange }: NotificationDrawerProps) {
  const dispatch = useAppDispatch()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [filter, setFilter] = useState<'all' | 'unread' | 'order_update' | 'account_security' | 'cart_wishlist' | 'offers_promotions'>('all')

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(undefined)
      const res = await api.get('/api/v1/notifications')
      // Handle both array response and object with notifications property
      const notificationsData = Array.isArray(res.data) ? res.data : res.data.notifications || []
      setNotifications(notificationsData)
      
      // Update unread count in parent
      const unreadCount = notificationsData.filter((n: Notification) => !n.is_read).length
      onUnreadCountChange?.(unreadCount)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load notifications')
      setNotifications([]) // Ensure notifications is always an array
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`)
      setNotifications(prev => {
        const updated = prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
        // Update unread count in parent
        const newUnreadCount = updated.filter(n => !n.is_read).length
        onUnreadCountChange?.(newUnreadCount)
        return updated
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch('/api/v1/notifications/mark-all-read')
      
      // Update local state
      setNotifications(prev => {
        const updated = prev.map(notif => ({ ...notif, is_read: true }))
        return updated
      })
      
      // Update Redux state
      dispatch(markAllAsReadAction())
      dispatch(setUnreadCount(0))
      
      // Update parent component
      onUnreadCountChange?.(0)
      
      toast.success('All notifications marked as read', {
        style: {
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      toast.error('Failed to mark all notifications as read', {
        style: {
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/api/v1/notifications/${id}`)
      setNotifications(prev => prev.filter(notif => notif.id !== id))
      toast.success('Notification deleted', {
        style: {
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
    } catch (error) {
      console.error('Failed to delete notification:', error)
      toast.error('Failed to delete notification', {
        style: {
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
    }
  }

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `h-3 w-3 sm:h-4 sm:w-4 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-blue-500' : 'text-gray-500'}`
    
    switch (type) {
      case 'order_update':
        return <Package className={iconClass} />
      case 'account_security':
        return <Shield className={iconClass} />
      case 'cart_wishlist':
        return <ShoppingCart className={iconClass} />
      case 'offers_promotions':
        return <Gift className={iconClass} />
      default:
        return <Bell className={iconClass} />
    }
  }


  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order_update':
        return 'bg-green-100 text-green-800'
      case 'account_security':
        return 'bg-purple-100 text-purple-800'
      case 'cart_wishlist':
        return 'bg-orange-100 text-orange-800'
      case 'offers_promotions':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredNotifications = Array.isArray(notifications) ? notifications.filter(notif => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notif.is_read
    return notif.type === filter
  }) : []

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.is_read).length : 0

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-2 sm:p-3 lg:p-4 border-b">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-gray-600" />
              <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1 sm:p-2">
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="p-2 sm:p-3 lg:p-4 border-b">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'order_update', label: 'Orders' },
                { key: 'account_security', label: 'Security' },
                { key: 'cart_wishlist', label: 'Cart' },
                { key: 'offers_promotions', label: 'Offers' }
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={filter === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(key as any)}
                  className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-1.5"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-2 sm:p-3 lg:p-4 border-b">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                className="w-full py-1.5 sm:py-2 lg:py-2.5 text-xs sm:text-sm"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Mark All as Read
              </Button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-4 sm:py-6 lg:py-8">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-xs sm:text-sm text-gray-600">Loading...</span>
              </div>
            )}

            {error && (
              <div className="p-2 sm:p-3 lg:p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-1.5 sm:p-2 lg:p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1 sm:mr-2" />
                    <span className="text-red-700 text-xs sm:text-sm">{error}</span>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="p-2 sm:p-3 lg:p-4 space-y-1.5 sm:space-y-2 lg:space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-4 sm:py-6 lg:py-8">
                    <Bell className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">No notifications</h3>
                    <p className="text-xs text-gray-500">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-1.5 sm:p-2 lg:p-3 rounded-lg border transition-all hover:shadow-sm ${
                        !notification.is_read 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-1.5 sm:space-x-2 lg:space-x-3 flex-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1 sm:space-x-2 mb-0.5 sm:mb-1">
                              <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1 sm:mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Badge className={`text-xs ${getTypeColor(notification.type)}`}>
                                {notification.type.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-0.5 sm:space-y-1 ml-1 sm:ml-2">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 p-0"
                            >
                              <CheckCircle className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 p-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
