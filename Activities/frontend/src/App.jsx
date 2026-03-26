import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/shop/Landing.css";
import "./styles/admin/Admin.css";

import Landing from "./pages/Landing.jsx";
import Shop from "./pages/Shop.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Cart from "./pages/Cart.jsx";
import Profile from "./pages/Profile.jsx";
import Checkout from "./pages/Checkout.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Orders from "./pages/Orders.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
