import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Calendar, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Home,
  ShoppingBag
} from 'lucide-react'

export default function ThankYouPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { orderId, customerDetails, items, total, paymentIntent } = location.state || {}

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
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

  // Calculate estimated delivery date (3-5 business days)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl p-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-600 text-lg">Thank you for your purchase, {customerDetails?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-sm text-slate-600">{customerDetails?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-slate-600">{customerDetails?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-sm text-slate-600">{customerDetails?.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-500 mt-1" />
                    <div>
                      <p className="font-medium">Delivery Address</p>
                      <p className="text-sm text-slate-600">{customerDetails?.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-slate-600">Credit/Debit Card via Stripe</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Paid
                  </Badge>
                </div>
                {paymentIntent && (
                  <div className="mt-3 text-sm text-slate-500">
                    Transaction ID: {paymentIntent.id}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Delivery Information */}
          <div className="lg:col-span-1">
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
                    Your order is being prepared for shipment
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

        {/* Additional Information */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full mb-3">
                  <span className="text-sm font-semibold">1</span>
                </div>
                <h4 className="font-medium mb-2">Order Confirmation</h4>
                <p className="text-sm text-slate-600">
                  You'll receive an email confirmation with your order details
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full mb-3">
                  <span className="text-sm font-semibold">2</span>
                </div>
                <h4 className="font-medium mb-2">Processing</h4>
                <p className="text-sm text-slate-600">
                  We'll prepare your order and notify you when it ships
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full mb-3">
                  <span className="text-sm font-semibold">3</span>
                </div>
                <h4 className="font-medium mb-2">Delivery</h4>
                <p className="text-sm text-slate-600">
                  Your order will be delivered to your specified address
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

