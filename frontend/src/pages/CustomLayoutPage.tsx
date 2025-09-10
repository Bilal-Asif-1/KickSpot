import CustomNavbar from '@/components/CustomNavbar'
import CartDrawer from '@/components/CartDrawer'
import { useState } from 'react'

export default function CustomLayoutPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="relative">
      <CustomNavbar onCartOpen={() => setIsCartOpen(true)} />
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  )
}
