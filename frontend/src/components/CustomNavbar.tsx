import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, LogOut, User, Bell, Settings, History, Heart, MapPin, CreditCard, HelpCircle, ChevronDown } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import { logoutUser } from '@/store/authSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { SparklesCore } from '@/components/ui/sparkles'
import { useState, useEffect, useRef } from 'react'

type CustomNavbarProps = {
  onCartOpen: () => void
  onNotificationOpen?: () => void
  isCartOpen?: boolean
  isNotificationOpen?: boolean
}

export default function CustomNavbar({ onCartOpen, onNotificationOpen, isCartOpen, isNotificationOpen }: CustomNavbarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAppSelector(state => state.auth)
  const { items } = useAppSelector(state => state.cart)
  const { items: favoriteItems } = useAppSelector(state => state.favorites)
  const [showLogo, setShowLogo] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const favoriteItemCount = favoriteItems.length

  const path = location.pathname.toLowerCase()
  const isCategoryPage = ['/men', '/women', '/kids'].includes(path) || path.startsWith('/products/')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      // Show logo when scrolled down more than 50px
      setShowLogo(scrollTop > 50)
      
      // Navbar hide/show logic
      if (scrollTop < 10) {
        // Always show navbar at the very top
        setShowNavbar(true)
      } else if (scrollTop > lastScrollY && scrollTop > 100) {
        // Scrolling down and past 100px - hide navbar
        setShowNavbar(false)
      } else if (scrollTop < lastScrollY) {
        // Scrolling up - show navbar
        setShowNavbar(true)
      }
      
      setLastScrollY(scrollTop)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileDropdown])

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
    navigate('/')
  }

  const handleCategoryClick = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Men': '/men',
      'Women': '/women',
      'Kids': '/kids'
    }
    
    const targetPath = categoryMap[category] || `/products?category=${category}`
    const currentPath = location.pathname
    
    // If navigating between category pages (men/women/kids), use replace to avoid history buildup
    const isCategoryNavigation = ['/men', '/women', '/kids'].includes(currentPath) && 
                                 ['/men', '/women', '/kids'].includes(targetPath)
    
    navigate(targetPath, { replace: isCategoryNavigation })
  }

  const handleCartClick = () => {
    onCartOpen()
  }


  const handleNotificationClick = () => {
    if (onNotificationOpen) {
      onNotificationOpen()
    } else {
      // Fallback: navigate to notifications page
      navigate('/notifications')
    }
  }

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown)
  }

  const handleProfileMenuItem = (action: string) => {
    setShowProfileDropdown(false)
    switch (action) {
      case 'orders':
        navigate('/orders')
        break
      case 'wishlist':
        navigate('/wishlist')
        break
      case 'help':
        navigate('/help')
        break
      case 'logout':
        handleLogout()
        break
      default:
        break
    }
  }

  return (
    <div className="relative min-h-0 bg-gray-50">
      {/* Sparkles Section with KickSpot */}
      <div className={`relative ${isCategoryPage ? 'h-24' : 'h-64'} bg-black overflow-hidden pointer-events-none`}>
        <SparklesCore
          id="navbar-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={100}
          className="h-full w-full"
          particleColor="#ffffff"
          speed={2}
        />
        <div className={`absolute inset-0 flex items-end justify-center z-10 ${isCategoryPage ? 'pb-4' : 'pb-10'}`}>
          <h1 className={`${isCategoryPage ? 'text-3xl md:text-5xl' : 'text-6xl md:text-8xl'} font-bold text-white text-center`}>
            KICKSPOT
          </h1>
        </div>
      </div>

      {/* Top-left KickSpot brand logo */}
      <div className={`fixed top-5 left-4 z-30 transition-all duration-500 ease-in-out ${
        showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="text-2xl font-bold text-white">
          KickSpot
        </div>
      </div>

      {/* Top-right user section */}
      {!isCartOpen && !isNotificationOpen && (
        <div className="fixed top-0 right-0 p-4 z-[100] pointer-events-auto isolate" style={{ zIndex: 100 }}>
          <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
          {user ? (
            <div className="flex items-center space-x-3">
            <Bell 
              className="h-5 w-5 text-white cursor-pointer hover:text-gray-300 transition-colors relative z-10" 
              onClick={handleNotificationClick}
            />
            
            {/* Profile Dropdown */}
            <div className="relative isolate" ref={profileDropdownRef}>
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors relative z-10"
              >
                <User className="h-5 w-5" />
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                  showProfileDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[110] animate-in slide-in-from-top-2 duration-200 max-h-96 overflow-y-auto">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => handleProfileMenuItem('orders')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <History className="h-4 w-4" />
                      <span>Order History</span>
                    </button>
                    
                    <button
                      onClick={() => handleProfileMenuItem('wishlist')}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Heart className="h-4 w-4" />
                        <span>Wishlist / Saved Items</span>
                      </div>
                      {favoriteItemCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="h-5 w-5 rounded-full flex items-center justify-center text-xs"
                        >
                          {favoriteItemCount}
                        </Badge>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleProfileMenuItem('help')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => handleProfileMenuItem('logout')}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
        </div>
        </div>
      )}

      {/* Fixed top navbar - disable pointer events on full-width wrapper to avoid blocking clicks under it */}
      {!isCartOpen && !isNotificationOpen && (
        <div className={`fixed top-2 left-0 right-0 flex items-center justify-center px-8 py-2 z-50 pointer-events-none transition-all duration-300 ease-in-out ${
          showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}>
        {/* Horizontal capsule navbar */}
        <div className="w-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-8 py-4 flex items-center justify-between pointer-events-auto">
          {/* Left side - Menu items */}
          <div className="flex items-center space-x-12">
            <Button
              variant="ghost"
              onClick={() => handleCategoryClick('Men')}
              className="text-black hover:text-blue-200 hover:bg-blue-50 px-4 py-2 rounded-full font-medium"
            >
              MEN
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleCategoryClick('Women')}
              className="text-black hover:text-blue-200 hover:bg-blue-50 px-4 py-2 rounded-full font-medium"
            >
              WOMEN
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleCategoryClick('Kids')}
              className="text-black hover:text-blue-200 hover:bg-blue-50 px-4 py-2 rounded-full font-medium"
            >
              KIDS
            </Button>
          </div>

          {/* Right side - Cart button */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={handleCartClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Cart</span>
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
