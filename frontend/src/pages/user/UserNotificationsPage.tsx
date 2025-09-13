import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Package, ShoppingCart, AlertCircle } from 'lucide-react'

type Notification = {
  id: number
  type: 'order_status' | 'product_update' | 'general'
  title: string
  message: string
  is_read: boolean
  created_at: string
  order_id?: number
  product_id?: number
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(undefined)
        const res = await api.get('/api/v1/notifications')
        // Handle both array response and object with notifications property
        const notificationsData = Array.isArray(res.data) ? res.data : res.data.notifications || []
        setNotifications(notificationsData)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load notifications')
        setNotifications([]) // Ensure notifications is always an array
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`)
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
      await api.patch('/api/v1/notifications/mark-all-read')
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_status':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'product_update':
        return <ShoppingCart className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'order_status':
        return 'bg-blue-100 text-blue-800'
      case 'product_update':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-4xl p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Stay updated with your orders and account activity</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading notifications...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                  <p className="text-gray-500 text-center">
                    You'll receive notifications about your orders, product updates, and account activity here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div>
                          <CardTitle className="text-lg font-medium text-gray-900">
                            {notification.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getNotificationBadgeColor(notification.type)}>
                              {notification.type.replace('_', ' ')}
                            </Badge>
                            {!notification.is_read && (
                              <Badge className="bg-blue-500 text-white">New</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">{notification.message}</p>
                    {notification.order_id && (
                      <p className="text-sm text-gray-500 mt-2">
                        Related to Order #{notification.order_id}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
