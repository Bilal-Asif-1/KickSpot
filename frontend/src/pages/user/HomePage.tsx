import { useEffect } from 'react'
import { useAppDispatch } from '@/store'
import { fetchProducts, fetchSaleProducts, fetchBestSellers } from '@/store/productsSlice'

// Individual Section Components
import { CategoryCards } from '@/components/CategoryCards'
import { SaleBestSellersSection } from '@/components/SaleBestSellersSection'
import { HeroCarousel } from '@/components/HeroCarousel'
import { FeaturedCollection } from '@/components/FeaturedCollection'
import { ImageCollage } from '@/components/ImageCollage'
import { WhyChooseKickSpot } from '@/components/WhyChooseKickSpot'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Fetch all product data
    dispatch(fetchProducts())
    dispatch(fetchSaleProducts())
    dispatch(fetchBestSellers())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-black">
      {/* Category Cards Section */}
      <CategoryCards />

      {/* Sale & Best Sellers Section */}
      <SaleBestSellersSection />
      
      {/* Hero Carousel Section */}
      <HeroCarousel />
      
      {/* Featured Collection Section */}
      <FeaturedCollection />
      
      {/* Image Collage Section */}
      <ImageCollage />
      
      {/* Why Choose KickSpot Section */}
      <WhyChooseKickSpot />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}