import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/shop/Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems(cart.items.map((item) => item.product._id));
  }, [cart.items]);

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map((item) => item.product._id));
    }
  };

  const toggleItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    updateCartItem(productId, quantity);
  };

  const selectedCartItems = cart.items.filter((item) =>
    selectedItems.includes(item.product._id)
  );
  const selectedTotal = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = selectedTotal >= 500 ? 0 : 50;
  const orderTotal = selectedTotal + shippingFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout", { state: { selectedItems: selectedCartItems } });
  };

  if (cart.items.length === 0) {
    return (
      <div>
        <Header />
        <div className="cart-page">
          <div className="cart-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <a href="/shop" className="shop-now-btn">
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="cart-page">
        <div className="cart-header">
          <div className="cart-select-all">
            <input
              type="checkbox"
              className="checkbox"
              checked={selectedItems.length === cart.items.length}
              onChange={toggleSelectAll}
            />
            <span>Select All</span>
          </div>
          <span className="cart-header-product">Product</span>
          <span className="cart-header-price">Unit Price</span>
          <span className="cart-header-price">Quantity</span>
          <span className="cart-header-price">Total</span>
          <span className="cart-header-actions">Actions</span>
        </div>

        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.product._id} className="cart-item">
              <div className="cart-item-select">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedItems.includes(item.product._id)}
                  onChange={() => toggleItem(item.product._id)}
                />
              </div>
              <div className="cart-item-product">
                <img
                  src={item.product.images?.[0] || "https://via.placeholder.com/80"}
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-variant">
                    {item.product.brand || "Bike Parts"}
                  </div>
                </div>
              </div>
              <div className="cart-item-price">
                ${item.product.price.toFixed(2)}
              </div>
              <div className="cart-item-quantity">
                <button
                  className="qty-btn"
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity + 1)
                  }
                  disabled={item.quantity >= item.product.stock}
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <div className="cart-item-actions">
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-info">
            <div className="cart-summary-row">
              <span>Subtotal ({selectedCartItems.length} items)</span>
              <span>${selectedTotal.toFixed(2)}</span>
            </div>
            {shippingFee === 0 ? (
              <div className="cart-summary-row free-shipping">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
            ) : (
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
            )}
            {shippingFee === 0 && selectedTotal > 0 && (
              <div className="free-shipping-msg">You qualify for free shipping!</div>
            )}
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="cart-summary-actions">
            <button
              className="checkout-btn"
              disabled={selectedItems.length === 0 || loading}
              onClick={handleCheckout}
            >
              Checkout
            </button>
            <a href="/shop" className="continue-shopping">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
