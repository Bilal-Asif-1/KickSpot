import React from 'react'
import { useNavigate } from 'react-router-dom'

export function CategoryCards() {
  const navigate = useNavigate()

  const handleCategoryClick = (category: string) => {
    if (category === 'Best Sellers') {
      navigate('/products?sort=best')
    } else {
      navigate(`/${category.toLowerCase()}`)
    }
  }

  return (
    <section className="pt-4 pb-12 px-4">
      <div className="max-w-9xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          {/* Best Sellers Card */}
          <div 
            className="group relative aspect-[0.77] overflow-hidden rounded-[20px] cursor-pointer"
            onClick={() => handleCategoryClick('Best Sellers')}
          >
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop" 
                alt="Best Sellers" 
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-100 group-hover:rounded-[30%]"
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
          <div 
            className="group relative aspect-[0.77] overflow-hidden rounded-[20px] cursor-pointer"
            onClick={() => handleCategoryClick('Men')}
          >
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop" 
                alt="Men" 
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102 group-hover:rounded-[30%]"
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
          <div 
            className="group relative aspect-[0.77] overflow-hidden rounded-[20px] cursor-pointer"
            onClick={() => handleCategoryClick('Women')}
          >
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop" 
                alt="Women" 
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-100 group-hover:rounded-[30%]"
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
          <div 
            className="group relative aspect-[0.77] overflow-hidden rounded-[20px] cursor-pointer"
            onClick={() => handleCategoryClick('Kids')}
          >
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop" 
                alt="Kids" 
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-100 group-hover:rounded-[30%]"
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
  )
}

