import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProductForm from '@/components/ProductForm'
import { toast } from 'sonner'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  AlertTriangle, 
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

type Product = { 
  id: number; 
  name: string; 
  category: string; 
  price: number; 
  stock: number; 
  image_url?: string; 
  description?: string;
  originalPrice?: number;
  discount?: number;
  isOnSale?: boolean;
  buyCount: number;
}
type Order = { 
  id: number; 
  user_id: number; 
  total_price: number; 
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  created_at?: string;
  user?: { name: string; email: string };
  items?: Array<{ product: Product; quantity: number; price: number }>;
}

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  async function loadAll() {
    try {
      setLoading(true)
      setError(undefined)
      const [p, o] = await Promise.all([
        api.get<Product[]>('/api/v1/admin/products'),
        api.get<Order[]>('/api/v1/admin/orders').catch(() => ({ data: [] as Order[] })),
      ])
      setProducts(p.data)
      setOrders(o.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product? If it has existing orders, it will be archived instead.')) {
      return
    }
    try {
      const response = await api.delete(`/api/v1/products/${id}`)
      if (response.data?.archived) {
        toast.info('Product has existing orders and has been archived (stock set to 0)', {
          style: {
            background: '#3b82f6',
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
      } else {
        toast.success('Product deleted successfully', {
          style: {
            background: '#10b981',
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
      await loadAll()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete product')
    }
  }

  async function updateOrderStatus(id: number, status: Order['status']) {
    try {
      await api.put(`/api/v1/orders/${id}/status`, { status })
      toast.success(`Order #${id} status updated to ${status}`, {
        style: {
          background: '#10b981',
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
      await loadAll()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status')
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={loadAll} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const lowStockProducts = products.filter(p => p.stock < 10).length
  const recentOrders = orders // Show all orders, scroll to see more
  const recentProducts = products // Show all products, scroll to see more

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Seller Dashboard</h1>
          <p className="text-slate-600">Manage your products, orders, and business analytics</p>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Products</CardTitle>
              <Package className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{products.length}</div>
              <p className="text-xs text-slate-500">Active inventory items</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{orders.length}</div>
              <p className="text-xs text-slate-500">{pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-500">All time sales</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Low Stock Alert</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
              <p className="text-xs text-slate-500">Items need restocking</p>
            </CardContent>
          </Card>
        </div>

        {/* Product Inventory - Moved to be right after statistics */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Inventory
                </CardTitle>
                <CardDescription>Manage your product catalog and inventory</CardDescription>
              </div>
              <Button onClick={() => setShowProductForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
              <div className="overflow-x-auto pr-2">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-3 font-medium text-slate-600">Product</th>
                      <th className="p-3 font-medium text-slate-600">Category</th>
                      <th className="p-3 font-medium text-slate-600">Price</th>
                      <th className="p-3 font-medium text-slate-600">Stock</th>
                      <th className="p-3 font-medium text-slate-600">Status</th>
                      <th className="p-3 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map(product => (
                      <tr key={product.id} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {product.image_url ? (
                              <img 
                                src={product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image_url}`} 
                                alt={product.name} 
                                className="w-12 h-12 object-cover rounded-lg" 
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-slate-900">{product.name}</p>
                              <p className="text-sm text-slate-500">ID: #{product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">${product.price.toFixed(2)}</span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-slate-500 line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {product.stock}
                            </span>
                            {product.stock <= 5 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setEditingProduct(product)
                                setShowProductForm(true)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && !loading && (
                  <div className="text-center py-8 text-slate-500">
                    <Package className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No products yet. Add your first product to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest customer orders and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
                <div className="space-y-4 pr-2">
                  {recentOrders.length > 0 ? (
                    recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-medium">#{order.id}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Customer #{order.user_id}</p>
                            <p className="text-xs text-slate-500">${order.total_price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                              disabled={order.status === 'processing' || order.status === 'delivered'}
                            >
                              Process
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              disabled={order.status === 'delivered'}
                            >
                              Deliver
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setShowProductForm(true)} 
                className="w-full justify-start"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                size="sm"
                onClick={() => window.location.href = '/admin/orders'}
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Orders
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                size="sm"
                onClick={() => window.location.href = '/admin/customers'}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Customers
              </Button>
              {lowStockProducts > 0 && (
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => window.location.href = '/admin/products'}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Restock Items ({lowStockProducts})
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        {showProductForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {editingProduct ? 'Update product information' : 'Add a new product to your inventory'}
                </p>
              </div>
              <div className="p-6">
              <ProductForm
                product={editingProduct}
                onSuccess={() => {
                  setShowProductForm(false)
                  setEditingProduct(undefined)
                  loadAll()
                }}
                onCancel={() => {
                  setShowProductForm(false)
                  setEditingProduct(undefined)
                }}
              />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}