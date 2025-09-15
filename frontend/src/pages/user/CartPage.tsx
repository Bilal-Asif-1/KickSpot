import { useAppDispatch, useAppSelector } from '@/store'
import { removeFromCart, updateQuantity, clearCart } from '@/store/cartSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'

export default function CartPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const cartItems = useAppSelector((state) => state.cart.items)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 flex justify-center">
      <div className="w-full bg-white rounded-xl shadow-md p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </Button>
          )}
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          <div className="space-y-6">
            {/* Items */}
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img 
                    src={item.image_url || '/placeholder-image.jpg'} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size || "N/A"}</p>
                    <Button 
                      variant="link" 
                      className="text-red-500 p-0"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(updateQuantity({ 
                        id: item.id, 
                        quantity: Number(e.target.value) 
                      }))
                    }
                    className="w-20 text-center"
                  />
                  <p className="font-semibold">${item.price * item.quantity}</p>
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
              <p className="text-lg font-bold">Subtotal: ${total}</p>
              <Button 
                className="bg-black text-white px-6 py-2 rounded-lg w-full sm:w-auto"
                onClick={() => navigate('/checkout')}
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
