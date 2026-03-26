import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { AlertModal } from "../components/AlertModal.jsx";
import { productService } from "../services/shopService";
import { useCart } from "../contexts/CartContext";
import "../styles/shop/ProductDetail.css";
import "../styles/ConfirmModal.css";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const [modalStatus, setModalStatus] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductBySlug(slug);
      setProduct(data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      navigate("/shop");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product, quantity);
      setModalStatus({
        isOpen: true,
        title: "Success",
        message: `${product.name} added to cart!`,
      });
    } catch (error) {
      setModalStatus({
        isOpen: true,
        title: "Error",
        message: error.message,
      });
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setAdding(true);
      await addToCart(product, quantity);
      navigate("/checkout");
    } catch (error) {
      setModalStatus({
        isOpen: true,
        title: "Error",
        message: error.message,
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Header />
        <div className="empty-state">
          <h3>Product not found</h3>
        </div>
      </div>
    );
  }

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  return (
    <div>
      <Header />
      <div className="product-detail-page">
        <div className="product-gallery">
          <div className="product-main-image">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/500"}
              alt={product.name}
            />
          </div>
          {product.images?.length > 1 && (
            <div className="product-thumbnails">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`product-thumbnail ${idx === 0 ? "active" : ""}`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-header">
            {product.brand && (
              <div className="product-brand">{product.brand}</div>
            )}
            <h1 className="product-title">{product.name}</h1>
            <div className="product-sold-count">
              <span>{product.sold || 0} sold</span>
            </div>
          </div>

          <div className="product-price-section">
            <div className="price-label">Price</div>
            <div className="price-row">
              <span className="product-price-current">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="product-price-original">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="product-discount-badge">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="product-options">
            <div className="option-group">
              <label htmlFor="qty-input">
                Quantity <span>({product.stock} available)</span>
              </label>
              <div className="quantity-selector">
                <button
                  type="button"
                  className="qty-btn-large"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  id="qty-input"
                  name="quantity"
                  className="qty-input"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(product.stock, parseInt(e.target.value) || 1),
                      ),
                    )
                  }
                  min={1}
                  max={product.stock}
                />
                <button
                  type="button"
                  className="qty-btn-large"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  +
                </button>
              </div>
              <div
                className={`stock-info ${product.stock < 10 ? "low" : ""} ${product.stock === 0 ? "out" : ""}`}
              >
                {product.stock === 0
                  ? "Out of stock"
                  : product.stock < 10
                    ? `Only ${product.stock} left!`
                    : "In stock"}
              </div>
            </div>
          </div>

          <div className="product-actions">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || adding}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {adding ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={product.stock === 0 || adding}
            >
              Buy Now
            </button>
          </div>

          <div className="product-description-section">
            <h3 className="section-title-description">Product Description</h3>
            <p className="product-description">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={modalStatus.isOpen}
        title={modalStatus.title}
        message={modalStatus.message}
        onClose={() => setModalStatus({ ...modalStatus, isOpen: false })}
      />
    </div>
  );
}
