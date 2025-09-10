import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, LogOut, User } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store'
import { logout } from '@/store/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { SparklesCore } from '@/components/ui/sparkles'
import { useState, useEffect } from 'react'

type CustomNavbarProps = {
  onCartOpen: () => void
}

export default function CustomNavbar({ onCartOpen }: CustomNavbarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector(state => state.auth)
  const { items } = useAppSelector(state => state.cart)
  const [showLogo, setShowLogo] = useState(false)

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      // Show logo when scrolled down more than 100px
      setShowLogo(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!')
    navigate('/')
  }

  const handleCategoryClick = (category: string) => {
    navigate(`/products?category=${category}`)
  }

  const handleCartClick = () => {
    onCartOpen()
  }

  return (
    <div className="relative min-h-0 bg-gray-50">
      {/* Sparkles Section with KickSpot */}
      <div className="relative h-64 bg-black overflow-hidden">
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
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="text-4xl font-bold text-white text-center">
            KickSpot
          </h1>
        </div>
      </div>

      {/* Top-left KickSpot brand logo */}
      {showLogo && (
        <div className="absolute top-4 left-4 z-30 transition-opacity duration-300">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            KickSpot
          </div>
        </div>
      )}

      {/* Top-right user section */}
      <div className="absolute top-4 right-4 flex items-center space-x-3 z-30">
        {user ? (
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-700" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="px-3 py-1"
            >
              LOGOUT
            </Button>
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

      {/* Fixed top navbar */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-center px-8 py-2 z-20">
        {/* Horizontal capsule navbar */}
        <div className="w-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-8 py-2 flex items-center justify-between">
          {/* Left side - Menu items */}
          <div className="flex items-center space-x-8">
            <Button
              variant="ghost"
              onClick={() => handleCategoryClick('Men')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium"
            >
              Men
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleCategoryClick('Women')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium"
            >
              Women
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleCategoryClick('Kids')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium"
            >
              Kids
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
    </div>
  )
}
