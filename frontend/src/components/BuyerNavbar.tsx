import { Link } from 'react-router-dom'
import { ShoppingCart, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppSelector, useAppDispatch } from '@/store'
import { logoutUser } from '@/store/authSlice'
import { addNotification, fetchUnreadCount, setUnreadCount } from '@/store/notificationSlice'
import type { Notification } from '@/store/notificationSlice'
import NotificationDrawer from '@/components/NotificationDrawer'
import CartDrawer from '@/components/CartDrawer'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useSocket } from '@/hooks/useSocket'

export default function BuyerNavbar() {
  const { user } = useAppSelector(s => s.auth)
  const { items } = useAppSelector(s => s.cart)
  const { unreadCount } = useAppSelector(s => s.notifications)
  const dispatch = useAppDispatch()
  const socket = useSocket()
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logoutUser())
    toast.success('Logged out successfully!', {
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

  // Fetch initial unread count when component mounts
  useEffect(() => {
    if (user?.role === 'buyer') {
      console.log('🔔 Fetching unread count for user:', user.id)
      dispatch(fetchUnreadCount())
    }
  }, [dispatch, user])

  // Debug: Log unread count changes
  useEffect(() => {
    console.log('🔔 Unread count changed to:', unreadCount)
  }, [unreadCount])


  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || user?.role !== 'buyer') return
    
    const onNotification = (notification: Notification) => {
      // Only add notifications for this user
      if (notification.user_id === user.id) {
        dispatch(addNotification(notification))
        // Increment unread count for badge
        dispatch(setUnreadCount(unreadCount + 1))
        
        // Show toast notification
        toast.success(notification.message, {
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
    
    socket.on('notification', onNotification)
    return () => { socket.off('notification', onNotification) }
  }, [socket, user, dispatch, unreadCount])

  // Handle notification drawer toggle
  const handleNotificationDrawerToggle = (isOpen: boolean) => {
    setIsNotificationDrawerOpen(isOpen)
    // No need to refresh count - Redux handles it automatically
  }

  // Callback function to update unread count from child components
  const handleUnreadCountChange = (newCount: number) => {
    dispatch(setUnreadCount(newCount))
  }



  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="font-semibold text-xl">KickSpot</Link>
        <nav className="ml-auto hidden gap-6 md:flex">
          <Link to="/products" className="text-sm">All Products</Link>
          <Link to="/products?category=Men" className="text-sm">Men</Link>
          <Link to="/products?category=Women" className="text-sm">Women</Link>
          <Link to="/products?category=Kids" className="text-sm">Kids</Link>
          {user?.role === 'seller' && (
            <Link to="/admin" className="text-sm font-medium">Seller Dashboard</Link>
          )}
          {user && (
            <Link to="/orders" className="text-sm">My Orders</Link>
          )}
          {user && user.role === 'buyer' && (
            <button 
              onClick={() => handleNotificationDrawerToggle(true)}
              className="relative flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
            >
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] h-4 min-w-4 px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              {/* Debug: Show current count */}
              <span className="absolute -bottom-6 left-0 text-xs bg-white px-1 rounded border text-black">
                Count: {unreadCount}
              </span>
            </button>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500 text-white">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.name} {user.role === 'seller' ? '(Seller)' : ''}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen}
        onClose={() => handleNotificationDrawerToggle(false)}
        onUnreadCountChange={handleUnreadCountChange}
      />
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </header>
  )
}
