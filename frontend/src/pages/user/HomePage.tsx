import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchProducts } from '@/store/productsSlice'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CarouselPlugin } from '@/components/CarouselPlugin'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector(s => s.products)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentBanner, setCurrentBanner] = useState(0)
  const [bestSellers, setBestSellers] = useState([])
  const [menProducts, setMenProducts] = useState([])
  const [womenProducts, setWomenProducts] = useState([])
  const [kidsProducts, setKidsProducts] = useState([])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Filter products by category and sort best sellers
  useEffect(() => {
    if (items.length > 0) {
      // Best Sellers: Sort by buyCount (highest first)
      const sortedByBuyCount = [...items]
        .sort((a, b) => (b.buyCount || 0) - (a.buyCount || 0))
        .slice(0, 8) // Top 8 best sellers
      setBestSellers(sortedByBuyCount)

      // Category products
      setMenProducts(items.filter(p => p.category === 'Men').slice(0, 8))
      setWomenProducts(items.filter(p => p.category === 'Women').slice(0, 8))
      setKidsProducts(items.filter(p => p.category === 'Kids').slice(0, 8))
    }
  }, [items])

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

  // Horizontal Product Slider Component with Momentum Scrolling
  const ProductSlider = ({ title, products, category }: { title: string, products: any[], category: string }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [velocity, setVelocity] = useState(0)
    const [lastTime, setLastTime] = useState(0)
    const [lastScrollLeft, setLastScrollLeft] = useState(0)
    const animationRef = useRef<number>()

    const scrollLeftAction = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const cardWidth = container.clientWidth / 4 // Account for 4 cards visible
        container.scrollBy({ left: -cardWidth, behavior: 'smooth' })
      }
    }

    const scrollRightAction = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const cardWidth = container.clientWidth / 4 // Account for 4 cards visible
        container.scrollBy({ left: cardWidth, behavior: 'smooth' })
      }
    }

    // Simplified momentum scrolling (CSS scroll-snap handles snapping)
    const animateScroll = () => {
      if (scrollContainerRef.current && Math.abs(velocity) > 0.1) {
        const container = scrollContainerRef.current
        const newScrollLeft = container.scrollLeft + velocity
        container.scrollLeft = newScrollLeft
        
        // Apply friction
        setVelocity(prev => prev * 0.95)
        
        animationRef.current = requestAnimationFrame(animateScroll)
      } else {
        setVelocity(0)
      }
    }

    // Mouse/Touch event handlers
    const handleStart = (clientX: number) => {
      if (scrollContainerRef.current) {
        setIsDragging(true)
        setStartX(clientX)
        setScrollLeft(scrollContainerRef.current.scrollLeft)
        setVelocity(0)
        setLastTime(Date.now())
        setLastScrollLeft(scrollContainerRef.current.scrollLeft)
        
        // Cancel any ongoing momentum animation
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }

    const handleMove = (clientX: number) => {
      if (!isDragging || !scrollContainerRef.current) return
      
      const container = scrollContainerRef.current
      const x = clientX
      const walk = (startX - x) * 1.2 // Reduced scroll speed multiplier
      container.scrollLeft = scrollLeft + walk
      
      // Calculate velocity for momentum
      const now = Date.now()
      const timeDiff = now - lastTime
      if (timeDiff > 0) {
        const scrollDiff = container.scrollLeft - lastScrollLeft
        setVelocity(scrollDiff / timeDiff)
        setLastTime(now)
        setLastScrollLeft(container.scrollLeft)
      }
    }

    const handleEnd = () => {
      if (!isDragging) return
      
      setIsDragging(false)
      
      // Start momentum animation if velocity is significant
      if (Math.abs(velocity) > 0.5) {
        animateScroll()
      }
      // CSS scroll-snap will handle snapping automatically
    }

    // Snap to center functionality
    const snapToCenter = () => {
      if (!scrollContainerRef.current) return
      
      const container = scrollContainerRef.current
      const containerWidth = container.clientWidth
      const cardWidth = containerWidth / 4
      const scrollLeft = container.scrollLeft
      
      // Calculate which card should be centered
      const cardIndex = Math.round(scrollLeft / cardWidth)
      const targetScrollLeft = cardIndex * cardWidth
      
      // Smooth scroll to center the card
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      })
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      handleStart(e.clientX)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      handleMove(e.clientX)
    }

    const handleMouseUp = () => {
      handleEnd()
    }

    const handleTouchStart = (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      e.preventDefault()
      handleMove(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      handleEnd()
    }

    // Cleanup animation on unmount
    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [])

    if (products.length === 0) return null

    return (
      <section className="py-12 px-4">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={scrollLeftAction}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={scrollRightAction}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory',
              scrollPaddingLeft: '0px'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={isDragging ? handleMouseMove : undefined}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {products.map(product => (
              <div 
                key={product.id} 
                className="flex-shrink-0" 
                style={{ 
                  width: 'calc(25% - 12px)',
                  scrollSnapAlign: 'start'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Category Cards Section */}
      <section className="pt-4 pb-12 px-4">
        <div className="max-w-9xl mx-auto">
          <div className="grid grid-cols-4 gap-4">
            {/* Best Sellers Card */}
            <div className="group relative aspect-[0.77] overflow-hidden rounded-[20px] cursor-pointer">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop" 
                  alt="Best Sellers" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
                <h2 className="text-white text-2xl md:text-3xl font-semibold px-6 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm">
                  Best Sellers
                </h2>
                <div className="flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-base font-medium hover:bg-white/30 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            {/* Men Card */}
            <div className="group relative aspect-[0.77] overflow-hidden rounded-[20px] cursor-pointer">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop" 
                  alt="Men" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
                <h2 className="text-white text-2xl md:text-3xl font-semibold px-6 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm">
                  Men
                </h2>
                <div className="flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-base font-medium hover:bg-white/30 transition-colors">
                    Shop Men
                  </button>
                </div>
              </div>
            </div>

            {/* Women Card */}
            <div className="group relative aspect-[0.77] overflow-hidden rounded-[20px] cursor-pointer">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop" 
                  alt="Women" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
                <h2 className="text-white text-2xl md:text-3xl font-semibold px-6 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm">
                  Women
                </h2>
                <div className="flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-base font-medium hover:bg-white/30 transition-colors">
                    Shop Women
                  </button>
                </div>
              </div>
            </div>

            {/* Kids Card */}
            <div className="group relative aspect-[0.77] overflow-hidden rounded-[20px] cursor-pointer">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop" 
                  alt="Kids" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
                <h2 className="text-white text-2xl md:text-3xl font-semibold px-6 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm">
                  Kids
                </h2>
                <div className="flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-base font-medium hover:bg-white/30 transition-colors">
                    Shop Kids
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Sliders */}
      <ProductSlider title="Best Sellers" products={bestSellers} category="bestsellers" />
      <ProductSlider title="Men's Collection" products={menProducts} category="men" />
      <ProductSlider title="Women's Collection" products={womenProducts} category="women" />
      <ProductSlider title="Kids Collection" products={kidsProducts} category="kids" />

        {/* Hero Carousel (shadcn/ui + embla) */}
      <section className="flex justify-center">
        <CarouselPlugin />
      </section>

      <main className="mx-auto max-w-7xl p-4">
        {/* Categories Section */}
        <section className="my-12">
          <h2 className="mb-6 text-3xl font-bold text-center text-white">Shop by Category</h2>
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
            <h2 className="text-3xl font-bold text-white">
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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-2 text-gray-300">Loading products...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">
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
