import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
 
import AdminNavbar from '@/components/AdminNavbar'
import CustomNavbarWrapper from '@/components/CustomNavbarWrapper'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Toaster } from '@/components/ui/sonner'
import { HomePage, ProductsPage, CartPage, CheckoutPage, OrdersPage, AdminDashboardPage } from '@/pages'
import ProductDetailPage from '@/pages/user/ProductDetailPage'
import ThankYouPage from '@/pages/user/ThankYouPage'
import MensPage from '@/pages/user/MensPage'
import WomensPage from '@/pages/user/WomensPage'
import KidsPage from '@/pages/user/KidsPage'
import WishlistPage from '@/pages/user/WishlistPage'
import HelpSupportPage from '@/pages/user/HelpSupportPage'
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
import { useFavoritesPersistence } from '@/hooks/useFavoritesPersistence'
import LogoutLoadingScreen from '@/components/LogoutLoadingScreen'

function AppContent() {
  const { user, token, loading, logoutLoading } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const isSellerRoute = location.pathname.startsWith('/admin')
  const isOriginalLayout = location.pathname.startsWith('/original')
  const isCustomLayout = location.pathname === '/custom'
  const isSeller = user?.role === 'seller'

  // Initialize cart persistence
  useCartPersistence()
  
  // Initialize favorites persistence
  useFavoritesPersistence()

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
      {/* Show logout loading screen */}
      {logoutLoading && <LogoutLoadingScreen />}
      
      {!isCustomLayout && !isOriginalLayout && ((isSellerRoute || isSeller) ? <AdminNavbar /> : null)}
          <Routes>
        <Route path="/" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <HomePage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/custom" element={<CustomLayoutPage />} />
        <Route path="/original" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <OriginalLayoutPage>
              <HomePage />
            </OriginalLayoutPage>
          )
        } />
        <Route path="/original/products" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <OriginalLayoutPage>
              <ProductsPage />
            </OriginalLayoutPage>
          )
        } />
        <Route path="/original/cart" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <OriginalLayoutPage>
                <CartPage />
              </OriginalLayoutPage>
            </ProtectedRoute>
          )
        } />
        <Route path="/original/checkout" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <OriginalLayoutPage>
                <CheckoutPage />
              </OriginalLayoutPage>
            </ProtectedRoute>
          )
        } />
        <Route path="/original/orders" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <OriginalLayoutPage>
                <OrdersPage />
              </OriginalLayoutPage>
            </ProtectedRoute>
          )
        } />
        <Route path="/products" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <ProductsPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/products/:id" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <ProductDetailPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/men" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <MensPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/women" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <WomensPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/kids" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <CustomNavbarWrapper>
              <KidsPage />
            </CustomNavbarWrapper>
          )
        } />
        <Route path="/cart" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CustomNavbarWrapper>
                <CartPage />
              </CustomNavbarWrapper>
            </ProtectedRoute>
          )
        } />
        <Route path="/checkout" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          )
        } />
        <Route path="/thank-you" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <ThankYouPage />
            </ProtectedRoute>
          )
        } />
        <Route path="/orders" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          )
        } />
        <Route path="/notifications" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CustomNavbarWrapper>
                <UserNotificationsPage />
              </CustomNavbarWrapper>
            </ProtectedRoute>
          )
        } />
        <Route path="/wishlist" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CustomNavbarWrapper>
                <WishlistPage />
              </CustomNavbarWrapper>
            </ProtectedRoute>
          )
        } />
        <Route path="/help" element={
          isSeller ? <Navigate to="/admin" replace /> : (
            <ProtectedRoute>
              <CustomNavbarWrapper>
                <HelpSupportPage />
              </CustomNavbarWrapper>
            </ProtectedRoute>
          )
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireSeller>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute requireSeller>
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute requireSeller>
            <AdminCustomers />
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute requireSeller>
            <AdminNotifications />
          </ProtectedRoute>
        } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={
          isSeller ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />
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
