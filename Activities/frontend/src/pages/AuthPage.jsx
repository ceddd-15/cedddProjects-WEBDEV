import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/shop/Landing.css";
import logo from "../imageAssets/cycling_icon.png";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <img
            src={logo}
            alt="CedCycles Logo"
            className="logo-icon"
            style={{ width: "40px" }}
          />
          <span className="logo-text">CedCycles</span>
        </Link>

        <div className="auth-card">
          <form className="auth-form" onSubmit={handleLogin}>
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue shopping</p>

            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Processing..." : "Login"}
            </button>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --bg-gray: #f3f4f6;
          --border-color: #d1d5db;
          --error: #dc2626;
        }

        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: sans-serif;
        }
        .auth-container { width: 100%; max-width: 420px; }
        .auth-logo {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; font-size: 1.5rem; font-weight: 700;
          color: white; text-decoration: none; margin-bottom: 24px;
        }
        .auth-card { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .auth-form h2 { font-size: 1.5rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
        .auth-subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px; }
        .auth-error { background: rgba(220, 38, 38, 0.1); color: var(--error); padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 0.9rem; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.9rem; font-weight: 500; color: var(--text-primary); margin-bottom: 6px; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; }
        .password-input-wrapper { position: relative; }
        .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
        .auth-btn { width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 8px; }
        .auth-btn:hover { background: var(--primary-dark); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .auth-switch { text-align: center; margin-top: 20px; color: var(--text-secondary); font-size: 0.9rem; }
        .auth-switch a { color: var(--primary); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
}
