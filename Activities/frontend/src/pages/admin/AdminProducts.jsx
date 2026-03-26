import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout.jsx";
import { adminService } from "../../services/adminService.jsx";
import { ConfirmModal } from "../../components/ConfirmModal.jsx";
import { AlertModal } from "../../components/AlertModal.jsx";
import searchIcon from "../../imageAssets/search_icon.png";

const initialForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "",
  brand: "",
  stock: "",
  images: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
  });
  const [alert, setAlert] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice) || 0,
        stock: parseInt(form.stock),
        images: form.images[0] ? [form.images[0]] : [],
      };

      if (editingId) {
        await adminService.updateProduct(editingId, productData);
        setAlert({
          isOpen: true,
          title: "Success",
          message: "Product updated successfully!",
        });
      } else {
        await adminService.createProduct(productData);
        setAlert({
          isOpen: true,
          title: "Success",
          message: "Product created successfully!",
        });
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      setAlert({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      brand: product.brand,
      stock: product.stock,
      images: product.images || [],
    });
    setEditingId(product._id);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ isOpen: true, productId: id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteModal.productId;
    setDeleteModal({ isOpen: false, productId: null });
    try {
      await adminService.deleteProduct(id);
      fetchProducts();
      setAlert({
        isOpen: true,
        title: "Deleted",
        message: "Product removed successfully.",
      });
    } catch (error) {
      setAlert({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="loading">Loading...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="admin-products">
        <div className="page-header">
          <div className="header-left">
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              + Add Product
            </button>
          </div>

          <div className="header-right">
            <div className="modern-search-wrapper">
              <input
                type="text"
                placeholder="Search for bike parts, accessories..."
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
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        <img
                          src={
                            product.images?.[0] ||
                            "https://via.placeholder.com/50"
                          }
                          alt={product.name}
                          className="product-thumb"
                        />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={product.stock < 10 ? "low-stock" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClick(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    No products found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
                <button className="modal-close" onClick={closeModal}>
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Discounted Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Original Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.originalPrice}
                      onChange={(e) =>
                        setForm({ ...form, originalPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <div className="image-input-wrapper">
                    <input
                      type="text"
                      value={form.images[0] || ""}
                      onChange={(e) =>
                        setForm({ ...form, images: [e.target.value] })
                      }
                      placeholder="https://..."
                    />
                    {form.images[0] && (
                      <div className="image-preview-container">
                        <span className="preview-label">Preview:</span>
                        <img
                          src={form.images[0]}
                          alt="Product preview"
                          className="admin-form-preview"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150?text=Invalid+URL";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModal({ isOpen: false, productId: null })}
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
