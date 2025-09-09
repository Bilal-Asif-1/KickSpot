import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppSelector, useAppDispatch } from '@/store'
import { logout } from '@/store/authSlice'

export default function BuyerNavbar() {
  const { user } = useAppSelector(s => s.auth)
  const dispatch = useAppDispatch()

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="font-semibold text-xl">KickSpot</Link>
        <nav className="ml-auto hidden gap-6 md:flex">
          <Link to="/products" className="text-sm">All Products</Link>
          <Link to="/products?category=Men" className="text-sm">Men</Link>
          <Link to="/products?category=Women" className="text-sm">Women</Link>
          <Link to="/products?category=Kids" className="text-sm">Kids</Link>
          {user && (
            <Link to="/orders" className="text-sm">My Orders</Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
