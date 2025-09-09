import { Link } from 'react-router-dom'
import { Package, Users, BarChart3, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/store'
import { logout } from '@/store/authSlice'

export default function AdminNavbar() {
  const { user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()

  return (
    <header className="border-b bg-slate-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/admin" className="font-semibold text-xl text-slate-800">KickSpot Admin</Link>
        <nav className="ml-auto hidden gap-6 md:flex">
          <Link to="/admin" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <BarChart3 className="h-4 w-4" />
            Orders
          </Link>
          <Link to="/admin/customers" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <Users className="h-4 w-4" />
            Customers
          </Link>
          <Link to="/admin/notifications" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <Bell className="h-4 w-4" />
            Notifications
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-4">
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                Admin: {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
