import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Product } from '@/store/productsSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { addToCart } from '@/store/cartSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector(state => state.auth)

  const handleAddToCart = () => {
    if (!user) {
      // Redirect to login with return path
      navigate('/login', { state: { from: { pathname: '/' } } })
      return
    }
    if (user.role === 'admin') {
      // Admins cannot buy products
      return
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      category: product.category
    }
    
    dispatch(addToCart(cartItem))
    toast.success(`${product.name} added to cart!`)
  }

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
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      category: product.category
    }
    
    dispatch(addToCart(cartItem))
    toast.success(`${product.name} added to cart!`)
    navigate('/checkout')
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="aspect-video w-full bg-muted rounded overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image_url}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{product.category}</p>
        <p className="mt-1 font-semibold">${product.price.toFixed(2)}</p>
        {product.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        {user?.role === 'admin' ? (
          <div className="w-full text-center text-sm text-muted-foreground">
            Admin View Only
          </div>
        ) : (
          <>
            <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
              {user ? 'Add to Cart' : 'Login to Buy'}
            </Button>
            <Button className="flex-1" onClick={handleBuyNow}>
              {user ? 'Buy Now' : 'Login to Buy'}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}


