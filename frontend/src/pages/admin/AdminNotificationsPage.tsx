import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification, resetNotifications } from '@/store/notificationSlice'
import type { Notification } from '@/store/notificationSlice'
import { Button } from '@/components/ui/button'
import { Trash2, Check, CheckCheck, Bell, Package, Users, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'order':
      return <Bell className="h-4 w-4 text-blue-600" />
    case 'low-stock':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    case 'new-customer':
      return <Users className="h-4 w-4 text-green-600" />
    case 'product-updated':
      return <Package className="h-4 w-4 text-purple-600" />
    default:
      return <Bell className="h-4 w-4 text-gray-600" />
  }
}


export default function AdminNotificationsPage() {
  const dispatch = useAppDispatch()
  const { notifications, loading, unreadCount, hasMore } = useAppSelector(s => s.notifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    dispatch(resetNotifications())
    dispatch(fetchNotifications({ page: 1 }))
  }, [dispatch])

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || (filter === 'unread' && !n.is_read)
  )

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleDelete = (id: number) => {
    dispatch(deleteNotification(id))
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      dispatch(fetchNotifications({ page: Math.floor(notifications.length / 20) + 1 }))
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="rounded-r-none"
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="rounded-l-none"
            >
              Unread ({unreadCount})
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} size="sm" variant="outline">
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 transition-colors ${
              notification.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <NotificationIcon type={notification.type} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm capitalize">{notification.type.replace('-', ' ')}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-sm text-gray-900 mb-2">{notification.message}</p>
                
                {notification.metadata?.action && (
                  <div className="flex gap-2">
                    {notification.metadata.action === 'view_order' && notification.metadata.orderId && (
                      <Button size="sm" variant="outline">
                        View Order #{notification.metadata.orderId}
                      </Button>
                    )}
                    {notification.metadata.action === 'update_inventory' && notification.metadata.productId && (
                      <Button size="sm" variant="outline">
                        Update Inventory
                      </Button>
                    )}
                    {notification.metadata.action === 'view_customer' && notification.metadata.customerId && (
                      <Button size="sm" variant="outline">
                        View Customer
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                {!notification.is_read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(notification.id)}
                  title="Delete notification"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredNotifications.length === 0 && !loading && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        )}
        
        {hasMore && (
          <div className="text-center py-4">
            <Button onClick={loadMore} disabled={loading} variant="outline">
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


