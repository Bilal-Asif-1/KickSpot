import { useRef, useState } from 'react'
import { useAppSelector } from '@/store'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
 

export function SaleBestSellersSection() {
  const { saleProducts, bestSellers } = useAppSelector(s => s.products)
  const navigate = useNavigate()
  
  // Debug logging
  console.log('SaleBestSellersSection - saleProducts:', saleProducts)
  console.log('SaleBestSellersSection - bestSellers:', bestSellers)
  
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
  const SaleScrollSection = ({ title, products, showTagline = false, seeMoreHref }: { title: string, products: any[], showTagline?: boolean, seeMoreHref?: string }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [velocity, setVelocity] = useState(0)
    const [lastTime, setLastTime] = useState(0)
    const [lastScrollLeft, setLastScrollLeft] = useState(0)

    const scrollByAmount = (amount: number) => {
      if (!scrollContainerRef.current) return
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' })
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
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">{title}</h3>
        </div>

        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
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
                  width: 'calc(50% - 4px)',
                  scrollSnapAlign: 'start'
                }}
              >
                <div className="transform scale-90 sm:scale-100">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>

          {/* Faint overlay arrows */}
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByAmount(-(scrollContainerRef.current?.clientWidth || 0) / 2)}
            className="absolute left-0.5 sm:left-1 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white/80 backdrop-blur-sm"
          >
            <svg width="10" height="10" className="sm:w-[14px] sm:h-[14px] md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByAmount((scrollContainerRef.current?.clientWidth || 0) / 2)}
            className="absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white/80 backdrop-blur-sm"
          >
            <svg width="10" height="10" className="sm:w-[14px] sm:h-[14px] md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Footer row: tagline left (SALE only), see more right */}
        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          {showTagline ? (
            <div className="relative overflow-hidden h-4 sm:h-5 flex-1 mr-2 sm:mr-3">
              <div className="absolute whitespace-nowrap text-[10px] sm:text-[11px] tracking-wide text-white/70" style={{ animation: 'ks-marquee 12s linear infinite' }}>
                Sale ends in 3 days · New markdowns added · Limited stock · Don't miss out · 
              </div>
            </div>
          ) : (<div className="flex-1" />)}

          {seeMoreHref && (
            <button 
              onClick={() => navigate(seeMoreHref)} 
              className="text-xs sm:text-sm text-white/70 hover:text-white cursor-pointer"
            >
              See more
            </button>
          )}
        </div>
        <style>{`@keyframes ks-marquee { 0% { transform: translateX(0%);} 100% { transform: translateX(-50%);} }`}</style>
      </div>
    )
  }

  return (
    <section className="pt-2 pb-2 sm:pt-4 sm:pb-4 md:pt-8 md:pb-0 px-2 sm:px-4">
      <div className="max-w-9xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* SALE Section */}
          <div className="border border-white/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-md shadow-white/10">
            <SaleScrollSection 
              title="SALE" 
              products={saleProductsToShow}
              showTagline={true}
              seeMoreHref="/products?sale=1"
            />
          </div>
          
          {/* Best Sellers Section */}
          <div className="border border-white/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-md shadow-white/10">
            <SaleScrollSection 
              title="Best Sellers" 
              products={bestSellersToShow}
              seeMoreHref="/products?sort=best"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
