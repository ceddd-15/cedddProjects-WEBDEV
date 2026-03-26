import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { adminService } from "../../services/adminService.jsx";
import { AlertModal } from "../../components/AlertModal.jsx";
import searchIcon from "../../imageAssets/search_icon.png";

const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      setAlert({
        isOpen: true,
        title: "Status Updated",
        message: `Order status changed to ${newStatus} successfully.`,
      });
      fetchOrders();
    } catch (error) {
      setAlert({ isOpen: true, title: "Error", message: error.message });
    }
  };

  // Filter by ID (last 6 chars), Customer Email, or Formatted Date
  const filteredOrders = orders.filter((order) => {
    const orderIdShort = order._id.slice(-6).toUpperCase();
    const customerEmail = order.user?.email?.toLowerCase() || "";
    const orderDate = new Date(order.createdAt)
      .toLocaleDateString()
      .toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      orderIdShort.includes(query.toUpperCase()) ||
      customerEmail.includes(query) ||
      orderDate.includes(query)
    );
  });

  if (loading)
    return (
      <AdminLayout>
        <div className="loading">Loading...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="admin-orders">
        <div className="page-header">
          <div className="header-left">
            <h2>Order Management</h2>
          </div>
          <div className="header-right">
            <div className="modern-search-wrapper">
              <input
                type="text"
                placeholder="Search ID, Email, or Date (MM/DD/YYYY)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="modern-search-input"
              />
              <button className="modern-search-button" type="button">
                <img
                  src={searchIcon}
                  alt="Search"
                  className="modern-search-icon"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>
                      <div className="customer-info">
                        <span>{order.user?.username || "Unknown"}</span>
                        <span className="customer-email">
                          {order.user?.email}
                        </span>
                      </div>
                    </td>
                    <td>{order.items?.length || 0} items</td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        style={{
                          backgroundColor: `${STATUS_COLORS[order.status]}15`,
                          color: STATUS_COLORS[order.status],
                          borderColor: STATUS_COLORS[order.status],
                        }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    No orders found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                  <h4>Customer Info</h4>
                  <p>
                    <strong>Name:</strong> {selectedOrder.user?.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.user?.email}
                  </p>
                </div>
                <div className="order-info-section">
                  <h4>Order Info</h4>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${STATUS_COLORS[selectedOrder.status]}20`,
                        color: STATUS_COLORS[selectedOrder.status],
                        marginLeft: "8px",
                      }}
                    >
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
                <div className="order-total-section">
                  <span>Total:</span>
                  <span className="total-amount">
                    ${selectedOrder.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <AlertModal
          isOpen={alert.isOpen}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert({ ...alert, isOpen: false })}
        />
      </div>
    </AdminLayout>
  );
}
