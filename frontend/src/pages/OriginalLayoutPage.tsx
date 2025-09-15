import BuyerNavbar from '@/components/BuyerNavbar'
import CartDrawer from '@/components/CartDrawer'
import NotificationDrawer from '@/components/NotificationDrawer'
import { useState } from 'react'

type OriginalLayoutPageProps = {
  children: React.ReactNode
}

export default function OriginalLayoutPage({ children }: OriginalLayoutPageProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <div className="relative">
      <BuyerNavbar />
      
      {/* Main Content */}
      <div className="pt-16">
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
