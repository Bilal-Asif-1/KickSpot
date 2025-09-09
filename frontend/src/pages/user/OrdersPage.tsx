import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Order = { id: number; total_price: number; status: string }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
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
              <div className="font-semibold">${o.total_price.toFixed(2)}</div>
            </div>
          ))}
          {orders.length === 0 && !loading && <p className="text-muted-foreground">No orders yet.</p>}
        </div>
      </main>
    </div>
  )
}
