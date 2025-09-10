import { useAppSelector } from '@/store'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
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

  // If admin access is required but user is not admin
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
