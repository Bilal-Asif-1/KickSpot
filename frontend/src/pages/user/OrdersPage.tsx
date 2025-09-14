import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowLeft, Package, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

type Order = { 
  id: number; 
  total_price: number; 
  status: string; 
  created_at: string;
  payment_method?: string;
  payment_status?: string;
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    async function load() {
      try {
        setLoading(true)
        setError(undefined)
        const res = await api.get<Order[]>('/api/v1/orders')
        // Sort orders by created_at date (newest first)
        const sortedOrders = res.data.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA // Newest first
        })
        setOrders(sortedOrders)
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(orderId)
      await api.delete(`/api/v1/orders/${orderId}`)
      setOrders(prev => prev.filter(order => order.id !== orderId))
      toast.success('Order deleted successfully!', {
        style: {
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
    } catch (error: any) {
      console.error('Failed to delete order:', error)
      toast.error(error?.response?.data?.message || 'Failed to delete order', {
        style: {
          background: '#dc2626',
          color: '#ffffff',
          fontWeight: 'bold',
          borderRadius: '9999px',
          padding: '10px 16px',
          fontSize: '14px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          width: 'fit-content',
          minWidth: 'auto'
        }
      })
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'processing':
        return 'bg-blue-500 text-white'
      case 'shipped':
        return 'bg-purple-500 text-white'
      case 'delivered':
        return 'bg-green-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-6 pt-3 sm:pt-8 lg:pt-12 pb-6 sm:pb-12 lg:pb-16">
        {/* Header */}
        <div className="mb-4 sm:mb-8 lg:mb-12">
          <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-3 lg:mb-4">Order History</h1>
          <p className="text-gray-400 text-xs sm:text-base lg:text-xl">View and manage your order history</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-6 sm:py-12 lg:py-16">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-white mx-auto mb-2 sm:mb-4"></div>
            <p className="text-white text-xs sm:text-base lg:text-lg">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-6 mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-xs sm:text-base lg:text-lg font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="space-y-2 sm:space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Package className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700 flex-shrink-0" />
                        <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">Order #{order.id}</h3>
                      </div>
                      <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${getStatusColor(order.status)} w-fit`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                      <div className="flex items-center gap-1.5 sm:gap-3">
                        <DollarSign className="w-3 h-3 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Amount</p>
                          <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900">${order.total_price.toFixed(2)}</p>
                        </div>
                      </div>
                      {order.payment_method && (
                        <div className="flex items-center gap-1.5 sm:gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</p>
                            <p className="text-xs sm:text-base lg:text-lg font-semibold text-gray-700">
                              {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 sm:gap-3">
                        <Calendar className="w-3 h-3 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Date</p>
                          <p className="text-xs sm:text-base lg:text-lg font-semibold text-gray-700">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            }) : 'Recently Ordered'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end lg:justify-start">
                    <Button
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={deletingId === order.id}
                      className="bg-black hover:bg-gray-800 text-white px-3 sm:px-6 py-1.5 sm:py-3 font-semibold text-xs sm:text-base w-full sm:w-auto"
                    >
                      {deletingId === order.id ? (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="animate-spin rounded-full h-2.5 w-2.5 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Trash2 className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
                          <span>Delete Order</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="text-center py-6 sm:py-12 lg:py-16">
                <Package className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-400 mx-auto mb-3 sm:mb-6" />
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4">No orders yet</h2>
                <p className="text-gray-400 text-xs sm:text-base lg:text-lg mb-4 sm:mb-8">Start shopping to see your order history here!</p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-black hover:bg-gray-800 text-white px-4 sm:px-8 py-1.5 sm:py-3 font-semibold text-xs sm:text-base"
                >
                  Start Shopping
                </Button>
              </div>
            )}
            </div>
        )}
      </main>
    </div>
  )
}
