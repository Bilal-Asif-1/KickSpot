import { useAppSelector, useAppDispatch } from '@/store'
import { removeFromFavorites, clearFavorites } from '@/store/favoritesSlice'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { addToCart } from '@/store/cartSlice'

export default function WishlistPage() {
  const { items: favoriteItems } = useAppSelector(s => s.favorites)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleRemoveFromFavorites = (itemId: number) => {
    dispatch(removeFromFavorites(itemId))
    toast.success('Removed from favorites', {
      style: {
        background: '#dc2626',
        color: '#ffffff',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '12px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }
    })
  }

  const handleClearAllFavorites = () => {
    dispatch(clearFavorites())
    toast.success('All favorites cleared', {
      style: {
        background: '#000000',
        color: '#ffffff',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }
    })
  }

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
      category: item.category
    }))
    toast.success('Added to cart', {
      style: {
        background: '#16a34a',
        color: '#ffffff',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '12px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }
    })
  }

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return ''
    return imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imageUrl}`
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="text-black hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-black">My Wishlist</h1>
          </div>
          {favoriteItems.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearAllFavorites}
              className="border-black text-black hover:bg-black hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {favoriteItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Start adding products you love to your wishlist!</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-50 rounded-lg mb-4 overflow-hidden relative">
                  {item.image_url ? (
                    <img 
                      src={getImageUrl(item.image_url)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-gray-400">
                              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                  
                  {/* Remove from favorites button */}
                  <button
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-black text-lg line-clamp-2">{item.name}</h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-black">${item.price.toFixed(2)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {item.category && (
                    <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                  )}

                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full bg-black hover:bg-gray-800 text-white mt-4"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
