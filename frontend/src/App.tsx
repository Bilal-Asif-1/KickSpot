import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import BuyerNavbar from '@/components/BuyerNavbar'
import AdminNavbar from '@/components/AdminNavbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import { HomePage, ProductsPage, CartPage, CheckoutPage, OrdersPage, AdminDashboardPage } from '@/pages'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import { useAppSelector } from '@/store'

function AppContent() {
  const { user } = useAppSelector(state => state.auth)
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  
  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <BuyerNavbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
