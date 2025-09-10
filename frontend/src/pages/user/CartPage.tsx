import { useAppDispatch, useAppSelector } from '@/store'
import { removeFromCart, updateQuantity, clearCart } from '@/store/cartSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, total } = useAppSelector(s => s.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleClearCart = () => {
    dispatch(clearCart())
    toast.success('Cart cleared successfully!')
  }

  return (
    <div>
      <main className="mx-auto max-w-7xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Your Cart</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={handleClearCart}>
              Clear Cart
            </Button>
          )}
        </div>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center justify-between border rounded p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      className="w-20"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value) || 1
                        dispatch(updateQuantity({ id: item.id, quantity: newQuantity }))
                        toast.success('Quantity updated')
                      }}
                    />
                    <Button variant="outline" onClick={() => {
                      dispatch(removeFromCart(item.id))
                      toast.success('Item removed from cart')
                    }}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
            <aside className="border rounded p-4 h-fit space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
              <Button variant="outline" className="w-full" onClick={() => {
                dispatch(clearCart())
                toast.success('Cart cleared')
              }}>Clear Cart</Button>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
