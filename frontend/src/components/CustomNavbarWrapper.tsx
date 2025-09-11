import CustomNavbar from '@/components/CustomNavbar'
import CartDrawer from '@/components/CartDrawer'
import NotificationDrawer from '@/components/NotificationDrawer'
import { useState } from 'react'

type CustomNavbarWrapperProps = {
  children: React.ReactNode
}

export default function CustomNavbarWrapper({ children }: CustomNavbarWrapperProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <div className="relative">
      <CustomNavbar 
        onCartOpen={() => setIsCartOpen(true)} 
        onNotificationOpen={() => setIsNotificationOpen(true)}
        isCartOpen={isCartOpen}
        isNotificationOpen={isNotificationOpen}
      />
      
      {/* Main Content */}
      <div>
        {children}
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  )
}
