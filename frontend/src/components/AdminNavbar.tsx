import { Link } from 'react-router-dom'
import { Bell, Menu, X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
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
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6">
        {/* KICKSPOT Branding - Left */}
        <Link to="/admin" className="font-bold text-sm sm:text-lg md:text-xl text-black flex-shrink-0">
          KICKSPOT
        </Link>
        
        {/* Navigation Elements - Center (More Spread Out) */}
        <nav className="hidden gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 lg:flex">
          <Link 
            to="/admin" 
            className="text-xs sm:text-sm font-medium text-gray-700 hover:text-white hover:bg-black border border-black px-3 py-2 rounded transition-all duration-200"
          >
            Products
          </Link>
          <Link 
            to="/admin/orders" 
            className="text-xs sm:text-sm font-medium text-gray-700 hover:text-white hover:bg-black border border-black px-3 py-2 rounded transition-all duration-200"
          >
            Orders
          </Link>
          <Link 
            to="/admin/customers" 
            className="text-xs sm:text-sm font-medium text-gray-700 hover:text-white hover:bg-black border border-black px-3 py-2 rounded transition-all duration-200"
          >
            Customers
          </Link>
          <Link 
            to="/admin/notifications" 
            className="relative text-xs sm:text-sm font-medium text-gray-700 hover:text-white hover:bg-black border border-black px-3 py-2 rounded transition-all duration-200"
            onClick={() => dispatch(setUnreadCount(0))}
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 sm:-top-2 -right-2 sm:-right-3 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] h-3 w-3 sm:h-4 sm:min-w-4 px-0.5 sm:px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        </nav>
        
        {/* Mobile Menu Button - Show on smaller screens */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Menu Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMobileMenu}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black p-2 h-8 w-8"
          >
            {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Desktop Logout Button - Right */}
        {user && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="hidden lg:flex border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
          >
            Logout
          </Button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-b border-gray-200 shadow-lg"
        >
          <div className="px-4 py-3 space-y-2">
            <Link 
              to="/admin" 
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-white hover:bg-black border border-black px-3 py-2 rounded transition-all duration-200"
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </Link>
            <Link 
              to="/admin/orders" 
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-white hover:bg-black border border-black px-3 py-2 rounded transition-all duration-200"
              onClick={() => setShowMobileMenu(false)}
            >
              Orders
            </Link>
            <Link 
              to="/admin/customers" 
              className="block w-full text-left text-sm font-medium text-gray-700 hover:text-white hover:bg-black border border-black px-3 py-2 rounded transition-all duration-200"
              onClick={() => setShowMobileMenu(false)}
            >
              Customers
            </Link>
            <Link 
              to="/admin/notifications" 
              className="relative block w-full text-left text-sm font-medium text-gray-700 hover:text-white hover:bg-black border border-black px-3 py-2 rounded transition-all duration-200"
              onClick={() => {
                dispatch(setUnreadCount(0))
                setShowMobileMenu(false)
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span className="absolute top-1 right-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] h-4 w-4">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            {user && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  handleLogout()
                  setShowMobileMenu(false)
                }}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black text-sm py-2"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
