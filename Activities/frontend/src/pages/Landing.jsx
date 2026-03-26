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
              { name: "Frames", icon: "🚴", category: "frames" },
              { name: "Wheels", icon: "⚫", category: "wheels" },
              { name: "Groupsets", icon: "⚙️", category: "groupsets" },
              { name: "Components", icon: "🔧", category: "components" },
              { name: "Accessories", icon: "🧢", category: "accessories" },
              { name: "Clothing", icon: "👕", category: "clothing" },
              { name: "Parts", icon: "🔩", category: "parts" },
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

      <style>{`
        .hero-section {
          background: linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
        }
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-content h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 20px;
        }
        .hero-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 30px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        .hero-btn {
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .hero-btn.primary {
          background: white;
          color: var(--primary);
        }
        .hero-btn.primary:hover {
          background: #f5f5f5;
          transform: translateY(-2px);
        }
        .hero-btn.secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }
        .hero-btn.secondary:hover {
          background: rgba(255,255,255,0.1);
        }
        .categories-section {
          padding: 60px 0;
          background: white;
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }
        .category-card-landing {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px 16px;
          background: var(--bg-gray);
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .category-card-landing:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          background: white;
        }
        .category-icon {
          font-size: 2rem;
        }
        .category-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        .features-section {
          padding: 60px 0;
          background: var(--bg-gray);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
        }
        .feature-item {
          text-align: center;
        }
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }
        .feature-item h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .feature-item p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .footer {
          background: #1a1a1a;
          color: white;
          padding: 60px 0 20px;
        }
        .footer-content {
          display: grid;
          grid-template-columns: 2fr repeat(3, 1fr);
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-brand h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
        }
        .footer-brand p {
          color: #888;
          line-height: 1.6;
        }
        .footer-links h4 {
          font-size: 1rem;
          margin-bottom: 16px;
          color: white;
        }
        .footer-links a {
          display: block;
          color: #888;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        .footer-links a:hover {
          color: white;
        }
        .footer-bottom {
          padding-top: 20px;
          border-top: 1px solid #333;
          text-align: center;
          color: #666;
          font-size: 0.85rem;
        }
        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }
          .hero-actions {
            flex-direction: column;
          }
          .footer-content {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}
