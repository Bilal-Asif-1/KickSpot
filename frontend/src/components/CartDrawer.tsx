import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Gift, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Truck
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppSelector, useAppDispatch } from '@/store'
import { updateQuantity, removeFromCart } from '@/store/cartSlice'
import { useNavigate } from 'react-router-dom'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}


type RecommendedProduct = {
  id: number
  name: string
  price: number
  originalPrice?: number
  image_url?: string
  colors?: string[]
  sizes?: string[]
  category?: string
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, total } = useAppSelector(state => state.cart)
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([])
  const [showRecommended, setShowRecommended] = useState(true)
  const [freeShippingEarned, setFreeShippingEarned] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadRecommendedProducts()
      checkFreeShipping()
    }
  }, [isOpen, total])

  const loadRecommendedProducts = async () => {
    try {
      // Mock recommended products - replace with actual API call
      const mockRecommended = [
        {
          id: 101,
          name: 'Anytime No Show Sock',
          price: 9,
          originalPrice: 14,
          image_url: '/api/placeholder/80/80',
          colors: ['white', 'black', 'grey', 'beige', 'dark-grey', 'dark-blue', 'navy'],
          sizes: ['S (W5-7)', 'M (W8-10)', 'L (W11-13)'],
          category: 'Accessories'
        },
        {
          id: 102,
          name: 'Performance Running Sock',
          price: 12,
          originalPrice: 16,
          image_url: '/api/placeholder/80/80',
          colors: ['white', 'black', 'grey'],
          sizes: ['S (W5-7)', 'M (W8-10)', 'L (W11-13)'],
          category: 'Accessories'
        }
      ]
      setRecommendedProducts(mockRecommended)
    } catch (error) {
      console.error('Failed to load recommended products:', error)
    }
  }

  const checkFreeShipping = () => {
    // Free shipping threshold - adjust as needed
    const threshold = 100
    setFreeShippingEarned(total >= threshold)
  }

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId))
      toast.success('Item removed from cart', {
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
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId))
    toast.success('Item removed from cart', {
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

  const handleAddRecommended = (product: RecommendedProduct) => {
    // Add recommended product to cart
    const processedImageUrl = product.image_url?.startsWith('http') 
      ? product.image_url 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image_url || ''}`
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: processedImageUrl,
      category: product.category
    }
    
    // This would typically dispatch an action to add to cart
    toast.success(`${product.name} added to cart`, {
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

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty', {
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
      return
    }
    
    // Navigate to checkout page
    onClose()
    navigate('/checkout')
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-xl z-[200] transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col isolate" style={{ zIndex: 200 }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white relative z-10 isolate">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              CART ({itemCount})
            </h2>
          </div>
          <div className="relative z-50 isolate">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="relative z-50 isolate pointer-events-auto"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Free Shipping Banner */}
        {freeShippingEarned && (
          <div className="bg-green-50 border-b border-green-200 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                You've earned free shipping!
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => setFreeShippingEarned(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Cart Items */}
          <div className="p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">Your cart is empty</h3>
                <p className="text-xs text-gray-500">Add some items to get started</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                    {item.image_url ? (
                      <img 
                        src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image_url}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          // If image fails to load, show placeholder
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center text-gray-400">
                                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h4>
                    <div className="space-y-1">
                      {item.color && (
                        <p className="text-xs text-gray-600">
                          Color: {item.color}
                        </p>
                      )}
                      {item.size && (
                        <p className="text-xs text-gray-600">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-xs text-green-600 font-medium">
                        ✓ Added to cart
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0 border-gray-300 text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-medium w-6 text-center bg-gray-50 px-1 py-0.5 rounded border text-gray-700">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0 border-gray-300 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Price and Remove */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-right">
                      <span className="text-xs text-gray-500">${item.price.toFixed(2)} each</span>
                      <div className="text-sm font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 text-xs"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white p-4 space-y-3">
          
          {/* Subtotal */}
          <div className="flex justify-between items-center py-4 border-t border-gray-200 bg-gray-50 px-4">
            <span className="text-base font-semibold text-gray-900">Subtotal</span>
            <span className="text-xl font-bold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
          
          {/* Checkout Button */}
          <div className="p-4">
            <Button
              onClick={handleCheckout}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 text-lg"
              disabled={items.length === 0}
            >
              CHECKOUT
            </Button>
          </div>
          
        </div>
      </div>
    </>
  )
}
