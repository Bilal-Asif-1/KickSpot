# KickSpot Admin API Documentation

## Overview
This document describes the API endpoints for admins in the KickSpot e-commerce platform. Admins can manage their own products, view their buyers, and access their dashboard with complete data isolation.

## Authentication
All admin endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Admin Role
- **Role**: `admin`
- **Permissions**: Can create/manage their own products, view their buyers, access admin dashboard
- **Data Isolation**: Each admin only sees their own products and buyers who purchased their products

---

## 📊 Admin Dashboard

### Get Dashboard Stats
**GET** `/api/v1/admin/dashboard`

**Response:**
```json
{
  "admin": {
    "id": 1,
    "name": "Test Admin",
    "email": "admin@kickspot.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "stats": {
    "totalProducts": 15,
    "totalOrders": 45,
    "totalRevenue": 6750.00,
    "totalBuyers": 12
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

---

## 🛍️ Product Management

### Get Admin's Products
**GET** `/api/v1/admin/products`

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
    "seller_id": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "seller": {
      "id": 1,
      "name": "Test Admin",
      "email": "admin@kickspot.com"
    }
  }
]
```

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
image_url: string (optional) - alternative to file upload
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
  "seller_id": 1,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Update Product
**PUT** `/api/v1/products/:id`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (Form Data):**
```
name: string (optional)
category: string (optional) - "Men", "Women", or "Kids"
price: number (optional) - must be > 0
stock: number (optional) - must be >= 0
description: string (optional)
image: file (optional) - new image file
image_url: string (optional) - new image URL
```

### Delete Product
**DELETE** `/api/v1/products/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

## 👥 Buyer Management

### Get Admin's Buyers
**GET** `/api/v1/admin/buyers`

**Description:** Returns only buyers who have purchased products from this admin.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-10T08:00:00Z",
    "orders": [
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
        ]
      }
    ]
  }
]
```

---

## 📦 Order Management

### Get Admin's Orders
**GET** `/api/v1/admin/orders`

**Description:** Returns all orders containing products from this admin.

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

### Update Admin Profile
**PUT** `/api/v1/admin/profile`

**Body:**
```json
{
  "name": "Updated Admin Name",
  "email": "newemail@kickspot.com"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Admin Name",
  "email": "newemail@kickspot.com",
  "role": "admin"
}
```

---

## 🔐 User Registration as Admin

### Register as Admin
**POST** `/api/v1/auth/register`

**Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@kickspot.com",
  "password": "password123",
  "role": "admin"
}
```

**Response:**
```json
{
  "user": {
    "id": 3,
    "name": "New Admin",
    "email": "newadmin@kickspot.com",
    "role": "admin"
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

## 📝 Key Features

### Data Isolation
- **Admin Products**: Each admin only sees their own products
- **Admin Buyers**: Only buyers who purchased the admin's products
- **Admin Orders**: Only orders containing the admin's products
- **Admin Revenue**: Only revenue from the admin's products

### Image Upload
- **File Upload**: Admins can upload images from their device
- **URL Alternative**: Admins can also use image URLs
- **File Storage**: Images stored in `/uploads/products/` directory
- **File Size Limit**: Maximum 5MB per image
- **Supported Formats**: All image formats (jpg, png, gif, webp, etc.)

### Product Management
- **Create Products**: Add new products with images
- **Update Products**: Modify existing products
- **Delete Products**: Remove products
- **Stock Management**: Track inventory levels
- **Category Management**: Organize by Men, Women, Kids

---

## 🧪 Testing

### Create Test Admin
```bash
npm run create-admin
```

### Create Test Seller
```bash
npm run create-seller
```

### Seed Sample Products
```bash
npm run seed-products
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

# Get admin dashboard
curl -X GET http://localhost:5000/api/v1/admin/dashboard \
  -H "Authorization: Bearer <token>"

# Get admin's products
curl -X GET http://localhost:5000/api/v1/admin/products \
  -H "Authorization: Bearer <token>"

# Get admin's buyers
curl -X GET http://localhost:5000/api/v1/admin/buyers \
  -H "Authorization: Bearer <token>"
```

---

## 🎯 Admin Workflow

1. **Register/Login** as Admin
2. **Redirect** to Admin Dashboard (`/admin`)
3. **View Stats** - Products, Orders, Revenue, Buyers
4. **Manage Products** - Add, Edit, Delete with image upload
5. **View Buyers** - Only those who bought admin's products
6. **Track Orders** - Only orders containing admin's products
7. **Update Profile** - Manage admin account details

---

## 🔒 Security Features

- **JWT Authentication** for all admin endpoints
- **Role-based Access Control** - Only admins can access admin endpoints
- **Data Isolation** - Each admin only sees their own data
- **File Upload Security** - Image files only, size limits
- **Input Validation** - All inputs validated and sanitized
