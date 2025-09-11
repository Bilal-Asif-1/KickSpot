import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Product } from '@/store/productsSlice'
import { useAppSelector } from '@/store'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const { user } = useAppSelector(state => state.auth)

  // Inline add-to-cart handled via Buy Now in this card layout

  const handleBuyNow = () => {
    if (!user) {
      // Redirect to login with return path
      navigate('/login', { state: { from: { pathname: '/' } } })
      return
    }
    if (user.role === 'admin') {
      // Admins cannot buy products
      return
    }
    
    // Just navigate to product detail page without adding to cart
    navigate(`/products/${product.id}`, { replace: false })
  }

  return (
    <Card className="relative w-full aspect-[0.77] overflow-hidden bg-white rounded-2xl shadow-lg border-15 border-black">
      {/* Sale Badge */}
      {product.isOnSale && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
          {product.discount}% OFF
        </div>
      )}
      
      {/* Full Screen Image */}
      <div className="absolute inset-0">
        {product.image_url ? (
          <img 
            src={product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
      </div>
      
      {/* Bottom Overlay with Buy Now and Price */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 md:p-4">
        <div className="flex items-center justify-between">
          {/* Buy Now Button - Bottom Left */}
          <Button 
            onClick={handleBuyNow}
            className="bg-white text-black hover:bg-gray-100 font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm md:text-base"
          >
            {user ? 'Buy Now' : 'Login to Buy'}
          </Button>
          
          {/* Price - Bottom Right */}
          <div className="text-right">
            {product.isOnSale && product.originalPrice ? (
              <div>
                <div className="text-white font-bold text-base md:text-lg">
                  ${product.price.toFixed(2)}
                </div>
                <div className="text-gray-300 line-through text-sm">
                  ${product.originalPrice.toFixed(2)}
                </div>
              </div>
            ) : (
              <div className="text-white font-bold text-base md:text-lg">
                ${product.price.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}


