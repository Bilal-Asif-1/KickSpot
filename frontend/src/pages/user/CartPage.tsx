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
    toast.success('Cart cleared successfully!', {
      style: {
        background: '#000000',
        color: '#ffffff',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }
    })
  }

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }))
    toast.success('Quantity updated', {
      style: {
        background: '#000000',
        color: '#ffffff',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '12px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }
    })
  }

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId))
    toast.success('Item removed from cart', {
      style: {
        background: '#000000',
        color: '#ffffff',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '12px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="text-black hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          </div>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img 
                          src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image_url}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, show placeholder
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-black mb-2">{item.name}</h3>
                      <p className="text-xl font-bold text-black mb-3">${item.price.toFixed(2)}</p>
                      
                      {/* Product Variants */}
                      <div className="space-y-1 mb-4">
                        {item.color && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Color:</span> {item.color}
                          </p>
                        )}
                        {item.size && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Size:</span> {item.size}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            min={1}
                            className="w-16 h-8 text-center border-0 focus:ring-0"
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
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg font-semibold"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-black text-black hover:bg-black hover:text-white py-3"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-300">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Free shipping on orders over $50</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
