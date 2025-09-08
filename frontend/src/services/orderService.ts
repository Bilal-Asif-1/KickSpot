import api from './api';
import { Order, CreateOrderRequest, ApiResponse } from '../types';

export const orderService = {
  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getUserOrders: async (page = 1, limit = 10): Promise<ApiResponse<{ orders: Order[] }>> => {
    const response = await api.get(`/orders/my-orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: number): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Admin: Get all orders
  getAllOrders: async (filters: any = {}): Promise<ApiResponse<{ orders: Order[] }>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/orders/admin/all?${params.toString()}`);
    return response.data;
  },

  // Admin: Update order status
  updateOrderStatus: async (id: number, statusData: any): Promise<ApiResponse<{ order: Order }>> => {
    const response = await api.put(`/orders/admin/${id}/status`, statusData);
    return response.data;
  },

  // Admin: Get order statistics
  getOrderStats: async (): Promise<ApiResponse<{ stats: any }>> => {
    const response = await api.get('/orders/admin/stats');
    return response.data;
  },
};