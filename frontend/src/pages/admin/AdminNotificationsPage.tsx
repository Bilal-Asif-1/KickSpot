import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store'
import { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead, deleteNotification, resetNotifications } from '@/store/notificationSlice'
import type { Notification } from '@/store/notificationSlice'
import { Button } from '@/components/ui/button'
import { Trash2, Check, CheckCheck, Bell, Package, Users, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'order':
      return <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
    case 'low-stock':
      return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
    case 'new-customer':
      return <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
    case 'product-updated':
      return <Package className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
    default:
      return <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
  }
}


export default function AdminNotificationsPage() {
  const dispatch = useAppDispatch()
  const { notifications, loading, unreadCount, hasMore } = useAppSelector(s => s.notifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    dispatch(resetNotifications())
    dispatch(fetchNotifications({ page: 1 }))
    dispatch(fetchUnreadCount()) // Ensure unread count is fetched
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
    <div className="mx-auto max-w-4xl p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">Notifications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex rounded-lg border">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="rounded-r-none text-xs px-2 py-1 sm:px-3 sm:py-1.5"
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="rounded-l-none text-xs px-2 py-1 sm:px-3 sm:py-1.5"
            >
              Unread ({unreadCount})
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} size="sm" variant="outline" className="text-xs px-2 py-1 sm:px-3 sm:py-1.5">
              <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`border rounded-lg p-2 sm:p-3 lg:p-4 transition-colors ${
              notification.is_read ? 'bg-white' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 sm:mt-1">
                <NotificationIcon type={notification.type} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                  <span className="font-medium text-xs sm:text-sm capitalize">{notification.type.replace('-', ' ')}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-900 mb-1 sm:mb-2">{notification.message}</p>
                
                {/* Display detailed order information for order notifications */}
                {notification.type === 'order' && notification.metadata && (
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg mb-2 sm:mb-3">
                    <h4 className="font-medium text-xs sm:text-sm text-gray-900 mb-1 sm:mb-2">Order Details:</h4>
                    {/* Debug: Log metadata to console */}
                    {console.log('Notification metadata:', notification.metadata)}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 text-xs">
                      <div>
                        <span className="font-medium">Customer:</span> {notification.metadata.customerName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {notification.metadata.customerEmail}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {notification.metadata.customerPhone}
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span> {notification.metadata.paymentMethod?.toUpperCase()}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Address:</span> {notification.metadata.deliveryAddress}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> ${notification.metadata.totalAmount}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {notification.metadata.orderDate ? new Date(notification.metadata.orderDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    {notification.metadata.orderItems && notification.metadata.orderItems.length > 0 && (
                      <div className="mt-2 sm:mt-3">
                        <span className="font-medium text-xs sm:text-sm">Products:</span>
                        <div className="mt-1 space-y-1">
                          {notification.metadata.orderItems.map((item: any, index: number) => (
                            <div key={index} className="text-xs bg-white p-1.5 sm:p-2 rounded border">
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-gray-600">
                                Qty: {item.quantity} | Size: {item.size} | Price: ${item.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {notification.metadata?.action && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {notification.metadata.action === 'view_order' && notification.metadata.orderId && (
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                        View Order #{notification.metadata.orderId}
                      </Button>
                    )}
                    {notification.metadata.action === 'update_inventory' && notification.metadata.productId && (
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                        Update Inventory
                      </Button>
                    )}
                    {notification.metadata.action === 'view_customer' && notification.metadata.customerId && (
                      <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                        View Customer
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-0.5 sm:gap-1">
                {!notification.is_read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Mark as read"
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
                
             
              </div>
            </div>
          </div>
        ))}
        
        {filteredNotifications.length === 0 && !loading && (
          <div className="text-center py-6 sm:py-8">
            <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
            <p className="text-muted-foreground text-sm sm:text-base">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        )}
        
        {hasMore && (
          <div className="text-center py-3 sm:py-4">
            <Button onClick={loadMore} disabled={loading} variant="outline" size="sm" className="text-xs sm:text-sm">
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


