// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  category: string;
  brand?: string;
  stock: number;
  imageUrl?: string;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
  };
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

// Order Types
export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  productDescription?: string;
  productCategory: string;
  productBrand?: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  size?: string;
  color?: string;
  variant?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderNotes?: string;
  adminNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  items: OrderItem[];
  customer?: User;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ShippingFormData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
    size?: string;
    color?: string;
    variant?: string;
  }>;
  shippingDetails: ShippingFormData;
  paymentDetails?: {
    method: 'credit_card' | 'debit_card' | 'paypal' | 'cash_on_delivery';
  };
  orderNotes?: string;
}