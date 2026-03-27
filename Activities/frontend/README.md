# Frontend - CedCycles Web App

## Tech Stack
- **React 19** - UI framework
- **React Router DOM 7** - Client-side routing
- **Vite** - Build tool
- **ESLint** - Code linting
- **slugify** - URL-friendly slugs

## Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.1",
  "slugify": "^1.6.6"
}
```

## Dev Dependencies
```json
{
  "@eslint/js": "^9.39.1",
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react-swc": "^4.2.2",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0",
  "vite": "^7.2.4"
}
```

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── AlertModal.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── Header.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── LoadingContext.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx       # Login
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Landing.jsx        # Home
│   │   ├── Orders.jsx
│   │   ├── Profile.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── Shop.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminLayout.jsx
│   │       ├── AdminOrders.jsx
│   │       ├── AdminProducts.jsx
│   │       └── AdminUsers.jsx
│   ├── services/
│   │   ├── adminService.jsx
│   │   ├── authService.jsx
│   │   └── shopService.jsx
│   ├── styles/
│   ├── imageAssets/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Pages

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Home page with hero, featured products |
| Shop | `/shop` | Product catalog with filtering |
| ProductDetail | `/product/:id` | Individual product view |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Checkout process |
| Orders | `/orders` | Order history |
| Profile | `/profile` | User profile |
| Login | `/login` | User login |
| Register | `/register` | User registration |

### Admin Pages
| Page | Route | Description |
|------|-------|-------------|
| AdminDashboard | `/admin` | Dashboard overview |
| AdminProducts | `/admin/products` | Product management |
| AdminOrders | `/admin/orders` | Order management |
| AdminUsers | `/admin/users` | User management |

## Contexts

### AuthContext
Manages authentication state (login, register, logout, user data)

### CartContext
Manages shopping cart state (add, remove, update items)

### LoadingContext
Provides global loading overlay functionality

## Services

### authService.jsx
- `login(credentials)` - Authenticate user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `getCurrentUser()` - Get stored user data
- `getToken()` - Get JWT token

### shopService.jsx
- `getProducts()` - Fetch products
- `getProduct(id)` - Fetch single product
- `createOrder(orderData)` - Place order
- `getOrders()` - Fetch user orders

### adminService.jsx
- `getAllProducts()` - Fetch all products
- `createProduct(productData)` - Create product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product
- `getAllOrders()` - Fetch all orders
- `updateOrderStatus(id, status)` - Update order
- `getAllUsers()` - Fetch all users
- `deleteUser(id)` - Delete user

## Running the Frontend

```bash
cd Activities/frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
