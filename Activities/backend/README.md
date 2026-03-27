# Backend - CedCycles API

## Tech Stack
- **Express** - Web framework
- **MongoDB + Mongoose** - Database & ODM
- **JSON Web Token (JWT)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **slugify** - URL-friendly slugs

## Dependencies
```json
{
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.1.5",
  "slugify": "^1.6.8"
}
```

## Dev Dependencies
- **nodemon** - Auto-restart on file changes

## Project Structure
```
backend/
├── config/
│   └── db.js           # MongoDB connection
├── controller/
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
│   └── auth.js         # JWT authentication middleware
├── models/
│   ├── Cart.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   └── shopRoutes.js
├── index.js            # Entry point
├── seed.js             # Database seeder
└── package.json
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/me | Get current user |

### Products (Shop)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| GET | /api/products/:id | Get product details |
| GET | /api/products/category/:category | Get products by category |

### Products (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/products | List all products (admin) |
| POST | /api/admin/products | Create product |
| PUT | /api/admin/products/:id | Update product |
| DELETE | /api/admin/products/:id | Delete product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | List user orders |
| POST | /api/orders | Create new order |
| GET | /api/admin/orders | List all orders (admin) |
| PUT | /api/admin/orders/:id | Update order status |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart | Add to cart |
| PUT | /api/cart | Update cart |
| DELETE | /api/cart/:productId | Remove from cart |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/users | List all users |
| DELETE | /api/admin/users/:id | Delete user |

## Running the Backend

```bash
cd Activities/backend
npm install
npm run dev
```

Runs on `http://localhost:3000`

## Environment Variables

Create `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cedcycles
JWT_SECRET=your_jwt_secret_key
```
