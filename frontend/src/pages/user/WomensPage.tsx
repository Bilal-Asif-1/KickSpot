import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchWomenProducts } from '@/store/productsSlice'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function WomensPage() {
  const dispatch = useAppDispatch()
  const { womenProducts, loading, error } = useAppSelector(s => s.products)

  useEffect(() => {
    dispatch(fetchWomenProducts())
  }, [dispatch])

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
        container.scrollBy({ left: -container.clientWidth / 4, behavior: 'smooth' })
      }
    }

    const scrollRightAction = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        container.scrollBy({ left: container.clientWidth / 4, behavior: 'smooth' })
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
        // Snap to center when velocity is low
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current
          const cardWidth = container.clientWidth / 4
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

    // Temporary: Show sample data if no products loaded
    if (products.length === 0) {
      let sampleProducts = []
      
      if (category === 'women') {
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
      }

      return (
        <section className="pt-0 pb-12 px-4">
          <div className="max-w-9xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">{title}</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={scrollLeftAction} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={scrollRightAction} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {sampleProducts.map(product => (
                <div key={product.id} className="flex-shrink-0" style={{ width: 'calc(25% - 12px)', scrollSnapAlign: 'start' }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="pt-0 pb-12 px-4">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={scrollLeftAction} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={scrollRightAction} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {products.map(product => (
              <div key={product.id} className="flex-shrink-0" style={{ width: 'calc(25% - 12px)', scrollSnapAlign: 'start' }}>
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
      {/* Best Sellers (Women) */}
      <ProductSlider 
        title="Best Sellers" 
        products={[...womenProducts].sort((a: any, b: any) => (b.buyCount || 0) - (a.buyCount || 0)).slice(0, 10)} 
        category="bestsellers" 
      />

      {/* Women's Collection */}
      <ProductSlider title="Women's Collection" products={womenProducts} category="women" />
    </div>
  )
}

