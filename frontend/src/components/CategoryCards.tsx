import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function CategoryCards() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleCategoryClick = (category: string) => {
    if (category === 'Best Sellers') {
      navigate('/products?sort=best')
    } else {
      navigate(`/${category.toLowerCase()}`)
    }
  }

  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.children[0]?.clientWidth || 0
      const gap = 12 // gap-3 = 12px
      const scrollAmount = cardWidth + gap
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scrollToPrev = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.children[0]?.clientWidth || 0
      const gap = 12 // gap-3 = 12px
      const scrollAmount = cardWidth + gap
      
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const categories = [
    {
      id: 'best-sellers',
      title: 'Best Sellers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop',
      buttonText: 'Shop Now'
    },
    {
      id: 'men',
      title: 'Men',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
      buttonText: 'Shop Men'
    },
    {
      id: 'women',
      title: 'Women',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop',
      buttonText: 'Shop Women'
    },
    {
      id: 'kids',
      title: 'Kids',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
      buttonText: 'Shop Kids'
    }
  ]

  return (
    <section className="pt-2 pb-4 sm:pt-4 sm:pb-8 md:pb-12 px-2 sm:px-4 lg:px-6">
      <div className="max-w-9xl mx-auto">
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category.title)}
            />
          ))}
        </div>

        {/* Mobile/Tablet Carousel Layout */}
        <div className="md:hidden relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className="flex-shrink-0 snap-center" 
                style={{ width: 'calc(80vw - 32px)' }}
              >
                <CategoryCard 
                  category={category}
                  onClick={() => handleCategoryClick(category.title)}
                />
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows - Hidden on small screens */}
          <button
            onClick={scrollToPrev}
            className="hidden sm:block absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={scrollToNext}
            className="hidden sm:block absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  )
}

// Category Card Component
function CategoryCard({ category, onClick }: { category: any, onClick: () => void }) {
  return (
    <div 
      className="group relative aspect-[0.77] overflow-hidden rounded-[12px] sm:rounded-[16px] md:rounded-[20px] cursor-pointer transition-all duration-500 group-hover:rounded-[24px] sm:group-hover:rounded-[32px] md:group-hover:rounded-[40px]"
      onClick={onClick}
    >
      <div className="absolute inset-0">
        <img 
          src={category.image} 
          alt={category.title} 
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4">
        <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm">
          {category.title}
        </h2>
        <div className="flex flex-col items-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs sm:text-sm md:text-base font-medium hover:bg-white/30 transition-colors">
            {category.buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

