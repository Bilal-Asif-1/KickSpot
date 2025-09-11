import { Link } from 'react-router-dom'
import { Package, Users, BarChart3, Bell } from 'lucide-react'
import { useEffect } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/store'
import { logout } from '@/store/authSlice'
import { addNotification, fetchUnreadCount, setUnreadCount } from '@/store/notificationSlice'
import type { Notification } from '@/store/notificationSlice'
import ThemeToggle from '@/components/ThemeToggle'
import { toast } from 'sonner'

export default function AdminNavbar() {
  const { user } = useAppSelector(s => s.auth)
  const { unreadCount } = useAppSelector(s => s.notifications)
  const dispatch = useAppDispatch()
  const socket = useSocket()

  const handleLogout = () => {
    dispatch(logout())
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
    if (user?.role === 'admin') {
      dispatch(fetchUnreadCount())
    }
  }, [dispatch, user])

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || user?.role !== 'admin') return
    
    const onNotification = (notification: Notification) => {
      // Only add notifications for this admin
      if (notification.admin_id === user.id) {
        dispatch(addNotification(notification))
      }
    }
    
    socket.on('notification', onNotification)
    return () => { socket.off('notification', onNotification) }
  }, [socket, user, dispatch])

  return (
    <header className="border-b bg-slate-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/admin" className="font-semibold text-xl text-slate-800">KickSpot Admin</Link>
        <nav className="ml-auto hidden gap-6 md:flex">
          <Link to="/admin" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <BarChart3 className="h-4 w-4" />
            Orders
          </Link>
          <Link to="/admin/customers" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <Users className="h-4 w-4" />
            Customers
          </Link>
          <Link 
            to="/admin/notifications" 
            className="relative flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
            onClick={() => dispatch(setUnreadCount(0))}
          >
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-3 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] h-4 min-w-4 px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-4">
          <ThemeToggle />
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                Admin: {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
