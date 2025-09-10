import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchProducts } from '@/store/productsSlice'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CarouselPlugin } from '@/components/CarouselPlugin'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector(s => s.products)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const categories = ['All', 'Men', 'Women', 'Kids']
  const filteredProducts = selectedCategory === 'All' 
    ? items 
    : items.filter(p => p.category === selectedCategory)

  const banners = [
    {
      title: "New Collection 2024",
      subtitle: "Discover the latest trends in footwear",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=400&fit=crop",
      cta: "Shop Now"
    },
    {
      title: "Summer Sale",
      subtitle: "Up to 50% off on selected items",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=400&fit=crop",
      cta: "Get Deals"
    },
    {
      title: "Premium Quality",
      subtitle: "Crafted for comfort and style",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=400&fit=crop",
      cta: "Explore"
    }
  ]

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel (shadcn/ui + embla) */}
      <section className="py-8 flex justify-center">
        <CarouselPlugin />
      </section>

      <main className="mx-auto max-w-7xl p-4">
        {/* Categories Section */}
        <section className="my-12">
          <h2 className="mb-6 text-3xl font-bold text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map(category => (
              <Card 
                key={category} 
                className="cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
                onClick={() => setSelectedCategory(category)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 h-16 w-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {category.charAt(0)}
                  </div>
                  <h3 className="font-semibold">{category}</h3>
                  <p className="text-sm text-muted-foreground">
                    {items.filter(p => p.category === category).length} products
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Shoes`}
            </h2>
            
            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-muted-foreground">Loading products...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="my-12 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Perfect Pair?</h2>
              <p className="mb-6 text-lg opacity-90">
                Join thousands of satisfied customers who found their ideal shoes at KickSpot
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
