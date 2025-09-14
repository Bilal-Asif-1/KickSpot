import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home,
  Banknote,
  User,
  MapPin,
  ShoppingBag
} from 'lucide-react'

export default function ThankYouPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { orderId, customerDetails, items, total, paymentMethod } = location.state || {}

  // Prevent back navigation from Thank You page
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href)
      navigate('/', { replace: true })
    }

    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [navigate])

  // If no order data, redirect to home page
  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true })
    }
  }, [orderId, navigate])

  // Show loading while redirecting
  if (!orderId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl p-4 sm:p-6 pt-6 sm:pt-8">
        {/* Success Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-6 ${
            paymentMethod === 'cod' ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            {paymentMethod === 'cod' ? (
              <Banknote className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600" />
            ) : (
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
            Your Order Has Been Placed!
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl">
            Thank you, <span className="font-semibold text-white">{customerDetails?.name}</span>
          </p>
        </div>

        {/* Single Order Details Card */}
        <Card className="bg-white max-w-4xl mx-auto">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side - Customer & Order Info */}
              <div className="space-y-4">
                {/* Customer Information */}
                <div>
                  <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm sm:text-base">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Name</p>
                      <p className="font-medium text-gray-900 text-sm">{customerDetails?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Email</p>
                      <p className="font-medium text-gray-900 text-sm">{customerDetails?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900 text-sm">{customerDetails?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm sm:text-base">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </h3>
                  <p className="text-gray-900 text-sm">{customerDetails?.address}</p>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm sm:text-base">
                    <Package className="h-4 w-4" />
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    {items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                        {item.image_url && (
                          <img 
                            src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image_url}`}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-product.jpg';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-gray-900 text-lg">${total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Payment & Delivery Info */}
              <div className="space-y-4">
                {/* Payment Information */}
                <div>
                  <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm sm:text-base">
                    {paymentMethod === 'cod' ? (
                      <Banknote className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <p className={`font-medium text-sm ${
                        paymentMethod === 'cod' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {paymentMethod === 'cod' ? 'Pending Payment' : 'Payment Successful'}
                      </p>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <p className="text-xs text-yellow-800">
                          You will pay <strong>${total?.toFixed(2)}</strong> in cash when your order is delivered.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Information */}
                <div>
                  <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-3 text-sm sm:text-base">
                    <Truck className="h-4 w-4" />
                    Delivery Information
                  </h3>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">Order Processing</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Your order is being prepared for shipment
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <p className="text-xs text-blue-800">
                        <strong>Estimated Delivery:</strong> 3-5 business days
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        You'll receive a tracking number once your order ships.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4">
                  <div className="space-y-2">
                    <Button 
                      onClick={() => navigate('/orders')} 
                      variant="outline" 
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View All Orders
                    </Button>
                    <Button 
                      onClick={() => navigate('/')} 
                      className="w-full bg-black hover:bg-gray-800 text-white text-sm"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

