import React from 'react'

export function FeaturedCollection() {
  return (
    <section className="pt-12 pb-8 px-4 relative z-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Featured Collection</h2>
        <p className="text-gray-300 text-lg">Discover our curated selection of premium footwear</p>
      </div>
      {/* Floating feel without overlap: subtle drop shadow below section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 [filter:blur(18px)] bg-gradient-to-b from-white/0 via-white/5 to-white/0 opacity-60" />
    </section>
  )
}

