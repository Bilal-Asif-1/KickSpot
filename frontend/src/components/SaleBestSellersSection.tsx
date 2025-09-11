import { useRef, useState, useEffect } from 'react'
import { useAppSelector } from '@/store'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function SaleBestSellersSection() {
  const { saleProducts, bestSellers } = useAppSelector(s => s.products)
  
  // Sample data for both categories
  const sampleSaleProducts = [
    { id: 1, name: 'Nike Air Max 270', price: 120, originalPrice: 150, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 25, discount: 20, isOnSale: true },
    { id: 2, name: 'Adidas Ultraboost 22', price: 144, originalPrice: 180, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', buyCount: 18, discount: 20, isOnSale: true },
    { id: 3, name: 'Nike Air Force 1', price: 72, originalPrice: 90, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 32, discount: 20, isOnSale: true },
    { id: 4, name: 'Converse Chuck Taylor', price: 52, originalPrice: 65, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop', buyCount: 15, discount: 20, isOnSale: true },
    { id: 5, name: 'Nike Air Jordan 1', price: 96, originalPrice: 120, image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=1000&fit=crop', buyCount: 8, discount: 20, isOnSale: true },
    { id: 6, name: 'Adidas Stan Smith', price: 64, originalPrice: 80, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop', buyCount: 12, discount: 20, isOnSale: true },
    { id: 7, name: 'Puma Suede Classic', price: 60, originalPrice: 75, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 28, discount: 20, isOnSale: true },
    { id: 8, name: 'Nike React Element 55', price: 104, originalPrice: 130, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 20, discount: 20, isOnSale: true },
    { id: 9, name: 'Vans Old Skool', price: 56, originalPrice: 70, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 22, discount: 20, isOnSale: true },
    { id: 10, name: 'New Balance 990v5', price: 160, originalPrice: 200, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 14, discount: 20, isOnSale: true },
  ]

  const sampleBestSellers = [
    { id: 11, name: 'Nike Air Max 270', price: 150, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 25 },
    { id: 12, name: 'Adidas Ultraboost 22', price: 180, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', buyCount: 18 },
    { id: 13, name: 'Nike Air Force 1', price: 90, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 32 },
    { id: 14, name: 'Converse Chuck Taylor', price: 65, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop', buyCount: 15 },
    { id: 15, name: 'Nike Air Jordan 1', price: 120, image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=1000&fit=crop', buyCount: 8 },
    { id: 16, name: 'Adidas Stan Smith', price: 80, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop', buyCount: 12 },
    { id: 17, name: 'Puma Suede Classic', price: 75, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 28 },
    { id: 18, name: 'Nike React Element 55', price: 130, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 20 },
    { id: 19, name: 'Vans Old Skool', price: 70, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 22 },
    { id: 20, name: 'New Balance 990v5', price: 200, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 14 },
    { id: 21, name: 'Jordan Retro 4', price: 190, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 16 },
    { id: 22, name: 'Adidas Yeezy Boost 350', price: 220, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop', buyCount: 9 },
  ]

  const saleProductsToShow = saleProducts.length > 0 ? saleProducts : sampleSaleProducts
  const bestSellersToShow = bestSellers.length > 0 ? bestSellers : sampleBestSellers

  // Scroll functionality for both sections
  const SaleScrollSection = ({ title, products, category }: { title: string, products: any[], category: string }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [velocity, setVelocity] = useState(0)
    const [lastTime, setLastTime] = useState(0)
    const [lastScrollLeft, setLastScrollLeft] = useState(0)

    const scrollLeftAction = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        container.scrollBy({ left: -container.clientWidth / 2, behavior: 'smooth' })
      }
    }

    const scrollRightAction = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        container.scrollBy({ left: container.clientWidth / 2, behavior: 'smooth' })
      }
    }

    const handleStart = (clientX: number) => {
      setIsDragging(true)
      setStartX(clientX)
      setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
      setVelocity(0)
      setLastTime(Date.now())
      setLastScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
    }

    const handleMove = (clientX: number) => {
      if (!isDragging || !scrollContainerRef.current) return
      
      const x = clientX
      const walk = (x - startX) * 2
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
      
      const now = Date.now()
      const timeDiff = now - lastTime
      if (timeDiff > 0) {
        const scrollDiff = scrollContainerRef.current.scrollLeft - lastScrollLeft
        setVelocity(scrollDiff / timeDiff)
        setLastTime(now)
        setLastScrollLeft(scrollContainerRef.current.scrollLeft)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
      if (Math.abs(velocity) < 0.1) {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current
          const cardWidth = container.clientWidth / 2
          const currentScroll = container.scrollLeft
          const targetScroll = Math.round(currentScroll / cardWidth) * cardWidth
          container.scrollTo({ left: targetScroll, behavior: 'smooth' })
        }
      }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      handleStart(e.clientX)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      e.preventDefault()
      handleMove(e.clientX)
    }

    const handleMouseUp = (e: React.MouseEvent) => {
      e.preventDefault()
      handleEnd()
    }

    const handleMouseLeave = () => {
      handleEnd()
    }

    const handleTouchStart = (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      handleEnd()
    }

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
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
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {products.map(product => (
            <div 
              key={product.id} 
              className="flex-shrink-0" 
              style={{ 
                width: 'calc(50% - 8px)',
                scrollSnapAlign: 'start'
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
      </div>
    )
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-9xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SALE Section */}
          <SaleScrollSection 
            title="SALE" 
            products={saleProductsToShow} 
            category="sale" 
          />
          
          {/* Best Sellers Section */}
          <SaleScrollSection 
            title="Best Sellers" 
            products={bestSellersToShow} 
            category="bestsellers" 
          />
        </div>
      </div>
    </section>
  )
}
