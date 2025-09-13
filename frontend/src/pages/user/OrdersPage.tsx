import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowLeft, Package, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

type Order = { id: number; total_price: number; status: string }

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
        setOrders(res.data)
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
      <main className="mx-auto max-w-6xl px-4 pt-12 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Order History</h1>
          <p className="text-gray-400 text-xl">View and manage your order history</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-700 text-lg font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-6 h-6 text-gray-700" />
                        <h3 className="text-2xl font-bold text-gray-900">Order #{order.id}</h3>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">${order.total_price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Order Date</p>
                          <p className="text-lg font-semibold text-gray-700">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { 
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
                  <div className="ml-6">
                    <Button
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={deletingId === order.id}
                      className="bg-black hover:bg-gray-800 text-white px-6 py-3 font-semibold"
                    >
                      {deletingId === order.id ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
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
              <div className="text-center py-16">
                <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">No orders yet</h2>
                <p className="text-gray-400 text-lg mb-8">Start shopping to see your order history here!</p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-semibold"
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
