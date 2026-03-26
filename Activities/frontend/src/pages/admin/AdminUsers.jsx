import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { adminService } from "../../services/adminService.jsx";
import { ConfirmModal } from "../../components/ConfirmModal.jsx";
import { AlertModal } from "../../components/AlertModal.jsx";
import searchIcon from "../../imageAssets/search_icon.png";

const ROLE_COLORS = {
  admin: "#dc2626",
  moderator: "#7c3aed",
  user: "#6b7280",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
  });
  const [alert, setAlert] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setAlert({
        isOpen: true,
        title: "Role Updated",
        message: `User role has been successfully changed to ${newRole}.`,
      });
      fetchUsers();
    } catch (error) {
      setAlert({
        isOpen: true,
        title: "Update Failed",
        message: error.message,
      });
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteModal({ isOpen: true, userId: userId });
  };

  const handleConfirmDelete = async () => {
    const userId = deleteModal.userId;
    setDeleteModal({ isOpen: false, userId: null });
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
      setAlert({
        isOpen: true,
        title: "User Deleted",
        message: "The account has been permanently removed.",
      });
    } catch (error) {
      setAlert({ isOpen: true, title: "Error", message: error.message });
    }
  };

  // Filtering logic for the search bar
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <AdminLayout>
        <div className="loading">Loading...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="page-header">
          <div className="header-left">
            <h2>User Management</h2>
          </div>
          <div className="header-right">
            <div className="modern-search-wrapper">
              <input
                type="text"
                placeholder="Search by username or email..."
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
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.username}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        style={{
                          backgroundColor: `${ROLE_COLORS[user.role]}15`,
                          color: ROLE_COLORS[user.role],
                          borderColor: ROLE_COLORS[user.role],
                        }}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteClick(user._id)}
                        disabled={user.role === "admin"}
                        title={
                          user.role === "admin"
                            ? "Cannot delete admin"
                            : "Delete user"
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone and they will lose access immediately."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModal({ isOpen: false, userId: null })}
        />

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
