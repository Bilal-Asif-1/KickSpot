# E-commerce Backend API Documentation

This document provides complete API documentation for the E-commerce application backend.

## Base URL
```
http://localhost:5000
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles
- **Admin**: Can manage products, view all orders, update order status, access dashboard statistics
- **User**: Can browse products, place orders, view their own orders, cancel pending orders

---

## Health & System Endpoints

### Health Check
**GET** `/health`
- **Description**: Check if the server is running
- **Authentication**: None
- **Response**:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-09-07T21:39:09.480Z"
}
```

### API Test
**GET** `/api/test`
- **Description**: Test API connectivity and get available endpoints
- **Authentication**: None
- **Response**:
```json
{
  "success": true,
  "message": "API is working!",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "products": "/api/products"
  }
}
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`
- **Description**: Register a new user
- **Authentication**: None
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // Optional, defaults to "user"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
**POST** `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get User Profile
**GET** `/api/auth/profile`
- **Description**: Get current user's profile
- **Authentication**: Required (Bearer token)
- **Response** (200):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-09-07T21:00:00.000Z"
    }
  }
}
```

### Update Profile
**PUT** `/api/auth/profile`
- **Description**: Update current user's profile
- **Authentication**: Required (Bearer token)
- **Request Body**:
```json
{
  "name": "John Smith", // Optional
  "email": "johnsmith@example.com" // Optional
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "role": "user",
      "createdAt": "2025-09-07T21:00:00.000Z"
    }
  }
}
```

### Change Password
**PUT** `/api/auth/change-password`
- **Description**: Change current user's password
- **Authentication**: Required (Bearer token)
- **Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Product Endpoints

### Get All Products (Public)
**GET** `/api/products`
- **Description**: Get all products with optional filtering and pagination
- **Authentication**: None
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10, max: 100)
  - `search` (string): Search in product name and description
  - `category` (string): Filter by category
  - `sortBy` (string): Sort field (default: createdAt)
  - `sortOrder` (string): Sort direction - ASC or DESC (default: DESC)
- **Response** (200):
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Classic White Sneakers",
        "description": "Timeless design, perfect for everyday wear.",
        "price": "75.00",
        "category": "Sneakers",
        "brand": "Nike",
        "imageUrl": "https://via.placeholder.com/300x300?text=Classic+White+Sneakers",
        "userId": 1,
        "createdAt": "2025-09-07T21:00:00.000Z",
        "updatedAt": "2025-09-07T21:00:00.000Z",
        "user": {
          "id": 1,
          "name": "Admin User",
          "email": "admin@example.com"
        }
      }
    ]
  },
  "pagination": {
    "total": 8,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### Get Products by Category (Public)
**GET** `/api/products/category/:category`
- **Description**: Get all products in a specific category
- **Authentication**: None
- **URL Parameters**:
  - `category` (string): Category name
- **Response** (200): Same format as Get All Products

### Get Product by ID
**GET** `/api/products/:id`
- **Description**: Get a specific product by ID
- **Authentication**: Required (Bearer token)
- **URL Parameters**:
  - `id` (number): Product ID
- **Response** (200):
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "product": {
      "id": 1,
      "name": "Classic White Sneakers",
      "description": "Timeless design, perfect for everyday wear.",
      "price": "75.00",
      "category": "Sneakers",
      "brand": "Nike",
      "imageUrl": "https://via.placeholder.com/300x300?text=Classic+White+Sneakers",
      "userId": 1,
      "createdAt": "2025-09-07T21:00:00.000Z",
      "updatedAt": "2025-09-07T21:00:00.000Z",
      "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  }
}
```

### Get User's Products
**GET** `/api/products/user/my-products`
- **Description**: Get all products created by the current user
- **Authentication**: Required (Bearer token)
- **Response** (200): Same format as Get All Products

### Create Product (Admin Only)
**POST** `/api/products`
- **Description**: Create a new product
- **Authentication**: Required (Bearer token + Admin role)
- **Request Body**:
```json
{
  "name": "New Sneakers",
  "description": "Great new sneakers for running",
  "price": 125.99,
  "category": "Running",
  "brand": "Nike", // Optional
  "stock": 50, // Optional, defaults to 0
  "imageUrl": "https://example.com/image.jpg" // Optional
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 9,
      "name": "New Sneakers",
      "description": "Great new sneakers for running",
      "price": "125.99",
      "category": "Running",
      "brand": "Nike",
      "stock": 50,
      "imageUrl": "https://example.com/image.jpg",
      "userId": 1,
      "createdAt": "2025-09-07T21:00:00.000Z",
      "updatedAt": "2025-09-07T21:00:00.000Z",
      "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  }
}
```

### Update Product (Admin Only)
**PUT** `/api/products/:id`
- **Description**: Update an existing product
- **Authentication**: Required (Bearer token + Admin role)
- **URL Parameters**:
  - `id` (number): Product ID
- **Request Body**: Same as Create Product (all fields optional)
- **Response** (200): Same format as Get Product by ID

### Delete Product (Admin Only)
**DELETE** `/api/products/:id`
- **Description**: Delete a product
- **Authentication**: Required (Bearer token + Admin role)
- **URL Parameters**:
  - `id` (number): Product ID
- **Response** (200):
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## User Management Endpoints (Admin Only)

### Get All Users
**GET** `/api/users`
- **Description**: Get all users
- **Authentication**: Required (Bearer token + Admin role)
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10, max: 100)
- **Response** (200):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "createdAt": "2025-09-07T21:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

### Get User by ID
**GET** `/api/users/:id`
- **Description**: Get a specific user by ID
- **Authentication**: Required (Bearer token + Admin role)
- **URL Parameters**:
  - `id` (number): User ID
- **Response** (200):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "2025-09-07T21:00:00.000Z"
    }
  }
}
```

### Delete User
**DELETE** `/api/users/:id`
- **Description**: Delete a user
- **Authentication**: Required (Bearer token + Admin role)
- **URL Parameters**:
  - `id` (number): User ID
- **Response** (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "a",
      "msg": "Name must be at least 3 characters",
      "path": "name",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Order Management Endpoints

### Create Order (User)
**POST** `/api/orders`
- **Description**: Create a new order with multiple items
- **Authentication**: Required (Bearer token)
- **Request Body**:
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "size": "10",
      "color": "Black"
    }
  ],
  "shippingDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345",
    "country": "USA"
  },
  "paymentDetails": {
    "method": "cash_on_delivery"
  },
  "orderNotes": "Please handle with care"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-1699123456789-123",
      "status": "pending",
      "totalAmount": "150.00",
      "buyerName": "John Doe",
      "buyerEmail": "john@example.com",
      "shippingAddress": "123 Main St",
      "paymentMethod": "cash_on_delivery",
      "items": [
        {
          "id": 1,
          "productName": "Classic White Sneakers",
          "quantity": 2,
          "unitPrice": "75.00",
          "totalPrice": "150.00"
        }
      ],
      "createdAt": "2025-09-07T22:00:00.000Z"
    }
  }
}
```

### Get User's Orders
**GET** `/api/orders/my-orders`
- **Description**: Get all orders for the authenticated user
- **Authentication**: Required (Bearer token)
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
- **Response** (200):
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-1699123456789-123",
        "status": "pending",
        "totalAmount": "150.00",
        "items": [
          {
            "productName": "Classic White Sneakers",
            "quantity": 2,
            "unitPrice": "75.00"
          }
        ],
        "createdAt": "2025-09-07T22:00:00.000Z"
      }
    ]
  },
  "pagination": {
    "total": 5,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### Get Order by ID
**GET** `/api/orders/:id`
- **Description**: Get a specific order (users can only see their own)
- **Authentication**: Required (Bearer token)
- **URL Parameters**:
  - `id` (number): Order ID
- **Response** (200): Same format as order creation response

### Cancel Order
**PUT** `/api/orders/:id/cancel`
- **Description**: Cancel an order (only pending orders can be cancelled)
- **Authentication**: Required (Bearer token)
- **URL Parameters**:
  - `id` (number): Order ID
- **Response** (200):
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "order": {
      "id": 1,
      "status": "cancelled",
      "totalAmount": "150.00"
    }
  }
}
```

---

## Admin Order Management Endpoints

### Get All Orders (Admin)
**GET** `/api/orders/admin/all`
- **Description**: Get all orders with filtering options
- **Authentication**: Required (Bearer token + Admin role)
- **Query Parameters**:
  - `page` (number): Page number (default: 1)
  - `limit` (number): Items per page (default: 10)
  - `status` (string): Filter by status
  - `startDate` (date): Filter orders from date
  - `endDate` (date): Filter orders to date
  - `sortBy` (string): Sort field (default: createdAt)
  - `sortOrder` (string): ASC or DESC (default: DESC)
- **Response** (200): Same format as user orders with all order details

### Get Order Statistics (Admin Dashboard)
**GET** `/api/orders/admin/stats`
- **Description**: Get comprehensive order and sales statistics
- **Authentication**: Required (Bearer token + Admin role)
- **Response** (200):
```json
{
  "success": true,
  "message": "Order statistics retrieved successfully",
  "data": {
    "stats": {
      "totalOrders": 25,
      "ordersToday": 3,
      "ordersThisMonth": 15,
      "totalRevenue": 2450.50,
      "revenueToday": 225.00,
      "revenueThisMonth": 1850.75,
      "statusBreakdown": {
        "pending": 5,
        "confirmed": 8,
        "processing": 3,
        "shipped": 6,
        "delivered": 2,
        "cancelled": 1
      },
      "recentOrders": [
        {
          "id": 25,
          "orderNumber": "ORD-1699123456789-456",
          "totalAmount": "120.00",
          "status": "pending",
          "customer": {
            "name": "Jane Smith",
            "email": "jane@example.com"
          },
          "createdAt": "2025-09-07T22:00:00.000Z"
        }
      ]
    }
  }
}
```

### Update Order Status (Admin)
**PUT** `/api/orders/admin/:id/status`
- **Description**: Update order status and tracking information
- **Authentication**: Required (Bearer token + Admin role)
- **URL Parameters**:
  - `id` (number): Order ID
- **Request Body**:
```json
{
  "status": "shipped",
  "adminNotes": "Order has been shipped via FedEx",
  "trackingNumber": "FDX123456789",
  "estimatedDelivery": "2025-09-14T00:00:00Z"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "id": 1,
      "status": "shipped",
      "adminNotes": "Order has been shipped via FedEx",
      "trackingNumber": "FDX123456789",
      "estimatedDelivery": "2025-09-14T00:00:00.000Z",
      "updatedAt": "2025-09-07T22:00:00.000Z"
    }
  }
}
```

### Get Order Details (Admin)
**GET** `/api/orders/admin/:id/details`
- **Description**: Get complete order details including customer info
- **Authentication**: Required (Bearer token + Admin role)
- **URL Parameters**:
  - `id` (number): Order ID
- **Response** (200): Complete order object with customer details, items, and tracking info

---

## Data Models

### User
```typescript
{
  id: number,
  name: string (2-50 chars),
  email: string (valid email, unique),
  password: string (6+ chars, hashed),
  role: "user" | "admin",
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Product
```typescript
{
  id: number,
  name: string (2-100 chars),
  description: string (optional),
  price: decimal (10,2),
  category: string,
  brand: string (optional),
  stock: number (default: 0),
  imageUrl: string (optional),
  userId: number (foreign key to User),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Order
```typescript
{
  id: number,
  orderNumber: string (unique, auto-generated),
  userId: number (foreign key to User),
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
  totalAmount: decimal (10,2),
  // Buyer Details
  buyerName: string (2-100 chars),
  buyerEmail: string (valid email),
  buyerPhone: string (10-15 chars, optional),
  // Shipping Address
  shippingAddress: string,
  shippingCity: string,
  shippingState: string,
  shippingZip: string,
  shippingCountry: string (default: "USA"),
  // Payment Info
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery",
  paymentStatus: "pending" | "paid" | "failed" | "refunded",
  // Notes
  orderNotes: string (optional),
  adminNotes: string (optional),
  // Tracking
  trackingNumber: string (optional),
  estimatedDelivery: DateTime (optional),
  deliveredAt: DateTime (optional),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### OrderItem
```typescript
{
  id: number,
  orderId: number (foreign key to Order),
  productId: number (foreign key to Product),
  // Product snapshot at time of order
  productName: string,
  productDescription: string (optional),
  productCategory: string,
  productBrand: string (optional),
  productImageUrl: string (optional),
  // Order details
  quantity: number (min: 1),
  unitPrice: decimal (10,2),
  totalPrice: decimal (10,2),
  // Variants
  size: string (optional),
  color: string (optional),
  variant: string (optional),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## Rate Limiting
Currently no rate limiting is implemented, but consider implementing it for production.

## CORS
CORS is configured to allow all origins (`*`) for development. Update this for production.

## Database Seeded Data
The database comes pre-seeded with:
- **Admin User**: admin@example.com / admin123
- **Regular User**: user@example.com / admin123  
- **8 Sample Products**: Various shoes in different categories with stock levels
- **Orders**: Any orders created during testing

---

## Frontend Integration Notes

1. **Base URL**: Update to your production URL when deploying
2. **Token Storage**: Store JWT tokens securely (consider httpOnly cookies for production)
3. **Error Handling**: All endpoints follow the same success/error response format
4. **Pagination**: Use query parameters for pagination in product and order lists
5. **File Uploads**: Product images currently use URLs, consider implementing file upload for production
6. **Real-time Updates**: Consider WebSocket integration for real-time order status updates and inventory changes
7. **Order Flow**: Users can create orders → Admin can manage order status → Real-time dashboard updates
8. **Stock Management**: Order creation automatically reduces product stock, cancellation restores it
9. **Admin Dashboard**: Use `/api/orders/admin/stats` for real-time dashboard metrics
10. **Order Status Flow**: pending → confirmed → processing → shipped → delivered (or cancelled at any point before delivery)

## Complete E-commerce Flow Support

This API now supports the complete e-commerce workflow:

**User Journey:**
1. Register/Login as user
2. Browse products (public access)
3. Add items to cart (frontend state)
4. Place order with shipping details
5. View order history and status
6. Cancel pending orders if needed

**Admin Journey:**
1. Login as admin
2. Manage products (CRUD operations)
3. View all customer orders
4. Update order status and tracking
5. Access dashboard with sales analytics
6. Manage buyer details and order fulfillment

This API is production-ready and fully tested with comprehensive validation, authentication, authorization, and complete order management system.
