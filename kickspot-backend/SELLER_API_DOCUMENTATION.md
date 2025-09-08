# KickSpot Seller API Documentation

## Overview
This document describes the API endpoints for sellers in the KickSpot e-commerce platform. Sellers can manage their products, view their buyers, and access their dashboard.

## Authentication
All seller endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Seller Role
- **Role**: `seller`
- **Permissions**: Can create/manage their own products, view their buyers, access seller dashboard
- **Restrictions**: Cannot access admin-only features

---

## 🛍️ Product Management

### Create Product (with Image Upload)
**POST** `/api/v1/products`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (Form Data):**
```
name: string (required)
category: string (required) - "Men", "Women", or "Kids"
price: number (required) - must be > 0
stock: number (required) - must be >= 0
description: string (optional)
image: file (optional) - image file (max 5MB)
```

**Response:**
```json
{
  "id": 1,
  "name": "Nike Air Max 270",
  "category": "Men",
  "price": 150.00,
  "stock": 25,
  "description": "Comfortable running shoes",
  "image_url": "/uploads/products/image-1234567890-123456789.jpg",
  "seller_id": 2,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get My Products
**GET** `/api/v1/products/seller/my-products`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nike Air Max 270",
    "category": "Men",
    "price": 150.00,
    "stock": 25,
    "description": "Comfortable running shoes",
    "image_url": "/uploads/products/image-1234567890-123456789.jpg",
    "seller_id": 2,
    "created_at": "2024-01-15T10:30:00Z",
    "seller": {
      "id": 2,
      "name": "Test Seller",
      "email": "seller@kickspot.com"
    }
  }
]
```

---

## 👥 Buyer Management

### Get My Buyers
**GET** `/api/v1/products/seller/my-buyers`

**Description:** Returns only buyers who have purchased products from this seller.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-10T08:00:00Z"
  },
  {
    "id": 3,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "created_at": "2024-01-12T14:30:00Z"
  }
]
```

---

## 📊 Seller Dashboard

### Get Dashboard Stats
**GET** `/api/v1/seller/dashboard`

**Response:**
```json
{
  "seller": {
    "id": 2,
    "name": "Test Seller",
    "email": "seller@kickspot.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "stats": {
    "totalProducts": 15,
    "totalOrders": 45,
    "totalRevenue": 6750.00
  },
  "recentOrders": [
    {
      "id": 123,
      "user_id": 1,
      "total_price": 300.00,
      "status": "pending",
      "created_at": "2024-01-15T14:30:00Z",
      "orderItems": [
        {
          "id": 456,
          "order_id": 123,
          "product_id": 1,
          "quantity": 2,
          "price": 150.00,
          "product": {
            "id": 1,
            "name": "Nike Air Max 270",
            "price": 150.00
          }
        }
      ],
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### Get My Orders
**GET** `/api/v1/seller/orders`

**Response:**
```json
[
  {
    "id": 123,
    "user_id": 1,
    "total_price": 300.00,
    "status": "pending",
    "created_at": "2024-01-15T14:30:00Z",
    "orderItems": [
      {
        "id": 456,
        "order_id": 123,
        "product_id": 1,
        "quantity": 2,
        "price": 150.00,
        "product": {
          "id": 1,
          "name": "Nike Air Max 270",
          "price": 150.00,
          "image_url": "/uploads/products/image-1234567890-123456789.jpg"
        }
      }
    ],
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

## 👤 Profile Management

### Update Seller Profile
**PUT** `/api/v1/seller/profile`

**Body:**
```json
{
  "name": "Updated Seller Name",
  "email": "newemail@kickspot.com"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Updated Seller Name",
  "email": "newemail@kickspot.com",
  "role": "seller"
}
```

---

## 🔐 User Registration as Seller

### Register as Seller
**POST** `/api/v1/auth/register`

**Body:**
```json
{
  "name": "New Seller",
  "email": "newseller@kickspot.com",
  "password": "password123",
  "role": "seller"
}
```

**Response:**
```json
{
  "user": {
    "id": 3,
    "name": "New Seller",
    "email": "newseller@kickspot.com",
    "role": "seller"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🚨 Error Responses

### Authentication Required
```json
{
  "message": "Authentication required"
}
```

### Insufficient Permissions
```json
{
  "message": "Forbidden"
}
```

### Validation Errors
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "price",
      "location": "body"
    }
  ]
}
```

### File Upload Errors
```json
{
  "message": "Only image files are allowed!"
}
```

---

## 📝 Notes

1. **Image Upload**: Images are stored in `/uploads/products/` directory and served at `/uploads/products/<filename>`
2. **File Size Limit**: Maximum 5MB per image
3. **Supported Formats**: All image formats (jpg, png, gif, webp, etc.)
4. **Seller Isolation**: Sellers can only see buyers who purchased their products
5. **Revenue Calculation**: Based on actual order items, not just product prices
6. **Order Tracking**: Sellers can see all orders containing their products

---

## 🧪 Testing

### Create Test Seller
```bash
npm run create-seller
```

### Test Endpoints
Use the provided Postman collection or test with curl:

```bash
# Create product with image
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer <token>" \
  -F "name=Nike Air Max" \
  -F "category=Men" \
  -F "price=150" \
  -F "stock=25" \
  -F "image=@/path/to/image.jpg"

# Get seller dashboard
curl -X GET http://localhost:5000/api/v1/seller/dashboard \
  -H "Authorization: Bearer <token>"
```
