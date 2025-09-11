import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchProducts, fetchSaleProducts, fetchBestSellers } from '@/store/productsSlice'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Individual Section Components
import { CategoryCards } from '@/components/CategoryCards'
import { SaleBestSellersSection } from '@/components/SaleBestSellersSection'
import { HeroCarousel } from '@/components/HeroCarousel'
import { FeaturedCollection } from '@/components/FeaturedCollection'
import { ImageCollage } from '@/components/ImageCollage'
import { WhyChooseKickSpot } from '@/components/WhyChooseKickSpot'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { items, saleProducts, bestSellers, loading, error } = useAppSelector(s => s.products)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    // Fetch all product data
    dispatch(fetchProducts())
    dispatch(fetchSaleProducts())
    dispatch(fetchBestSellers())
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

    // Temporary: Show sample data if no products loaded
    if (products.length === 0) {
      let sampleProducts = []
      
      if (category === 'sale') {
        sampleProducts = [
          { id: 1, name: 'Nike Air Max 270', price: 120, originalPrice: 150, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 25, discount: 20, isOnSale: true },
          { id: 2, name: 'Adidas Ultraboost 22', price: 144, originalPrice: 180, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', buyCount: 18, discount: 20, isOnSale: true },
          { id: 3, name: 'Nike Air Force 1', price: 72, originalPrice: 90, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 32, discount: 20, isOnSale: true },
          { id: 4, name: 'Converse Chuck Taylor', price: 52, originalPrice: 65, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop', buyCount: 15, discount: 20, isOnSale: true },
          { id: 5, name: 'Nike Air Jordan 1', price: 96, originalPrice: 120, image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=1000&fit=crop', buyCount: 8, discount: 20, isOnSale: true },
          { id: 6, name: 'Adidas Stan Smith', price: 64, originalPrice: 80, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop', buyCount: 12, discount: 20, isOnSale: true },
          { id: 7, name: 'Nike React Element 55', price: 104, originalPrice: 130, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 20, discount: 20, isOnSale: true },
          { id: 8, name: 'Puma Suede Classic', price: 60, originalPrice: 75, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 28, discount: 20, isOnSale: true }
        ]
      } else if (category === 'bestsellers') {
        sampleProducts = [
          { id: 9, name: 'Nike Air Max 270', price: 150, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 25 },
          { id: 10, name: 'Adidas Ultraboost 22', price: 180, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', buyCount: 18 },
          { id: 11, name: 'Nike Air Force 1', price: 90, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 32 },
          { id: 12, name: 'Converse Chuck Taylor', price: 65, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop', buyCount: 15 },
          { id: 13, name: 'Nike Air Jordan 1', price: 120, image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=1000&fit=crop', buyCount: 8 },
          { id: 14, name: 'Adidas Stan Smith', price: 80, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop', buyCount: 12 },
          { id: 15, name: 'Nike React Element 55', price: 130, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 20 },
          { id: 16, name: 'Puma Suede Classic', price: 75, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 28 }
        ]
      } else {
        // Default sample data for other categories
        sampleProducts = [
          { id: 1, name: 'Nike Air Max 270', price: 150, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 25 },
          { id: 2, name: 'Adidas Ultraboost 22', price: 180, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', buyCount: 18 },
          { id: 3, name: 'Nike Air Force 1', price: 90, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 32 },
          { id: 4, name: 'Converse Chuck Taylor', price: 65, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop', buyCount: 15 },
          { id: 5, name: 'Nike Air Jordan 1', price: 120, image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=1000&fit=crop', buyCount: 8 },
          { id: 6, name: 'Adidas Stan Smith', price: 80, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop', buyCount: 12 },
          { id: 7, name: 'Nike React Element 55', price: 130, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 20 },
          { id: 8, name: 'Puma Suede Classic', price: 75, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 28 }
        ]
      }
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
              {sampleProducts.map(product => (
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
      <CategoryCards />

      {/* Sale & Best Sellers Section */}
      <SaleBestSellersSection />
      
      {/* Hero Carousel Section */}
      <HeroCarousel />
      
      {/* Featured Collection Section */}
      <FeaturedCollection />
      
      {/* Image Collage Section */}
      <ImageCollage />
      
      {/* Why Choose KickSpot Section */}
      <WhyChooseKickSpot />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
