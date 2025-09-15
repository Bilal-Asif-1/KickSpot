import { useRef } from 'react'
import { useAppSelector } from '@/store'
import { useNavigate } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
 

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

  // Carousel section component using Embla Carousel
  const CarouselSection = ({ title, products, showTagline = false, seeMoreHref }: { title: string, products: any[], showTagline?: boolean, seeMoreHref?: string }) => {
    const autoplayPlugin = useRef(
      Autoplay({ delay: 4000, stopOnInteraction: true })
    )

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">{title}</h3>
        </div>

        <div className="relative">
          <Carousel
            plugins={[autoplayPlugin.current]}
            opts={{ 
              align: 'start', 
              loop: true, 
              containScroll: 'trimSnaps',
              slidesToScroll: 1
            }}
            className="w-full"
            onMouseEnter={autoplayPlugin.current.stop}
            onMouseLeave={autoplayPlugin.current.reset}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="transform scale-90 sm:scale-100">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 sm:left-2 h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 bg-white/5 hover:bg-white/10 border-white/20 text-white/50 hover:text-white/80" />
            <CarouselNext className="right-1 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 bg-white/5 hover:bg-white/10 border-white/20 text-white/50 hover:text-white/80" />
          </Carousel>
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
            <CarouselSection 
              title="SALE" 
              products={saleProductsToShow}
              showTagline={true}
              seeMoreHref="/products?sale=1"
            />
          </div>
          
          {/* Best Sellers Section */}
          <div className="border border-white/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-md shadow-white/10">
            <CarouselSection 
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
