import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { productService } from "../services/shopService";
import "../styles/shop/Landing.css";

export default function Landing() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const data = await productService.getFeaturedProducts();
      setFeaturedProducts(data);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <section className="hero-section">
        <div className="hero-content">
          <h1>Premium Bike Parts & Accessories</h1>
          <p>
            Your one-stop shop for high-quality cycling components. From frames
            to accessories, we've got everything you need.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="hero-btn primary">
              Shop Now
            </Link>
            <Link to="/shop?category=frames" className="hero-btn secondary">
              Browse Frames
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product.slug}`}
                  className="product-card"
                >
                  <div className="product-image">
                    <img
                      src={
                        product.images?.[0] || "https://via.placeholder.com/400"
                      }
                      alt={product.name}
                    />
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="product-discount">
                          {Math.round(
                            (1 - product.price / product.originalPrice) * 100,
                          )}
                          % OFF
                        </span>
                      )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div>
                      <span className="product-price">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="product-original-price">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="product-meta">
                      <span className="product-sold">
                        {product.sold || 0} sold
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {[
              { name: "Frames", category: "frames" },
              { name: "Wheels", category: "wheels" },
              { name: "Groupsets", category: "groupsets" },
              { name: "Components", category: "components" },
              { name: "Accessories", category: "accessories" },
              { name: "Clothing", category: "clothing" },
              { name: "Parts", category: "parts" },
            ].map((cat) => (
              <Link
                key={cat.category}
                to={`/shop?category=${cat.category}`}
                className="category-card-landing"
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over $500</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure checkout</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Dedicated customer care</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>CedCycles</h3>
              <p>Your trusted source for premium bike parts and accessories.</p>
            </div>
            <div className="footer-links">
              <h4>Shop</h4>
              <Link to="/shop?category=frames">Frames</Link>
              <Link to="/shop?category=wheels">Wheels</Link>
              <Link to="/shop?category=groupsets">Groupsets</Link>
            </div>
            <div className="footer-links">
              <h4>Support</h4>
              <Link to="#">Contact Us</Link>
              <Link to="#">FAQs</Link>
              <Link to="#">Shipping Info</Link>
            </div>
            <div className="footer-links">
              <h4>Account</h4>
              <Link to="/profile">My Profile</Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/cart">Cart</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 CedCycles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
