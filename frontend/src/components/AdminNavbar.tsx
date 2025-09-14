import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useEffect } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/store'
import { logoutUser } from '@/store/authSlice'
import { addNotification, fetchUnreadCount, setUnreadCount } from '@/store/notificationSlice'
import type { Notification } from '@/store/notificationSlice'
import { toast } from 'sonner'

export default function AdminNavbar() {
  const { user } = useAppSelector(s => s.auth)
  const { unreadCount } = useAppSelector(s => s.notifications)
  const dispatch = useAppDispatch()
  const socket = useSocket()

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
    if (user?.role === 'seller') {
      dispatch(fetchUnreadCount())
    }
  }, [dispatch, user])

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || user?.role !== 'seller') return
    
    const onNotification = (notification: Notification) => {
      // Only add notifications for this seller
      if (notification.admin_id === user.id) {
        dispatch(addNotification(notification))
      }
    }
    
    socket.on('notification', onNotification)
    return () => { socket.off('notification', onNotification) }
  }, [socket, user, dispatch])

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* KICKSPOT Branding - Left */}
        <Link to="/admin" className="font-bold text-2xl text-black">
          KICKSPOT
        </Link>
        
        {/* Navigation Elements - Center */}
        <nav className="hidden gap-8 md:flex">
          <Link 
            to="/admin" 
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Products
          </Link>
          <Link 
            to="/admin/orders" 
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Orders
          </Link>
          <Link 
            to="/admin/customers" 
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Customers
          </Link>
          <Link 
            to="/admin/notifications" 
            className="relative text-sm font-medium text-gray-700 hover:text-black transition-colors"
            onClick={() => dispatch(setUnreadCount(0))}
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-3 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] h-4 min-w-4 px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        </nav>
        
        {/* Logout Button - Right */}
        {user && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black"
          >
            Logout
          </Button>
        )}
      </div>
    </header>
  )
}
