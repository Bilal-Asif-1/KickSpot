import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Calendar, 
  Home,
  ShoppingBag,
  Banknote,
  Clock
} from 'lucide-react'

export default function ThankYouPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { orderId, customerDetails, items, total, paymentIntent, paymentMethod } = location.state || {}

  // Prevent back navigation from Thank You page
  useEffect(() => {
    const handlePopState = () => {
      // Push the current state back to prevent going back to checkout
      window.history.pushState(null, '', window.location.href)
      // Navigate to landing page instead
      navigate('/', { replace: true })
    }

    // Push current state to history to prevent back navigation
    window.history.pushState(null, '', window.location.href)
    
    // Add event listener for back button
    window.addEventListener('popstate', handlePopState)

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate])

  if (!orderId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-semibold mb-2">No order found</h2>
            <p className="text-slate-600 mb-6">It seems you haven't placed an order yet.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate estimated delivery date (3-5 business days for Stripe, 5-7 for COD)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + (paymentMethod === 'cod' ? 7 : 5))

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl p-6 pt-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            paymentMethod === 'cod' ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            {paymentMethod === 'cod' ? (
              <Banknote className="h-10 w-10 text-yellow-600" />
            ) : (
              <CheckCircle className="h-10 w-10 text-green-600" />
            )}
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            {paymentMethod === 'cod' ? 'COD Order Placed!' : 'Order Confirmed!'}
          </h1>
          <p className="text-gray-400 text-xl">
            {paymentMethod === 'cod' 
              ? `Thank you for your order, ${customerDetails?.name}. You will pay when delivered.`
              : `Thank you for your purchase, ${customerDetails?.name}`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  Order ID: #{orderId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    {item.image_url && (
                      <img 
                        src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image_url}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                      {item.size && <p className="text-sm text-slate-500">Size: {item.size}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">Total Paid</span>
                    <span className="font-bold text-xl text-green-600">${total?.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {paymentMethod === 'cod' ? (
                    <Banknote className="h-5 w-5" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-slate-600">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card via Stripe'}
                    </p>
                  </div>
                  <Badge className={
                    paymentMethod === 'cod' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }>
                    {paymentMethod === 'cod' ? 'Pending' : 'Paid'}
                  </Badge>
                </div>
                {paymentMethod === 'cod' ? (
                  <div className="mt-3 space-y-2">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800 font-medium">
                          Payment Due on Delivery
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        You will pay ${total?.toFixed(2)} in cash when your order is delivered.
                      </p>
                    </div>
                  </div>
                ) : (
                  paymentIntent && (
                    <div className="mt-3 text-sm text-slate-500">
                      Transaction ID: {paymentIntent.id}
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>

          {/* Delivery Information */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Order Processing</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {paymentMethod === 'cod' 
                      ? 'Your COD order is being prepared for shipment'
                      : 'Your order is being prepared for shipment'
                    }
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium text-sm">Estimated Delivery</p>
                      <p className="text-sm text-slate-600">
                        {deliveryDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      <strong>Shipping Time:</strong> 3-5 business days
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      You'll receive a tracking number once your order ships.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => navigate('/orders')} 
                    variant="outline" 
                    className="w-full mb-3"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                  <Button 
                    onClick={() => navigate('/')} 
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}

