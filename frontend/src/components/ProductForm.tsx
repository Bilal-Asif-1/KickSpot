import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { api } from '@/lib/api'
import type { Product } from '@/store/productsSlice'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(1),
  category: z.enum(['Men', 'Women', 'Kids']),
  price: z.number().min(0),
  stock: z.number().min(0),
  description: z.string().optional(),
  image_url: z.string().optional().or(z.literal('')),
})

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | undefined>()
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name || '',
      category: (product?.category as 'Men' | 'Women' | 'Kids') || 'Men',
      price: product?.price || 0,
      stock: product?.stock || 0,
      description: product?.description || '',
      image_url: product?.image_url || '',
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      setSubmitError(undefined)
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('category', values.category)
      formData.append('price', values.price.toString())
      formData.append('stock', values.stock.toString())
      if (values.description) formData.append('description', values.description)
      if (selectedFile) {
        formData.append('image', selectedFile)
      } else if (values.image_url) {
        formData.append('image_url', values.image_url)
      }

      if (product) {
        await api.put(`/api/v1/products/${product.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/api/v1/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      onSuccess()
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save product'
      setSubmitError(errorMessage)
      console.error('Failed to save product:', error)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="category" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Men">Men</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                    <SelectItem value="Kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="price" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($) *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="stock" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Description */}
          <FormField name="description" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Product description (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Image Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Image</h3>
            
            <FormItem>
              <FormLabel>Upload Image File</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </FormControl>
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                </div>
              )}
              <FormMessage />
            </FormItem>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            <FormField name="image_url" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Error Display */}
          {submitError && (
            <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded">
              {submitError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
