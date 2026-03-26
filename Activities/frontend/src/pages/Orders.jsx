import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { AlertModal } from "../components/AlertModal.jsx";
import { orderService } from "../services/shopService";
import "../styles/shop/Orders.css";
import "../styles/ConfirmModal.css";

const STATUS_TABS = [
  { id: "all", name: "All" },
  { id: "pending", name: "Pending" },
  { id: "processing", name: "Processing" },
  { id: "shipped", name: "Shipped" },
  { id: "delivered", name: "Delivered" },
  { id: "cancelled", name: "Cancelled" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    orderId: null,
  });
  const [alert, setAlert] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (orderId) => {
    setCancelModal({ isOpen: true, orderId });
  };

  const handleConfirmCancel = async () => {
    const orderId = cancelModal.orderId;
    setCancelModal({ isOpen: false, orderId: null });

    try {
      await orderService.cancelOrder(orderId);
      await fetchOrders();
      setAlert({
        isOpen: true,
        title: "Order Cancelled",
        message: "Your order has been successfully cancelled.",
      });
    } catch (error) {
      setAlert({
        isOpen: true,
        title: "Error",
        message: error.message || "Failed to cancel order.",
      });
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div>
      <Header />
      <div className="orders-page">
        <div className="orders-page-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
          <div className="order-tabs">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`order-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-container">
              <div className="empty-orders-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <h3>No orders yet</h3>
              <p>Start shopping to see your orders here</p>
              <Link to="/shop" className="shop-now-btn">
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-card-header-left">
                    <span className="order-id">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <span className={`order-status ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
                <div className="order-card-body">
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-card">
                        <img
                          src={item.image || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="order-item-image"
                        />
                        <div className="order-item-info">
                          <div className="order-item-name">{item.name}</div>
                          <div className="order-item-meta">
                            <span>${item.price.toFixed(2)} each</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="order-item-right">
                          <div className="order-item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-card-footer">
                  <div className="order-summary">
                    <span className="order-summary-label">Order Total:</span>
                    <span className="order-summary-total">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="order-actions">
                    {["pending", "processing"].includes(order.status) && (
                      <button
                        className="order-action-btn danger"
                        onClick={() => handleCancelClick(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      className="order-action-btn secondary"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div
              className="modal order-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
                <button
                  className="modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>
              <div className="order-details">
                <div className="order-info-section">
                  <h4>Order Info</h4>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-badge ${selectedOrder.status}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="order-items-section">
                  <h4>Items</h4>
                  <div className="order-items-list">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <img
                          src={item.image || "https://via.placeholder.com/50"}
                          alt={item.name}
                        />
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <span className="item-meta">
                            ${item.price} x {item.quantity}
                          </span>
                        </div>
                        <span className="item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={cancelModal.isOpen}
          title="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          onConfirm={handleConfirmCancel}
          onCancel={() => setCancelModal({ isOpen: false, orderId: null })}
        />

        <AlertModal
          isOpen={alert.isOpen}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert({ ...alert, isOpen: false })}
        />
      </div>
    </div>
  );
}
