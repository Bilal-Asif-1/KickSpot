/**
 * ========================================
 * APPLICATION CONSTANTS
 * ========================================
 * 
 * This file contains all application-wide constants including API endpoints,
 * configuration values, default settings, and other static data.
 * 
 * @author KickSpot Development Team
 * @version 1.0.0
 */

// ========================================
// API CONFIGURATION
// ========================================

/**
 * API base URL configuration
 * Points to the backend server endpoint
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * API endpoints configuration
 * All API endpoint paths used throughout the application
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    PROFILE: '/api/v1/auth/profile',
  },
  
  // Product endpoints
  PRODUCTS: {
    LIST: '/api/v1/products',
    CREATE: '/api/v1/products',
    UPDATE: '/api/v1/products',
    DELETE: '/api/v1/products',
    BY_ID: (id: number) => `/api/v1/products/${id}`,
    BY_CATEGORY: (category: string) => `/api/v1/products?category=${category}`,
    SEARCH: '/api/v1/products/search',
  },
  
  // Cart endpoints
  CART: {
    GET: '/api/v1/cart',
    ADD_ITEM: '/api/v1/cart/items',
    UPDATE_ITEM: '/api/v1/cart/items',
    REMOVE_ITEM: '/api/v1/cart/items',
    CLEAR: '/api/v1/cart/clear',
  },
  
  // Order endpoints
  ORDERS: {
    LIST: '/api/v1/orders',
    CREATE: '/api/v1/orders',
    BY_ID: (id: number) => `/api/v1/orders/${id}`,
    UPDATE_STATUS: (id: number) => `/api/v1/orders/${id}/status`,
  },
  
  // Notification endpoints
  NOTIFICATIONS: {
    LIST: '/api/v1/notifications',
    MARK_READ: '/api/v1/notifications/read',
    MARK_ALL_READ: '/api/v1/notifications/read-all',
    UNREAD_COUNT: '/api/v1/notifications/unread-count',
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/api/v1/admin/dashboard',
    PRODUCTS: '/api/v1/admin/products',
    ORDERS: '/api/v1/admin/orders',
    CUSTOMERS: '/api/v1/admin/customers',
    NOTIFICATIONS: '/api/v1/admin/notifications',
  },
  
  // Payment endpoints
  PAYMENT: {
    CREATE_INTENT: '/api/v1/payment/create-intent',
    CONFIRM: '/api/v1/payment/confirm',
  },
  
  // File upload endpoints
  UPLOAD: {
    PRODUCT_IMAGE: '/api/v1/upload/product-image',
    PROFILE_IMAGE: '/api/v1/upload/profile-image',
  },
} as const;

// ========================================
// APPLICATION CONFIGURATION
// ========================================

/**
 * Application configuration constants
 * Core settings for the application behavior
 */
export const APP_CONFIG = {
  /** Application name */
  NAME: 'KickSpot',
  
  /** Application version */
  VERSION: '1.0.0',
  
  /** Application description */
  DESCRIPTION: 'Premium Footwear E-commerce Platform',
  
  /** Default page size for pagination */
  DEFAULT_PAGE_SIZE: 12,
  
  /** Maximum page size for pagination */
  MAX_PAGE_SIZE: 100,
  
  /** Default timeout for API requests (in milliseconds) */
  API_TIMEOUT: 30000,
  
  /** Maximum file upload size (in bytes) */
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  /** Allowed image file types */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  
  /** Maximum number of images per product */
  MAX_PRODUCT_IMAGES: 5,
  
  /** Cart persistence key in localStorage */
  CART_STORAGE_KEY: 'kickspot_cart',
  
  /** Favorites persistence key in localStorage */
  FAVORITES_STORAGE_KEY: 'kickspot_favorites',
  
  /** Auth token storage key in localStorage */
  AUTH_TOKEN_KEY: 'kickspot_token',
  
  /** User data storage key in localStorage */
  USER_DATA_KEY: 'kickspot_user',
} as const;

// ========================================
// ROUTING CONSTANTS
// ========================================

/**
 * Application routes configuration
 * All route paths used in the application
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: number) => `/products/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Category routes
  MEN: '/men',
  WOMEN: '/women',
  KIDS: '/kids',
  
  // User routes (protected)
  CART: '/cart',
  CHECKOUT: '/checkout',
  THANK_YOU: '/thank-you',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  NOTIFICATIONS: '/notifications',
  HELP: '/help',
  PROFILE: '/profile',
  
  // Admin routes (protected)
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  
  // Layout routes
  CUSTOM_LAYOUT: '/custom',
  ORIGINAL_LAYOUT: '/original',
} as const;

// ========================================
// PRODUCT CONSTANTS
// ========================================

/**
 * Product-related constants
 * Default values and options for products
 */
export const PRODUCT_CONSTANTS = {
  /** Available product categories */
  CATEGORIES: ['Men', 'Women', 'Kids'] as const,
  
  /** Available product sizes */
  SIZES: {
    MEN: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'],
    WOMEN: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
    KIDS: ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7'],
  },
  
  /** Available product colors */
  COLORS: [
    'Black', 'White', 'Gray', 'Brown', 'Blue', 'Red', 'Green', 'Yellow', 
    'Orange', 'Purple', 'Pink', 'Navy', 'Beige', 'Tan', 'Maroon'
  ],
  
  /** Popular brands */
  BRANDS: [
    'Nike', 'Adidas', 'Jordan', 'Puma', 'Reebok', 'Converse', 'Vans', 
    'New Balance', 'Under Armour', 'ASICS', 'Saucony', 'Brooks'
  ],
  
  /** Default product image */
  DEFAULT_IMAGE: '/images/default-product.png',
  
  /** Maximum product name length */
  MAX_NAME_LENGTH: 100,
  
  /** Maximum product description length */
  MAX_DESCRIPTION_LENGTH: 1000,
  
  /** Minimum product price */
  MIN_PRICE: 0.01,
  
  /** Maximum product price */
  MAX_PRICE: 10000,
  
  /** Minimum stock quantity */
  MIN_STOCK: 0,
  
  /** Maximum stock quantity */
  MAX_STOCK: 10000,
} as const;

// ========================================
// ORDER CONSTANTS
// ========================================

/**
 * Order-related constants
 * Order statuses and configuration
 */
export const ORDER_CONSTANTS = {
  /** Available order statuses */
  STATUSES: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  } as const,
  
  /** Available payment methods */
  PAYMENT_METHODS: {
    CARD: 'card',
    COD: 'cod',
  } as const,
  
  /** Order status display names */
  STATUS_LABELS: {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  },
  
  /** Payment method display names */
  PAYMENT_LABELS: {
    card: 'Credit/Debit Card',
    cod: 'Cash on Delivery',
  },
  
  /** Default shipping cost */
  DEFAULT_SHIPPING_COST: 9.99,
  
  /** Default tax rate (percentage) */
  DEFAULT_TAX_RATE: 8.5,
  
  /** Free shipping threshold */
  FREE_SHIPPING_THRESHOLD: 100,
} as const;

// ========================================
// NOTIFICATION CONSTANTS
// ========================================

/**
 * Notification-related constants
 * Notification types and configuration
 */
export const NOTIFICATION_CONSTANTS = {
  /** Available notification types */
  TYPES: {
    ORDER: 'order',
    PRODUCT: 'product',
    ACCOUNT_SECURITY: 'account_security',
    PROMOTION: 'promotion',
  } as const,
  
  /** Notification type display names */
  TYPE_LABELS: {
    order: 'Order Update',
    product: 'Product Update',
    account_security: 'Account Security',
    promotion: 'Promotion',
  },
  
  /** Maximum notification message length */
  MAX_MESSAGE_LENGTH: 500,
  
  /** Notification auto-dismiss delay (in milliseconds) */
  AUTO_DISMISS_DELAY: 5000,
  
  /** Maximum number of notifications to display */
  MAX_DISPLAY_COUNT: 10,
} as const;

// ========================================
// UI CONSTANTS
// ========================================

/**
 * UI-related constants
 * Design system values and breakpoints
 */
export const UI_CONSTANTS = {
  /** Screen breakpoints (in pixels) */
  BREAKPOINTS: {
    XS: 480,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  
  /** Animation durations (in milliseconds) */
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  /** Z-index values */
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },
  
  /** Border radius values */
  BORDER_RADIUS: {
    NONE: '0',
    SM: '0.125rem',
    DEFAULT: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    '2XL': '1rem',
    FULL: '9999px',
  },
  
  /** Spacing values */
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
    '3XL': '4rem',
  },
} as const;

// ========================================
// VALIDATION CONSTANTS
// ========================================

/**
 * Validation-related constants
 * Validation rules and error messages
 */
export const VALIDATION_CONSTANTS = {
  /** Email validation regex */
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  /** Phone validation regex */
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  
  /** Password validation regex (at least 8 characters, 1 uppercase, 1 lowercase, 1 number) */
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  /** Credit card number validation regex */
  CARD_NUMBER_REGEX: /^[0-9]{13,19}$/,
  
  /** CVV validation regex */
  CVV_REGEX: /^[0-9]{3,4}$/,
  
  /** ZIP code validation regex */
  ZIP_CODE_REGEX: /^[0-9]{5}(-[0-9]{4})?$/,
  
  /** Error messages */
  ERROR_MESSAGES: {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PHONE_INVALID: 'Please enter a valid phone number',
    PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, and number',
    PASSWORD_MISMATCH: 'Passwords do not match',
    MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
    MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
    MIN_VALUE: (min: number) => `Must be at least ${min}`,
    MAX_VALUE: (max: number) => `Must be no more than ${max}`,
    INVALID_FILE_TYPE: 'Invalid file type',
    FILE_TOO_LARGE: 'File is too large',
    NETWORK_ERROR: 'Network error. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
} as const;

// ========================================
// LOCAL STORAGE KEYS
// ========================================

/**
 * Local storage keys
 * Keys used for storing data in browser's local storage
 */
export const STORAGE_KEYS = {
  /** Authentication token */
  AUTH_TOKEN: 'kickspot_auth_token',
  
  /** User data */
  USER_DATA: 'kickspot_user_data',
  
  /** Cart data */
  CART_DATA: 'kickspot_cart_data',
  
  /** Favorites data */
  FAVORITES_DATA: 'kickspot_favorites_data',
  
  /** Theme preference */
  THEME: 'kickspot_theme',
  
  /** Language preference */
  LANGUAGE: 'kickspot_language',
  
  /** Recent searches */
  RECENT_SEARCHES: 'kickspot_recent_searches',
  
  /** Form drafts */
  FORM_DRAFTS: 'kickspot_form_drafts',
} as const;

// ========================================
// EXPORT ALL CONSTANTS
// ========================================

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  APP_CONFIG,
  ROUTES,
  PRODUCT_CONSTANTS,
  ORDER_CONSTANTS,
  NOTIFICATION_CONSTANTS,
  UI_CONSTANTS,
  VALIDATION_CONSTANTS,
  STORAGE_KEYS,
};
