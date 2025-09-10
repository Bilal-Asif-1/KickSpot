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
  const { items, total } = useAppSelector(state => state.cart)
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([])
  const [showGiftOptions, setShowGiftOptions] = useState(false)
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
    
    // Navigate to checkout or handle checkout logic
    toast.success('Proceeding to checkout...')
    onClose()
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
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col">
        
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
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
                <div key={item.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h4>
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
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Price and Remove */}
                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recommended Products */}
          {items.length > 0 && recommendedProducts.length > 0 && (
            <div className="border-t border-gray-200">
              <div className="p-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowRecommended(!showRecommended)}
                  className="w-full justify-between p-0 h-auto"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    RECOMMENDED FOR YOU
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showRecommended ? 'rotate-180' : ''}`} />
                </Button>
                
                {showRecommended && (
                  <div className="mt-4">
                    <div className="relative">
                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {recommendedProducts.map((product) => (
                          <div key={product.id} className="flex-shrink-0 w-48 border border-gray-200 rounded-lg p-3">
                            <div className="w-full h-16 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                              {product.image_url ? (
                                <img 
                                  src={product.image_url} 
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <ShoppingBag className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            
                            <h5 className="text-xs font-medium text-gray-900 mb-1">
                              {product.name}
                            </h5>
                            
                            <div className="flex items-center space-x-1 mb-2">
                              <span className="text-xs font-semibold text-red-600">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            
                            {/* Color Swatches */}
                            {product.colors && (
                              <div className="flex space-x-1 mb-2">
                                {product.colors.slice(0, 7).map((color, index) => (
                                  <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full border ${
                                      index === 0 ? 'border-gray-400' : 'border-gray-200'
                                    }`}
                                    style={{ backgroundColor: color === 'white' ? '#ffffff' : color === 'black' ? '#000000' : color === 'grey' ? '#6b7280' : color === 'beige' ? '#f5f5dc' : color === 'dark-grey' ? '#374151' : color === 'dark-blue' ? '#1e3a8a' : '#1e40af' }}
                                  />
                                ))}
                              </div>
                            )}
                            
                            {/* Size Selector */}
                            {product.sizes && (
                              <select className="w-full text-xs border border-gray-200 rounded px-2 py-1 mb-2">
                                {product.sizes.map((size, index) => (
                                  <option key={index} value={size}>
                                    Size: {size}
                                  </option>
                                ))}
                              </select>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddRecommended(product)}
                              className="w-full text-xs"
                            >
                              Add+
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Navigation Arrows */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 h-8 w-8 p-0 bg-white shadow-md"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 h-8 w-8 p-0 bg-white shadow-md"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white p-4 space-y-3">
          {/* Gift Options */}
          <Button
            variant="ghost"
            onClick={() => setShowGiftOptions(!showGiftOptions)}
            className="w-full justify-start p-0 h-auto text-sm text-gray-600"
          >
            <Gift className="h-4 w-4 mr-2" />
            Add Gift Note & Logo Free Packaging +
          </Button>
          
          {showGiftOptions && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <textarea
                placeholder="Add a gift note..."
                className="w-full text-xs border border-gray-200 rounded px-2 py-1 resize-none"
                rows={2}
              />
              <label className="flex items-center space-x-2 text-xs">
                <input type="checkbox" className="rounded" />
                <span>Use free packaging</span>
              </label>
            </div>
          )}
          
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">Subtotal</span>
            <span className="text-lg font-semibold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
          
          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3"
            disabled={items.length === 0}
          >
            CHECKOUT
          </Button>
          
          {/* Payment Options */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-400 h-10"
            >
              <span className="text-xs font-medium">amazon pay</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-yellow-400 h-10"
            >
              <span className="text-xs font-medium">PayPal</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-purple-600 h-10"
            >
              <span className="text-xs font-medium">shop Pay</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
