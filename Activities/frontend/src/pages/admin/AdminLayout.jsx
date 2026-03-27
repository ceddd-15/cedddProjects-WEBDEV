import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import "../../styles/ConfirmModal.css";

const menuItems = [
  { path: "/admin", label: "Dashboard" },
  { path: "/admin/products", label: "Products" },
  { path: "/admin/orders", label: "Orders" },
  { path: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    startLoading("Logging out...");
    await logout();
    await new Promise(resolve => setTimeout(resolve, 2000));
    stopLoading();
    navigate("/");
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <div className="admin-nav-label">Menu</div>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/shop" className="admin-nav-item">
            Back to Shop
          </Link>
          <button onClick={handleLogout} className="admin-nav-item logout">
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>
              {menuItems.find((m) => m.path === location.pathname)?.label ||
                "Dashboard"}
            </h1>
            <p>Manage your store operations</p>
          </div>
          <div className="admin-user">
            <div className="admin-user-avatar">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">
                {user?.username || "Admin"}
              </span>
              <span className="admin-user-role">{user?.role}</span>
            </div>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </main>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
}
