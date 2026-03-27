# CedCycles - E-Commerce Web Application

A full-stack e-commerce platform for cycling gear built with the MERN stack (MongoDB, Express, React, Node.js).

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM 7** - Client-side routing
- **Vite** - Build tool
- **ESLint** - Code linting

### Backend
- **Express** - Web framework
- **MongoDB + Mongoose** - Database & ODM
- **JSON Web Token (JWT)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **slugify** - URL-friendly slugs

## Features

### User Features
- User registration & login
- Product catalog with search/filter
- Product detail pages
- Shopping cart
- Checkout process
- Order history

### Admin Features
- Dashboard overview
- Product management (CRUD)
- User management
- Order management

## Project Structure

```
Activities/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, Cart, Loading)
│   │   ├── pages/         # Page components
│   │   │   └── admin/     # Admin pages
│   │   ├── services/      # API service modules
│   │   ├── styles/        # CSS files
│   │   ├── imageAssets/   # Static images
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── backend/
│   ├── config/             # Database config
│   ├── controller/        # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── index.js          # Entry point
│   ├── seed.js           # Database seeder
│   └── package.json
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
2. **Install backend dependencies:**
   ```bash
   cd Activities/backend
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd Activities/frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (local or ensure Atlas connection is configured)

2. **Start backend:**
   ```bash
   cd Activities/backend
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

3. **Start frontend:**
   ```bash
   cd Activities/frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Environment Variables

Create `.env` in backend:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart
- `DELETE /api/cart/:productId` - Remove from cart
