import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout.jsx";
import { adminService } from "../../services/adminService.jsx";

const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const result = await adminService.getDashboard();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AdminLayout><div className="loading">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products">📦</div>
            <div className="stat-info">
              <span className="stat-value">{data.stats.totalProducts}</span>
              <span className="stat-label">Total Products</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orders">🛒</div>
            <div className="stat-info">
              <span className="stat-value">{data.stats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon users">👥</div>
            <div className="stat-info">
              <span className="stat-value">{data.stats.totalUsers}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-info">
              <span className="stat-value">${data.stats.revenue.toFixed(2)}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>

        <div className="recent-orders-card">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders">View All →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{order.user?.username || "Unknown"}</span>
                      <span className="customer-email">{order.user?.email}</span>
                    </div>
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
