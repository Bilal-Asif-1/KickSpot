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
      toast.success('Item removed from cart')
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId))
    toast.success('Item removed from cart')
  }

  const handleAddRecommended = (product: RecommendedProduct) => {
    // Add recommended product to cart
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      category: product.category
    }
    
    // This would typically dispatch an action to add to cart
    toast.success(`${product.name} added to cart`)
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
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
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Cart Drawer */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              CART ({itemCount})
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
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
                <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
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
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-7 w-7 p-0 border-gray-300"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center bg-white px-2 py-1 rounded border">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-7 w-7 p-0 border-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Price and Remove */}
                  <div className="flex flex-col items-end space-y-3">
                    <div className="text-right">
                      <span className="text-sm text-gray-500">${item.price.toFixed(2)} each</span>
                      <div className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recommended Products - Compact Version */}
          {items.length > 0 && recommendedProducts.length > 0 && (
            <div className="border-t border-gray-200">
              <div className="p-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowRecommended(!showRecommended)}
                  className="w-full justify-between p-0 h-auto text-gray-600 hover:text-gray-900"
                >
                  <span className="text-xs font-medium text-gray-700">
                    RECOMMENDED FOR YOU
                  </span>
                  <ChevronDown className={`h-3 w-3 transition-transform text-gray-600 ${showRecommended ? 'rotate-180' : ''}`} />
                </Button>
                
                {showRecommended && (
                  <div className="mt-3">
                    <div className="relative">
                      <div 
                        className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {recommendedProducts.map((product) => (
                          <div key={product.id} className="flex-shrink-0 w-32 border border-gray-200 rounded-lg p-2">
                            <div className="w-full h-12 bg-gray-100 rounded mb-1 flex items-center justify-center">
                              {product.image_url ? (
                                <img 
                                  src={product.image_url} 
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <ShoppingBag className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            
                            <h5 className="text-xs font-medium text-gray-900 mb-1 truncate">
                              {product.name}
                            </h5>
                            
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-xs font-semibold text-red-600">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            
                            {/* Color Swatches - Compact */}
                            {product.colors && (
                              <div className="flex space-x-1 mb-1">
                                {product.colors.slice(0, 4).map((color, index) => (
                                  <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full border ${
                                      index === 0 ? 'border-gray-400' : 'border-gray-200'
                                    }`}
                                    style={{ backgroundColor: color === 'white' ? '#ffffff' : color === 'black' ? '#000000' : color === 'grey' ? '#6b7280' : color === 'beige' ? '#f5f5dc' : color === 'dark-grey' ? '#374151' : color === 'dark-blue' ? '#1e3a8a' : '#1e40af' }}
                                  />
                                ))}
                              </div>
                            )}
                            
                            {/* Size Selector - Compact */}
                            {product.sizes && (
                              <select className="w-full text-xs border border-gray-200 rounded px-1 py-0.5 mb-1">
                                {product.sizes.map((size, index) => (
                                  <option key={index} value={size}>
                                    {size}
                                  </option>
                                ))}
                              </select>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddRecommended(product)}
                              className="w-full text-xs h-6"
                            >
                              Add+
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 text-lg"
              disabled={items.length === 0}
            >
              CHECKOUT
            </Button>
          </div>
          
          {/* PayPal Payment Option */}
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full bg-black hover:bg-gray-800 text-white border-black h-12"
            >
              <span className="text-sm font-medium">PayPal</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
