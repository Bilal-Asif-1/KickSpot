import { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchWomenProducts } from '@/store/productsSlice'
import ProductCard from '@/components/ProductCard'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

export default function WomensPage() {
  const dispatch = useAppDispatch()
  const { womenProducts, womenPages } = useAppSelector(s => s.products as any)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    dispatch(fetchWomenProducts({ page, limit: ITEMS_PER_PAGE }))
  }, [dispatch, page])


  const ProductSlider = ({ title, products }: { title: string, products: any[] }) => {
    const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: true }))

    // Show loading state if no products
    if (products.length === 0) {
      return (
        <section className="pt-0 pb-12 px-4">
          <div className="max-w-9xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">{title}</h2>
            </div>
            <div className="text-center text-white/60 py-8">
              Loading products...
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
      {/* Best Sellers (Women) */}
      <ProductSlider 
        title="Best Sellers" 
        products={[...womenProducts].sort((a: any, b: any) => (b.buyCount || 0) - (a.buyCount || 0)).slice(0, 10)} 
      />

      {/* Women's Collection - Grid with pagination */}
      <section className="pt-0 pb-12 px-4">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Women's Collection</h2>
          </div>

          {(() => {
            const computedTotalPages = (womenPages as number) || Math.max(1, Math.ceil((womenProducts?.length || 0) / ITEMS_PER_PAGE))
            const currentPage = Math.min(page, computedTotalPages)
            const pageItems = womenProducts || []

            return (
              <>
                <div className="mb-2 text-sm text-white/60">Page {currentPage} of {computedTotalPages}</div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

