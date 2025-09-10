import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  X, 
  Package, 
  ShoppingCart, 
  Shield, 
  Gift, 
  CheckCircle, 
  Clock, 
  Truck, 
  Home,
  RefreshCw,
  AlertCircle,
  TrendingDown,
  Star
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
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
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
      const res = await api.get<Notification[]>('/api/v1/notifications')
      setNotifications(res.data)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/api/v1/notifications/${id}/read`)
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/api/v1/notifications/read-all')
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      )
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/api/v1/notifications/${id}`)
      setNotifications(prev => prev.filter(notif => notif.id !== id))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Failed to delete notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = `h-4 w-4 ${priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-blue-500' : 'text-gray-500'}`
    
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notif.is_read
    return notif.type === filter
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-wrap gap-2">
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
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-4 border-b">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-sm text-gray-600">Loading...</span>
              </div>
            )}

            {error && (
              <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="p-4 space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No notifications</h3>
                    <p className="text-xs text-gray-500">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                        !notification.is_read 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getNotificationIcon(notification.type, notification.priority)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge className={`text-xs ${getTypeColor(notification.type)}`}>
                                {notification.type.replace('_', ' ')}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1 ml-2">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
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
