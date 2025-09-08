import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useSocket } from '@/hooks/useSocket'
import ProductForm from '@/components/ProductForm'

type Product = { id: number; name: string; category: string; price: number; stock: number }
type Order = { id: number; user_id: number; total_price: number; status: 'pending' | 'processing' | 'delivered' }
type Customer = { id: number; name: string; email: string; role: string }

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [notifications, setNotifications] = useState<any[]>([])
  const socket = useSocket()

  async function loadAll() {
    try {
      setLoading(true)
      setError(undefined)
      const [p, o, c] = await Promise.all([
        api.get<Product[]>('/api/v1/products'),
        api.get<Order[]>('/api/v1/orders').catch(() => ({ data: [] as Order[] })),
        api.get<Customer[]>('/api/v1/customers').catch(() => ({ data: [] as Customer[] })),
      ])
      setProducts(p.data)
      setOrders(o.data)
      setCustomers(c.data)
    } catch (e: any) {
      setError(e?.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev])
      })
      return () => {
        socket.off('notification')
      }
    }
  }, [socket])

  async function deleteProduct(id: number) {
    await api.delete(`/api/v1/products/${id}`).catch(() => {})
    await loadAll()
  }

  async function updateOrderStatus(id: number, status: Order['status']) {
    await api.put(`/api/v1/orders/${id}/status`, { status }).catch(() => {})
    await loadAll()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your shoe store inventory and track customer orders</p>
        </div>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {loading && <p>Loading...</p>}
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-slate-600">Total Products</h3>
            <p className="text-2xl font-bold text-slate-800">{products.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-slate-600">Total Orders</h3>
            <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-slate-600">Total Customers</h3>
            <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-slate-600">Low Stock Items</h3>
            <p className="text-2xl font-bold text-red-600">{products.filter(p => p.stock < 10).length}</p>
          </div>
        </div>
        
        {notifications.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold mb-2">Recent Notifications</h3>
            {notifications.slice(0, 3).map((n, i) => (
              <p key={i} className="text-sm">{n.message}</p>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6">
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Products</h2>
              <Button onClick={() => setShowProductForm(true)}>Add Product</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b">
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">{p.category}</td>
                      <td className="p-2">${p.price.toFixed(2)}</td>
                      <td className="p-2">{p.stock}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditingProduct(p); setShowProductForm(true) }}>Edit</Button>
                          <Button variant="outline" size="sm" onClick={() => deleteProduct(p.id)}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">ID</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b">
                      <td className="p-2">{o.id}</td>
                      <td className="p-2">{o.user_id}</td>
                      <td className="p-2">${o.total_price.toFixed(2)}</td>
                      <td className="p-2">{o.status}</td>
                      <td className="p-2 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateOrderStatus(o.id, 'processing')}>Processing</Button>
                        <Button variant="outline" size="sm" onClick={() => updateOrderStatus(o.id, 'delivered')}>Delivered</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Customers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(u => (
                    <tr key={u.id} className="border-b">
                      <td className="p-2">{u.id}</td>
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        
        {showProductForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
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
        )}
      </main>
    </div>
  )
}

