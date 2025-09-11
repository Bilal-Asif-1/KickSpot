import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import BuyerNavbar from '@/components/BuyerNavbar'
import AdminNavbar from '@/components/AdminNavbar'
import CustomNavbarWrapper from '@/components/CustomNavbarWrapper'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/sonner'
import { HomePage, ProductsPage, CartPage, CheckoutPage, OrdersPage, AdminDashboardPage } from '@/pages'
import MensPage from '@/pages/user/MensPage'
import WomensPage from '@/pages/user/WomensPage'
import KidsPage from '@/pages/user/KidsPage'
import AdminOrders from '@/pages/admin/AdminOrdersPage'
import AdminCustomers from '@/pages/admin/AdminCustomersPage'
import AdminNotifications from '@/pages/admin/AdminNotificationsPage'
import UserNotificationsPage from '@/pages/user/UserNotificationsPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import CustomLayoutPage from '@/pages/CustomLayoutPage'
import OriginalLayoutPage from '@/pages/OriginalLayoutPage'
import { useAppSelector, useAppDispatch } from '@/store'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchCurrentUser } from '@/store/authSlice'
import { useCartPersistence } from '@/hooks/useCartPersistence'

function AppContent() {
  const { user, token, loading } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isOriginalLayout = location.pathname.startsWith('/original')
  const isCustomLayout = location.pathname === '/custom'
  const isAdmin = user?.role === 'admin'

  // Initialize cart persistence
  useCartPersistence()

  useEffect(() => {
    if (!user && token) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, user, token])


  // Show loading screen while auth is being validated
  if (loading && token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  
  return (
    <>
      {!isCustomLayout && !isOriginalLayout && ((isAdminRoute || isAdmin) ? <AdminNavbar /> : null)}
          <Routes>
        <Route path="/" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <HomePage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/custom" element={<CustomLayoutPage />} />
        <Route path="/original" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <OriginalLayoutPage>
              <HomePage />
            </OriginalLayoutPage>
          )
        } />
        <Route path="/original/products" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <OriginalLayoutPage>
              <ProductsPage />
            </OriginalLayoutPage>
          )
        } />
        <Route path="/original/cart" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <OriginalLayoutPage>
                <CartPage />
              </OriginalLayoutPage>
            </ProtectedRoute>
          )
        } />
        <Route path="/original/checkout" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <OriginalLayoutPage>
                <CheckoutPage />
              </OriginalLayoutPage>
            </ProtectedRoute>
          )
        } />
        <Route path="/original/orders" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <OriginalLayoutPage>
                <OrdersPage />
              </OriginalLayoutPage>
            </ProtectedRoute>
          )
        } />
        <Route path="/products" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <ProductsPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/men" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <MensPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/women" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <WomensPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/kids" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <KidsPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/cart" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CustomNavbarWrapper>
                <CartPage />
              </CustomNavbarWrapper>
            </ProtectedRoute>
          )
        } />
        <Route path="/checkout" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CustomNavbarWrapper>
                <CheckoutPage />
              </CustomNavbarWrapper>
            </ProtectedRoute>
          )
        } />
        <Route path="/orders" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CustomNavbarWrapper>
                <OrdersPage />
              </CustomNavbarWrapper>
            </ProtectedRoute>
          )
        } />
        <Route path="/notifications" element={
          isAdmin ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CustomNavbarWrapper>
                <UserNotificationsPage />
              </CustomNavbarWrapper>
            </ProtectedRoute>
          )
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute requireAdmin>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute requireAdmin>
            <AdminCustomers />
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute requireAdmin>
            <AdminNotifications />
          </ProtectedRoute>
        } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={
          isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
        } />
          </Routes>
          <Toaster />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
