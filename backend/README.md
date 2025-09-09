# KickSpot Backend

E-commerce API backend for KickSpot shoe store.

## Features

- User authentication (JWT)
- Product management
- Order processing
- Real-time notifications (Socket.io)
- Admin dashboard support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file based on `env.sample`:
```bash
cp env.sample .env
```

3. Configure your database settings in `.env`

4. Run development server:
```bash
npm run dev
```

## API Endpoints

- `/api/auth` - Authentication
- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/customers` - Customer management
- `/api/notifications` - Real-time notifications

## Tech Stack

- Node.js + Express
- TypeScript
- Sequelize ORM
- MySQL
- Socket.io
- JWT Authentication

