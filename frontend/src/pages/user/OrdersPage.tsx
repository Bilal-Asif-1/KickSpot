import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type Order = { id: number; total_price: number; status: string }

export default function OrdersPage() {
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
      toast.success('Order deleted successfully!')
    } catch (error: any) {
      console.error('Failed to delete order:', error)
      toast.error(error?.response?.data?.message || 'Failed to delete order')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <main className="mx-auto max-w-7xl p-4">
        <h1 className="text-2xl font-semibold mb-4">Order History</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">Order #{o.id}</p>
                <p className="text-sm text-muted-foreground">Status: {o.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-semibold">${o.total_price.toFixed(2)}</div>
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
              </div>
            </div>
          ))}
          {orders.length === 0 && !loading && <p className="text-muted-foreground">No orders yet.</p>}
        </div>
      </main>
    </div>
  )
}
