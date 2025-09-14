import { useAppSelector } from '@/store'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireSeller?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireSeller = false 
}: ProtectedRouteProps) {
  const { user, token, loading } = useAppSelector(state => state.auth)
  const location = useLocation()

  // If authentication is required but user is not logged in
  if (requireAuth && (!user || !token)) {
    if (token && loading) {
      // Show loading spinner while validating token
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If seller access is required but user is not seller
  if (requireSeller && user?.role !== 'seller') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
