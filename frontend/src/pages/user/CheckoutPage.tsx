import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { clearCart } from '../../store/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../../lib/api';

// Initialize Stripe with environment variable
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S6JLwRxRkUAMy5zwwwiwAtVeKF8gPvTaYhcKZb1GF3YaVn28O0ahz1FyNvYCLdC74wK82JQy1tMb458Ng6WF5wi00GfwmSjgU';
console.log('Stripe Key:', stripeKey ? 'Loaded' : 'Missing');
console.log('Environment Variable:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Ensure we never pass an empty string to Stripe
const finalStripeKey = stripeKey || 'pk_test_51S6JLwRxRkUAMy5zwwwiwAtVeKF8gPvTaYhcKZb1GF3YaVn28O0ahz1FyNvYCLdC74wK82JQy1tMb458Ng6WF5wi00GfwmSjgU';
const stripePromise = loadStripe(finalStripeKey);

// Helper function to process image URLs
const toSrc = (url?: string | null) => {
  if (!url) return '';
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return url.startsWith('http') ? url : `${base}${url}`;
};

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

const CheckoutForm: React.FC<{ onPaymentSuccess: (orderId: string, paymentMethod: string, customerInfo: any) => void }> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  // Calculate totals
  const totalAmount = cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = totalAmount * 0.1; // 10% tax
  const finalTotal = totalAmount + shipping + tax;

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order arrives',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setError(null);
  };

  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card information not found. Please enter your card details.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const orderItems = cartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
      }));
      
      console.log('Stripe Order Items being sent to backend:', orderItems);
      console.log('Cart items before mapping:', cartItems);
      
      const response = await api.post('/api/v1/payments/create-payment-intent', {
        items: orderItems,
        customerInfo,
      });

      const { clientSecret } = response.data;

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            address: {
              line1: customerInfo.address,
            },
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const confirmResponse = await api.post('/api/v1/payments/confirm-payment', {
          paymentIntentId: paymentIntent.id,
        });

        const { orderId } = confirmResponse.data;
        onPaymentSuccess(orderId, 'stripe', customerInfo);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderItems = cartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
      }));
      
      console.log('COD Order Items being sent to backend:', orderItems);
      console.log('Cart items before mapping:', cartItems);
      
      const response = await api.post('/api/v1/payments/create-cod-order', {
        items: orderItems,
        customerInfo,
      });

      const { orderId } = response.data;
      onPaymentSuccess(orderId, 'cod', customerInfo);
    } catch (err) {
      setError('Failed to place COD order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      setError('Please fill in all required fields');
      return;
    }

    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    } else {
      await handleCODPayment();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Single Checkout Form Card with Order Summary */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Customer Information */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Middle Side - Payment Information */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment Method</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label key={method.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => handlePaymentMethodChange(method.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{method.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Stripe Card Element */}
            {paymentMethod === 'stripe' && (
              <div className="mt-4">
                <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Card Information</h4>
                <div className="p-3 border border-gray-300 rounded-md bg-white">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '14px',
                          color: '#424770',
                          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                          fontSmoothing: 'antialiased',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                      hidePostalCode: false,
                    }}
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Enter your card details securely. We use Stripe for secure payment processing.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Processing...' : paymentMethod === 'stripe' ? 'Pay Now' : 'Place COD Order'}
            </button>
          </div>

          {/* Right Side - Order Summary */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order Summary</h3>
            
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={toSrc(item.image_url)}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Back to Cart Button */}
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const totalAmount = cartItems.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = totalAmount * 0.1; // 10% tax
  const finalTotal = totalAmount + shipping + tax;

  const handlePaymentSuccess = (orderId: string, paymentMethod: string, customerInfo: any) => {
    // Navigate first, then clear cart
    navigate('/thank-you', {
      state: {
        orderId,
        paymentMethod,
        customerDetails: customerInfo,
        items: cartItems,
        total: finalTotal
      }
    });
    
    // Clear cart after navigation
    setTimeout(() => {
      dispatch(clearCart());
    }, 100);
  };


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-gray-300 text-sm sm:text-base">Complete your order</p>
        </div>

        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        ) : (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm sm:text-base">Loading payment system...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
