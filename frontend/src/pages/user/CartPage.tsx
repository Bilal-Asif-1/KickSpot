import { useAppDispatch, useAppSelector } from '@/store'
import { removeFromCart, updateQuantity, clearCart } from '@/store/cartSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { items, total } = useAppSelector(s => s.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleClearCart = () => {
    dispatch(clearCart())
    toast.success('Cart cleared successfully!')
  }

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
  }

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId))
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="text-black hover:bg-gray-100 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl sm:text-3xl font-bold text-black">Shopping Cart</h1>
          </div>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="hidden sm:flex border-black text-black hover:bg-black hover:text-white px-3 sm:px-4 py-2"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any items to your cart yet.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-lg font-semibold"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6 xl:space-y-0 xl:grid xl:grid-cols-3 xl:gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden mx-auto sm:mx-0">
                      {item.image_url ? (
                        <img 
                          src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image_url}`}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-black mb-1">{item.name}</h3>
                          <p className="text-base sm:text-lg font-bold text-black">${item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Product Variants */}
                      <div className="space-y-1 mb-4">
                        {item.color && (
                          <p className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Color:</span> {item.color}
                          </p>
                        )}
                        {item.size && (
                          <p className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Size:</span> {item.size}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg w-fit mx-auto sm:mx-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            className="w-12 sm:w-16 h-7 sm:h-8 text-center border-0 focus:ring-0 text-xs sm:text-sm"
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = Number(e.target.value) || 1
                              handleQuantityChange(item.id, newQuantity)
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 sm:px-3 sm:py-2 w-fit mx-auto sm:mx-0"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="text-xs sm:text-sm">Remove</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 xl:sticky xl:top-4">
                <h2 className="text-lg sm:text-xl font-bold text-black mb-4 sm:mb-6">Order Summary</h2>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 sm:pt-4">
                    <div className="flex justify-between text-base sm:text-lg font-bold text-black">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white py-2 sm:py-3 text-sm sm:text-lg font-semibold"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-black text-black hover:bg-black hover:text-white py-2 sm:py-3 text-sm sm:text-base"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </Button>
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-300">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span>Free shipping on orders over $50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
