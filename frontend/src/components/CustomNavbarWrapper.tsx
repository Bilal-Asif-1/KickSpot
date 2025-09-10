import CustomNavbar from '@/components/CustomNavbar'
import CartDrawer from '@/components/CartDrawer'
import { useState } from 'react'

type CustomNavbarWrapperProps = {
  children: React.ReactNode
}

export default function CustomNavbarWrapper({ children }: CustomNavbarWrapperProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="relative">
      <CustomNavbar onCartOpen={() => setIsCartOpen(true)} />
      
      {/* Main Content */}
      <div>
        {children}
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  )
}
