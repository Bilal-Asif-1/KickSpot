import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchMenProducts } from '@/store/productsSlice'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

export default function MensPage() {
  const dispatch = useAppDispatch()
  const { menProducts, menPages } = useAppSelector(s => s.products as any)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  // Note: Do not reset page on menProducts changes; it would prevent pagination from advancing

  useEffect(() => {
    dispatch(fetchMenProducts({ page, limit: ITEMS_PER_PAGE }))
  }, [dispatch, page])

  const ProductSlider = ({ title, products }: { title: string, products: any[] }) => {
    const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }))

    // Temporary: Show sample data if no products loaded
    if (products.length === 0) {
      let sampleProducts = []
      
      if (category === 'men') {
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
          </div>
          <Carousel plugins={[plugin.current]} opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
            <CarouselContent className="-ml-2">
            {products.map(product => (
                <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2">
                <ProductCard product={product} />
                </CarouselItem>
            ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Best Sellers (Men) */}
      <ProductSlider 
        title="Best Sellers" 
        products={[...menProducts].sort((a: any, b: any) => (b.buyCount || 0) - (a.buyCount || 0)).slice(0, 10)} 
        category="bestsellers" 
      />

      {/* Men's Collection - Grid with pagination */}
      <section className="pt-0 pb-12 px-4">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Men's Collection</h2>
          </div>

          {(() => {
            const computedTotalPages = (menPages as number) || Math.max(1, Math.ceil((menProducts?.length || 0) / ITEMS_PER_PAGE))
            const currentPage = Math.min(page, computedTotalPages)
            const pageItems = menProducts || []

            return (
              <>
                <div className="mb-2 text-sm text-white/60">Page {currentPage} of {computedTotalPages}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pageItems.map((product: any) => (
                    <div key={product.id} className="flex-shrink-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <nav className="mt-8 flex justify-center" aria-label="pagination">
                  <ul className="flex items-center gap-2">
                    <li>
                      <button
                        type="button"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="h-9 px-3 rounded-md border border-white/20 text-white/80 hover:bg-white/10 disabled:opacity-40"
                      >
                        Prev
                      </button>
                    </li>
                    {Array.from({ length: computedTotalPages }).map((_, idx) => {
                      const pageNum = idx + 1
                      const isActive = pageNum === currentPage
                      return (
                        <li key={pageNum}>
                          <button
                            type="button"
                            onClick={() => setPage(pageNum)}
                            className={`${isActive ? 'bg-white text-black' : 'border border-white/20 text-white/80 hover:bg-white/10'} h-9 w-9 rounded-md`}
                          >
                            {pageNum}
                          </button>
                        </li>
                      )
                    })}
                    <li>
                      <button
                        type="button"
                        onClick={() => setPage(p => Math.min(computedTotalPages, p + 1))}
                        disabled={currentPage === computedTotalPages}
                        className="h-9 px-3 rounded-md border border-white/20 text-white/80 hover:bg-white/10 disabled:opacity-40"
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
            )
          })()}
        </div>
      </section>
    </div>
  )
}

