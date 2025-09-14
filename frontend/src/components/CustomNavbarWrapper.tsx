import CustomNavbar from '@/components/CustomNavbar'
import CartDrawer from '@/components/CartDrawer'
import NotificationDrawer from '@/components/NotificationDrawer'
import { useState } from 'react'
import { useAppDispatch } from '@/store'
import { setUnreadCount } from '@/store/notificationSlice'

type CustomNavbarWrapperProps = {
  children: React.ReactNode
}

export default function CustomNavbarWrapper({ children }: CustomNavbarWrapperProps) {
  const dispatch = useAppDispatch()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const handleUnreadCountChange = (newCount: number) => {
    dispatch(setUnreadCount(newCount))
  }

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
        onUnreadCountChange={handleUnreadCountChange}
      />
    </div>
  )
}
