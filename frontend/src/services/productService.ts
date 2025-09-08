import api from './api';
import { Product, ProductsResponse, ApiResponse } from '../types';

interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const productService = {
  // Get all products with optional filters
  getAllProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: number): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<ProductsResponse> => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },

  // Create new product (admin only)
  createProduct: async (productData: Partial<Product>): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (id: number, productData: Partial<Product>): Promise<ApiResponse<{ product: Product }>> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get user's products
  getUserProducts: async (): Promise<ProductsResponse> => {
    const response = await api.get('/products/user/my-products');
    return response.data;
  },
};