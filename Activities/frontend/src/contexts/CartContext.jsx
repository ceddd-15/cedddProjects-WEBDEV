import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartService } from "../services/shopService";
import { authService } from "../services/authService";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    const isAuthenticated = authService.isAuthenticated();
    
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem("cart") || '{"items":[],"total":0}');
      setCart(localCart);
      setCartCount(localCart.items?.length || 0);
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
      setCartCount(data.items?.length || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    const isAuth = authService.isAuthenticated();
    if (!isAuth) {
      const localCart = JSON.parse(localStorage.getItem("cart") || '{"items":[],"total":0}');
      const existingIndex = localCart.items.findIndex(item => item.product._id === product._id);
      
      if (existingIndex >= 0) {
        localCart.items[existingIndex].quantity += quantity;
      } else {
        localCart.items.push({ product, quantity });
      }
      
      localCart.total = localCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      localStorage.setItem("cart", JSON.stringify(localCart));
      setCart(localCart);
      setCartCount(localCart.items.length);
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.addToCart(product._id, quantity);
      setCart(data);
      setCartCount(data.items?.length || 0);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    const isAuth = authService.isAuthenticated();
    if (!isAuth) {
      const localCart = JSON.parse(localStorage.getItem("cart") || '{"items":[],"total":0}');
      const item = localCart.items.find(item => item.product._id === productId);
      if (item) {
        item.quantity = quantity;
        localCart.total = localCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        localStorage.setItem("cart", JSON.stringify(localCart));
        setCart(localCart);
      }
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.updateCartItem(productId, quantity);
      setCart(data);
      setCartCount(data.items?.length || 0);
    } catch (error) {
      console.error("Failed to update cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    const isAuth = authService.isAuthenticated();
    if (!isAuth) {
      const localCart = JSON.parse(localStorage.getItem("cart") || '{"items":[],"total":0}');
      localCart.items = localCart.items.filter(item => item.product._id !== productId);
      localCart.total = localCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      localStorage.setItem("cart", JSON.stringify(localCart));
      setCart(localCart);
      setCartCount(localCart.items.length);
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.removeFromCart(productId);
      setCart(data);
      setCartCount(data.items?.length || 0);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const isAuth = authService.isAuthenticated();
    if (!isAuth) {
      const emptyCart = { items: [], total: 0 };
      localStorage.setItem("cart", JSON.stringify(emptyCart));
      setCart(emptyCart);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      await cartService.clearCart();
      setCart({ items: [], total: 0 });
      setCartCount(0);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    cartCount,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a Cart Provider.");
  }
  return context;
};
