import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useLoading } from "../contexts/LoadingContext";
import "../styles/shop/Header.css";
import "../styles/ConfirmModal.css";
import { productService } from "../services/shopService";
import logo from "../imageAssets/cycling_icon.png";
import searchIcon from "../imageAssets/search_icon.png";
import { ConfirmModal } from "./ConfirmModal";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { startLoading, stopLoading } = useLoading();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightIndex(-1);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const data = await productService.getProducts({
          search: query,
          limit: 5,
        });
        const products = data?.products || data || [];
        setSuggestions(Array.isArray(products) ? products : []);
        setShowSuggestions(true);
        setHighlightIndex(-1);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const handleSuggestionClick = (item) => {
    const name = item?.name || item?.title || String(item);
    setQuery(name);
    setShowSuggestions(false);
    setHighlightIndex(-1);
    navigate(`/shop?search=${encodeURIComponent(name)}`);
  };

  const handleLogout = async () => {
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

  const handleKeyDown = (e) => {
    const isInputFocused =
      document.activeElement?.classList.contains("search-input");

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        if (!showSuggestions) {
          setShowSuggestions(true);
        }
        setHighlightIndex((idx) => Math.min(idx + 1, suggestions.length - 1));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setShowSuggestions(true);
        setHighlightIndex((idx) => Math.max(idx - 1, 0));
      }
    } else if (e.key === "Enter") {
      if (
        highlightIndex >= 0 &&
        suggestions[highlightIndex] &&
        showSuggestions &&
        isInputFocused
      ) {
        e.preventDefault();
        handleSuggestionClick(suggestions[highlightIndex]);
      } else if (query.trim()) {
        navigate(`/shop?search=${encodeURIComponent(query)}`);
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    } else if (e.key === "Tab" && highlightIndex >= 0 && showSuggestions) {
      handleSuggestionClick(suggestions[highlightIndex]);
    }
  };

  const handleInputBlur = (e) => {
    setTimeout(() => {
      if (!e.relatedTarget?.closest(".search-suggestions")) {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      }
    }, 150);
  };

  return (
    <header className="header">
      <div className="header-main">
        <Link to="/" className="logo">
          <img src={logo} alt="CedCycles Logo" className="logo-icon" />
          <span className="logo-text">CedCycles</span>
        </Link>

        <div className="search-box">
          <input
            id="search-input"
            name="search"
            type="text"
            className="search-input"
            placeholder="Search for bike parts, accessories..."
            value={typeof query === "string" ? query : ""}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            autoComplete="off"
          />
          <button
            className="search-btn"
            onClick={(e) => {
              const input = e.target.previousSibling;
              if (input.value) {
                navigate(`/shop?search=${input.value}`);
              }
            }}
          >
            <img src={searchIcon} alt="Search" className="search-icon-img" />
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <ul
              className="search-suggestions"
              role="listbox"
              aria-label="Search suggestions"
            >
              {suggestions.map((s, idx) => (
                <li
                  key={s._id || s.id || s.name || idx}
                  role="option"
                  aria-selected={highlightIndex === idx}
                  className={`suggestion-item ${highlightIndex === idx ? "highlight" : ""}`}
                  onMouseDown={() => handleSuggestionClick(s)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                >
                  {s.images?.[0] ? (
                    <img
                      src={s.images[0]}
                      alt={s.name}
                      className="suggestion-image"
                    />
                  ) : (
                    <div className="suggestion-image-placeholder">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21,15 16,10 5,21" />
                      </svg>
                    </div>
                  )}
                  <div className="suggestion-content">
                    <span className="suggestion-name">{s.name}</span>
                    {s.price && (
                      <span className="suggestion-price">
                        ${s.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="header-actions">
          <Link to="/shop" className="header-action">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Shop</span>
          </Link>

          <Link to="/cart" className="header-action">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="header-action">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{user.username}</span>
              </button>
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-header-avatar">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="dropdown-header-name">{user.username}</div>
                  <div className="dropdown-header-email">{user.email}</div>
                </div>
                <Link to="/profile" className="dropdown-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  My Profile
                </Link>
                <Link to="/orders" className="dropdown-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  My Orders
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="dropdown-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Admin Panel
                  </Link>
                )}
                <button className="dropdown-item" onClick={handleLogout}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="header-action">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10,17 15,12 10,7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      <nav className="header-nav">
        <div className="header-nav-inner">
          <Link to="/shop?category=frames" className="nav-link">
            Frames
          </Link>
          <Link to="/shop?category=wheels" className="nav-link">
            Wheels
          </Link>
          <Link to="/shop?category=groupsets" className="nav-link">
            Groupsets
          </Link>
          <Link to="/shop?category=components" className="nav-link">
            Components
          </Link>
          <Link to="/shop?category=accessories" className="nav-link">
            Accessories
          </Link>
          <Link to="/shop?category=clothing" className="nav-link">
            Clothing
          </Link>
          <Link to="/shop?category=parts" className="nav-link">
            Parts
          </Link>
        </div>
      </nav>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </header>
  );
}
