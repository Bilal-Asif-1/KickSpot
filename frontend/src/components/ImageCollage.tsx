import React from 'react'

export function ImageCollage() {
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=1000&fit=crop',
      alt: 'Nike Air Max 270',
      span: 'col-span-2 row-span-2'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop',
      alt: 'Adidas Ultraboost',
      span: 'col-span-2'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop',
      alt: 'Nike Air Force 1',
      span: 'row-span-2'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop',
      alt: 'Converse Chuck Taylor',
      span: ''
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=1000&fit=crop',
      alt: 'Jordan Retro',
      span: 'col-span-2'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=1000&fit=crop',
      alt: 'Vans Classic',
      span: ''
    }
  ]

  return (
    <section className="py-8 px-2">
      <div className="w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Collection</h2>
          <p className="text-gray-300 text-lg">Discover our curated selection of premium footwear</p>
        </div>
        
        {/* Allbirds-style Color Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 auto-rows-fr">
          {/* Large Hero Card - Top Left */}
          <div className="relative overflow-hidden rounded-2xl bg-transparent col-span-2 row-span-2 aspect-square">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="object-cover size-full"
              loading="eager"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-4 text-white bg-black/20">
              <p className="text-xs tracking-widest uppercase font-mono">Premium Collection</p>
              <p className="font-serif text-3xl md:text-[40px]">Colors of Expression</p>
              <div className="grid gap-2 grid-cols-2 my-4 md:my-5">
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Shop Men
                </button>
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Shop Women
                </button>
              </div>
            </div>
          </div>

          {/* Wide Card - Top Right */}
          <div className="relative overflow-hidden rounded-2xl bg-transparent col-span-2 aspect-[2/1]">
            <img
              src={images[1].src}
              alt={images[1].alt}
              className="object-cover size-full"
              loading="eager"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-3 text-white bg-black/20">
              <p className="text-sm md:text-base font-sans">KickSpot partnered with top brands to curate an exclusive collection that celebrates self-expression.</p>
            </div>
          </div>

          {/* Tall Card - Middle Right */}
          <div className="relative overflow-hidden rounded-2xl bg-transparent row-span-2 aspect-[1/2]">
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="object-cover size-full"
              loading="eager"
            />
          </div>

          {/* Small Square Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white aspect-square">
            <img
              src={images[3].src}
              alt={images[3].alt}
              className="object-cover size-full"
              loading="lazy"
            />
          </div>

          {/* Wide Bottom Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white col-span-2 aspect-[2/1]">
            <img
              src={images[4].src}
              alt={images[4].alt}
              className="object-cover size-full"
              loading="lazy"
            />
          </div>

          {/* Small Square Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white aspect-square">
            <img
              src={images[5].src}
              alt={images[5].alt}
              className="object-cover size-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}