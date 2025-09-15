"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { useAppSelector } from '@/store'
import ProductCard from '@/components/ProductCard'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function SaleCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  const { saleProducts } = useAppSelector(s => s.products)

  // Sample sale products if no data loaded
  const sampleSaleProducts = [
    { id: 1, name: 'Nike Air Max 270', price: 120, originalPrice: 150, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop', buyCount: 25, discount: 20, isOnSale: true },
    { id: 2, name: 'Adidas Ultraboost 22', price: 144, originalPrice: 180, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', buyCount: 18, discount: 20, isOnSale: true },
    { id: 3, name: 'Nike Air Force 1', price: 72, originalPrice: 90, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop', buyCount: 32, discount: 20, isOnSale: true },
    { id: 4, name: 'Converse Chuck Taylor', price: 52, originalPrice: 65, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop', buyCount: 15, discount: 20, isOnSale: true },
    { id: 5, name: 'Nike Air Jordan 1', price: 96, originalPrice: 120, image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=1000&fit=crop', buyCount: 8, discount: 20, isOnSale: true },
    { id: 6, name: 'Adidas Stan Smith', price: 64, originalPrice: 80, image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1000&fit=crop', buyCount: 12, discount: 20, isOnSale: true },
  ]

  const productsToShow = saleProducts.length > 0 ? saleProducts : sampleSaleProducts

  return (
    <section className="py-12 px-4">
      <div className="max-w-9xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">SALE</h2>
        </div>
        
        <Carousel
          plugins={[plugin.current]}
          opts={{ 
            align: 'start', 
            loop: true, 
            containScroll: 'trimSnaps',
            slidesToScroll: 1
          }}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {productsToShow.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product as any} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 z-20 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="right-4 z-20 bg-white/10 border-white/20 text-white hover:bg-white/20" />
        </Carousel>
      </div>
    </section>
  )
}
