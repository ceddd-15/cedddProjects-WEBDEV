import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import { AlertModal } from "../components/AlertModal.jsx";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { userService, orderService } from "../services/shopService";
import "../styles/shop/Checkout.css";
import "../styles/ConfirmModal.css";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const selectedItemIds = location.state?.selectedItems?.map(i => i.product._id) || [];
  const filteredItems = selectedItemIds.length > 0
    ? cart.items.filter(item => selectedItemIds.includes(item.product._id))
    : cart.items;

  useEffect(() => {
    if (filteredItems.length === 0) {
      navigate("/cart");
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const userData = await userService.getProfile();
      setAddresses(userData.addresses || []);
      const defaultAddr = userData.addresses?.find((a) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr);
      else if (userData.addresses?.length > 0)
        setSelectedAddress(userData.addresses[0]);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setAlert({
        isOpen: true,
        title: "Missing Information",
        message: "Please select a shipping address before placing your order.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const itemIds = filteredItems.map(item => item.product._id);
      await orderService.createOrder({
        shippingAddress: selectedAddress,
        paymentMethod,
        itemIds,
      });

      setAlert({
        isOpen: true,
        title: "Order Placed!",
        message:
          "Your order has been successfully created. You can track it in your orders tab.",
        type: "success",
      });
      
      await refreshCart();
    } catch (error) {
      setAlert({
        isOpen: true,
        title: "Order Failed",
        message:
          error.message || "Something went wrong while processing your order.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    const isSuccess = alert.type === "success";
    setAlert({ ...alert, isOpen: false });

    if (isSuccess) {
      navigate("/orders");
    }
  };

  const subtotal = filteredItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shippingFee;

  return (
    <div>
      <Header />
      <div className="checkout-page">
        <div className="checkout-main">
          <div className="checkout-section">
            <div className="checkout-section-header">
              <span className="checkout-section-number">1</span>
              <span className="checkout-section-title">Delivery Address</span>
            </div>
            <div className="address-list">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`address-card ${selectedAddress?._id === addr._id ? "selected" : ""}`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <div className="address-card-header">
                    <span className="address-name">{addr.fullName}</span>
                    <span className="address-phone">{addr.phone}</span>
                    {addr.isDefault && (
                      <span className="address-default">Default</span>
                    )}
                  </div>
                  <div className="address-text">
                    {addr.address}, {addr.city} {addr.postalCode}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-section">
            <div className="checkout-section-header">
              <span className="checkout-section-number">2</span>
              <span className="checkout-section-title">Payment Method</span>
            </div>
            <div className="payment-methods">
              <label
                className={`payment-method ${paymentMethod === "cod" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div className="payment-method-info">
                  <span className="payment-method-name">Cash on Delivery</span>
                  <span className="payment-method-desc">
                    Pay when you receive your order
                  </span>
                </div>
              </label>
              <label
                className={`payment-method ${paymentMethod === "card" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <div className="payment-method-info">
                  <span className="payment-method-name">Credit/Debit Card</span>
                  <span className="payment-method-desc">
                    Pay with Visa or Mastercard
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="checkout-section">
            <div className="checkout-section-header">
              <span className="checkout-section-number">3</span>
              <span className="checkout-section-title">Review Items</span>
            </div>
            <div className="order-items">
              {filteredItems.map((item) => (
                <div key={item.product._id} className="order-item">
                  <img
                    src={
                      item.product.images?.[0] ||
                      "https://via.placeholder.com/60"
                    }
                    alt={item.product.name}
                    className="order-item-image"
                  />
                  <div className="order-item-info">
                    <div className="order-item-name">{item.product.name}</div>
                    <div className="order-item-variant">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="order-item-price">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="checkout-sidebar">
            <div className="order-summary">
            <h3 className="order-summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {shippingFee === 0 ? (
              <div className="summary-row free-shipping">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
            ) : (
              <div className="summary-row">
                <span>Shipping Fee</span>
                <span>${shippingFee.toFixed(2)}</span>
              </div>
            )}
            {shippingFee === 0 && (
              <div className="free-shipping-message">
                🎉 Free shipping applied on orders over $500!
              </div>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="place-order-btn"
              disabled={!selectedAddress || loading}
              onClick={handlePlaceOrder}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        onClose={handleCloseAlert}
      />
    </div>
  );
}
