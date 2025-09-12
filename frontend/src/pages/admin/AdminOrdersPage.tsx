import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Activity,
  User,
  Package,
  DollarSign,
  Calendar,
  MoreHorizontal
} from 'lucide-react'
import { toast } from 'sonner'

type Order = { 
  id: number; 
  user_id: number; 
  total_price: number; 
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  user?: { 
    id: number;
    name: string; 
    email: string;
    contactNumber?: string;
    deliveryAddress?: string;
  };
  items?: Array<{ 
    id: number;
    product: { 
      id: number;
      name: string; 
      image_url?: string;
      price: number;
    }; 
    quantity: number; 
    price: number;
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(undefined)
        const res = await api.get<Order[]>('/api/v1/admin/orders')
        setOrders(res.data)
        setFilteredOrders(res.data)
      } catch (e: any) {
        setError(e?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(searchTerm) ||
        order.user_id.toString().includes(searchTerm) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Activity className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.put(`/api/v1/orders/${orderId}/status`, { status: newStatus })
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ))
      toast.success(`Order status updated to ${newStatus}`, {
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
      console.error('Failed to update order status:', error)
      toast.error(error?.response?.data?.message || 'Failed to update order status', {
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
    }
  }

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

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Management</h1>
          <p className="text-slate-600 text-lg">Manage customer orders and track their status</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <span className="ml-2 text-slate-600">Loading orders...</span>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders by ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Orders ({filteredOrders.length})
            </CardTitle>
            <CardDescription>
              {searchTerm || statusFilter !== 'all' 
                ? `Filtered results from ${orders.length} total orders`
                : 'All customer orders'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-semibold text-lg">#{order.id}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {order.user?.name || `Customer #${order.user_id}`}
                          </p>
                          <p className="text-sm text-slate-500">{order.user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-lg">${order.total_price.toFixed(2)}</p>
                          <p className="text-sm text-slate-500">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {order.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                            >
                              Process
                            </Button>
                          )}
                          
                          {order.status === 'processing' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            >
                              Deliver
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deletingId === order.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            {deletingId === order.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No orders found</h3>
                  <p className="text-slate-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'No orders have been placed yet'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-slate-900">
                  Order Details #{selectedOrder.id}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Customer order information and items
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.user?.name || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                    <p><span className="font-medium">Contact:</span> {selectedOrder.user?.contactNumber || 'N/A'}</p>
                    <p><span className="font-medium">Address:</span> {selectedOrder.user?.deliveryAddress || 'N/A'}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Order Information
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Order ID:</span> #{selectedOrder.id}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Total:</span> ${selectedOrder.total_price.toFixed(2)}</p>
                    <p><span className="font-medium">Date:</span> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>

                {/* Order Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                          {item.product.image_url && (
                            <img 
                              src={item.product.image_url.startsWith('http') ? item.product.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.product.image_url}`} 
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-slate-500">each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                  Close
                </Button>
                {selectedOrder.status === 'pending' && (
                  <Button onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, 'processing')
                    setShowOrderDetails(false)
                  }}>
                    Mark as Processing
                  </Button>
                )}
                {selectedOrder.status === 'processing' && (
                  <Button onClick={() => {
                    handleUpdateOrderStatus(selectedOrder.id, 'delivered')
                    setShowOrderDetails(false)
                  }}>
                    Mark as Delivered
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


