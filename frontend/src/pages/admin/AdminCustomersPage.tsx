import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type Customer = { id: number; name: string; email: string; role: string }

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(undefined)
        const res = await api.get<Customer[]>('/api/v1/admin/buyers')
        setCustomers(res.data)
      } catch (e: any) {
        setError(e?.message || 'Failed to load buyers')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
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
            {customers.length === 0 && !loading && (
              <tr><td className="p-4 text-muted-foreground" colSpan={4}>No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}



