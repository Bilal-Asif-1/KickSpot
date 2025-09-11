import React, { useEffect, useRef } from 'react'
import { Spotlight } from './ui/spotlight'

export function WhyChooseKickSpot() {
  const sectionRef = useRef(null)
  const spotlightRef = useRef(null)

  useEffect(() => {
    const sectionEl = sectionRef.current
    const spotlightEl = spotlightRef.current
    if (!sectionEl || !spotlightEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            spotlightEl.classList.add('animate-spotlight')
          } else {
            spotlightEl.classList.remove('animate-spotlight')
          }
        })
      },
      {
        threshold: 0.25,
        root: null,
        rootMargin: '0px 0px -10% 0px'
      }
    )

    observer.observe(sectionEl)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative pt-24 pb-32 bg-black flex items-center justify-center overflow-hidden z-10">
      <Spotlight 
        ref={spotlightRef}
        className="-top-40 left-0 md:left-60 md:-top-20 opacity-0" 
        fill="white" 
      />
      {/* Subtle top gradient to create a floating feel under Featured without overlap */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent" />
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-12 text-center pt-8">
          WHY CHOOSE KICKSPOT?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="bg-black border-2 border-gray-400 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-200 mb-6">Curated Excellence</h3>
            <p className="text-gray-300 text-lg leading-relaxed">Authentic footwear from premium brands, meticulously selected for quality, style, and durability</p>
          </div>
          <div className="bg-black border-2 border-gray-400 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-200 mb-6">Express Shipping</h3>
            <p className="text-gray-300 text-lg leading-relaxed">Worldwide delivery with tracking and insurance, ensuring your order arrives safely and on time</p>
          </div>
          <div className="bg-black border-2 border-gray-400 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-200 mb-6">Trusted Community</h3>
            <p className="text-gray-300 text-lg leading-relaxed">Over 50,000 satisfied customers worldwide, with 98% satisfaction rate and dedicated customer support</p>
          </div>
        </div>
      </div>
    </section>
  )
}
