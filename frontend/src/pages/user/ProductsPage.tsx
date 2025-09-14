import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchProducts, fetchSaleProducts } from '@/store/productsSlice'
import ProductCard from '@/components/ProductCard'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const { items, saleProducts, loading, error } = useAppSelector(s => s.products)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchSaleProducts())
  }, [dispatch])

  // React to query param changes (e.g., clicking Men/Women/Kids in navbar)
  useEffect(() => {
    const q = searchParams.get('category') || 'All'
    setSelectedCategory(q)
  }, [searchParams])

  const categories = ['All', 'Men', 'Women', 'Kids', 'Sales']
  const filteredProducts = selectedCategory === 'All' 
    ? items 
    : selectedCategory === 'Sales'
    ? saleProducts
    : items.filter(p => p.category === selectedCategory)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  return (
    <div>
      <main className="mx-auto max-w-7xl p-2 sm:p-4 lg:p-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 px-2 sm:px-0">
          {selectedCategory === 'All' ? 'All Products' : 
           selectedCategory === 'Sales' ? 'Sale Products' : 
           `${selectedCategory} Shoes`}
        </h1>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 px-2 sm:px-0">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(category)}
              className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {loading && <p className="text-center py-8 text-gray-500">Loading...</p>}
        {error && <p className="text-red-600 text-center py-4">{error}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {filteredProducts.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-8">
            No products found in this category.
          </p>
        )}
      </main>
    </div>
  )
}
