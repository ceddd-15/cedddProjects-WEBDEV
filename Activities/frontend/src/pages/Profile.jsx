import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { AlertModal } from "../components/AlertModal.jsx";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/shopService";
import "../styles/shop/Profile.css";
import "../styles/ConfirmModal.css";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    addressId: null,
  });
  const [alert, setAlert] = useState({ isOpen: false, title: "", message: "" });

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      setProfileForm({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(profileForm);
      await fetchProfile();
      setAlert({
        isOpen: true,
        title: "Success",
        message: "Profile updated successfully!",
      });
    } catch (error) {
      setAlert({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await userService.addAddress(addressForm);
      await fetchProfile();
      setShowAddressForm(false);
      setAddressForm({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
      });
      setAlert({
        isOpen: true,
        title: "Success",
        message: "Address added successfully!",
      });
    } catch (error) {
      setAlert({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleDeleteClick = (addressId) => {
    setDeleteModal({ isOpen: true, addressId });
  };

  const handleConfirmDeleteAddress = async () => {
    const idToDelete = deleteModal.addressId;
    setDeleteModal({ isOpen: false, addressId: null });
    try {
      await userService.deleteAddress(idToDelete);
      await fetchProfile();
      setAlert({ isOpen: true, title: "Deleted", message: "Address removed." });
    } catch (error) {
      setAlert({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await userService.setDefaultAddress(addressId);
      await fetchProfile();
    } catch (error) {
      setAlert({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate("/");
  };

  if (loading)
    return (
      <div>
        <Header />
        <div className="loading-spinner"></div>
      </div>
    );

  return (
    <div>
      <Header />
      <div className="profile-page">
        <aside className="profile-sidebar">
          <div className="profile-user">
            <div className="profile-avatar">
              {profile?.username?.charAt(0)?.toUpperCase()}
            </div>
            <div className="profile-name">{profile?.username}</div>
            <div className="profile-email">{profile?.email}</div>
          </div>
          <nav className="profile-nav">
            <button
              className={`profile-nav-item ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              My Info
            </button>
            <button
              className={`profile-nav-item ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              Addresses
            </button>
            <a href="/orders" className="profile-nav-item">
              My Orders
            </a>
            <button
              className="profile-nav-item"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="profile-content">
          {activeTab === "info" && (
            <>
              <h2 className="profile-section-title">Personal Information</h2>
              <form className="profile-form" onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    autoComplete="username"
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={profileForm.email}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                  />
                </div>

                <div className="profile-form-actions">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "addresses" && (
            <>
              <h2 className="profile-section-title">Saved Addresses</h2>
              <div className="address-list-page">
                {profile?.addresses?.map((addr) => (
                  <div
                    key={addr._id}
                    className={`address-card-page ${addr.isDefault ? "default" : ""}`}
                    style={{ cursor: "pointer" }}
                  >
                    {addr.isDefault && (
                      <span className="address-default-badge">Default</span>
                    )}
                    <div className="address-info">
                      <span className="name">{addr.fullName}</span>
                      <span className="phone">{addr.phone}</span>
                      <div className="address-text">
                        {addr.address}, {addr.city} {addr.postalCode}
                      </div>
                    </div>
                    <div className="address-card-actions">
                      {!addr.isDefault && (
                        <button
                          className="set-default"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(addr._id);
                          }}
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(addr._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {!showAddressForm && (
                  <button
                    className="add-address-card"
                    onClick={() => setShowAddressForm(true)}
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {showAddressForm && (
                <form className="address-form" onSubmit={handleAddAddress}>
                  <div className="form-group">
                    <label htmlFor="addr-name">Full Name</label>
                    <input
                      type="text"
                      id="addr-name"
                      name="fullName"
                      autoComplete="name"
                      value={addressForm.fullName}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="addr-phone">Phone</label>
                    <input
                      type="tel"
                      id="addr-phone"
                      name="phone"
                      autoComplete="tel"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label htmlFor="addr-text">Address</label>
                    <textarea
                      id="addr-text"
                      name="address"
                      autoComplete="street-address"
                      value={addressForm.address}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          address: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="addr-city">City</label>
                    <input
                      type="text"
                      id="addr-city"
                      name="city"
                      autoComplete="address-level2"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="addr-zip">Zip Code</label>
                    <input
                      type="text"
                      id="addr-zip"
                      name="postalCode"
                      autoComplete="postal-code"
                      value={addressForm.postalCode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          postalCode: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      Add Address
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </main>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Address"
        message="Are you sure?"
        onConfirm={handleConfirmDeleteAddress}
        onCancel={() => setDeleteModal({ isOpen: false, addressId: null })}
      />
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
      <AlertModal
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, isOpen: false })}
      />
    </div>
  );
}
