import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchProducts } from '@/store/productsSlice'
import ProductCard from '@/components/ProductCard'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector(s => s.products)
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // React to query param changes (e.g., clicking Men/Women/Kids in navbar)
  useEffect(() => {
    const q = searchParams.get('category') || 'All'
    setSelectedCategory(q)
  }, [searchParams])

  const categories = ['All', 'Men', 'Women', 'Kids']
  const filteredProducts = selectedCategory === 'All' 
    ? items 
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
      <main className="mx-auto max-w-7xl p-4">
        <h1 className="text-2xl font-semibold mb-4">
          {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Shoes`}
        </h1>
        
        {/* Category Filter */}
        <div className="flex gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
