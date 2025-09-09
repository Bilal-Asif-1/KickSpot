import { useAppDispatch, useAppSelector } from '@/store'
import { removeFromCart, setQuantity, clearCart } from '@/store/cartSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'

export default function CartPage() {
  const { items } = useAppSelector(s => s.cart)
  const dispatch = useAppDispatch()
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const navigate = useNavigate()

  return (
    <div>
      <main className="mx-auto max-w-7xl p-4">
        <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      className="w-20"
                      value={quantity}
                      onChange={(e) => dispatch(setQuantity({ id: product.id, quantity: Number(e.target.value) || 1 }))}
                    />
                    <Button variant="outline" onClick={() => dispatch(removeFromCart(product.id))}>Remove</Button>
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
              <Button variant="outline" className="w-full" onClick={() => dispatch(clearCart())}>Clear Cart</Button>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
