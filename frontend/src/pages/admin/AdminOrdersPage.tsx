import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type Order = { id: number; user_id: number; total_price: number; status: string }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(undefined)
        const res = await api.get<Order[]>('/api/v1/admin/orders')
        setOrders(res.data)
      } catch (e: any) {
        setError(e?.message || 'Failed to load orders')
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
      toast.success('Order deleted successfully!')
    } catch (error: any) {
      console.error('Failed to delete order:', error)
      toast.error(error?.response?.data?.message || 'Failed to delete order')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
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
                <td className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOrder(o.id)}
                    disabled={deletingId === o.id}
                    className="text-red-600 hover:text-red-700"
                  >
                    {deletingId === o.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr><td className="p-4 text-muted-foreground" colSpan={5}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


