import { Link } from 'react-router-dom'
import { ShoppingCart, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppSelector, useAppDispatch } from '@/store'
import { logout } from '@/store/authSlice'
import ThemeToggle from '@/components/ThemeToggle'
import NotificationDrawer from '@/components/NotificationDrawer'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function BuyerNavbar() {
  const { user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!')
  }

  // Fetch unread notification count
  useEffect(() => {
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const res = await api.get('/api/v1/notifications/unread-count')
          setUnreadCount(res.data.count)
        } catch (error) {
          console.error('Failed to fetch unread count:', error)
        }
      }
      fetchUnreadCount()
    }
  }, [user])

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="font-semibold text-xl">KickSpot</Link>
        <nav className="ml-auto hidden gap-6 md:flex">
          <Link to="/products" className="text-sm">All Products</Link>
          <Link to="/products?category=Men" className="text-sm">Men</Link>
          <Link to="/products?category=Women" className="text-sm">Women</Link>
          <Link to="/products?category=Kids" className="text-sm">Kids</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium">Admin</Link>
          )}
          {user && (
            <Link to="/orders" className="text-sm">My Orders</Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-4">
          <ThemeToggle />
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          )}
          <Button asChild variant="ghost" size="icon">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.name} {user.role === 'admin' ? '(Admin)' : ''}
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
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </header>
  )
}
