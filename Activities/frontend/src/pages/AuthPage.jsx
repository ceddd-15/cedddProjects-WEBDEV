import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import "../styles/AuthPage.css";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const navigate = useNavigate();

  // Login state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const { login } = useAuth();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginErrors({});
    setLoginLoading(true);
    try {
      await login(loginData);
      // Redirect to home/dashboard after login
      navigate("/");
    } catch (err) {
      setLoginErrors({ error: err?.message ?? "Login failed." });
    } finally {
      setLoginLoading(false);
    }
  };

  // Register state
  const [regData, setRegData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);
  const { register } = useAuth();

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    // Basic client-side validations
    if (regData.password !== regData.confirmPassword) {
      setRegErrors({ confirmPassword: "Passwords do not match." });
      return;
    }
    setRegErrors({});
    setRegLoading(true);
    try {
      await register({ name: regData.name, email: regData.email, password: regData.password });
      // After successful registration, switch to login mode
      setMode("login");
      // Optionally, switch focus or show a message
    } catch (err) {
      setRegErrors({ error: err?.message ?? "Registration failed." });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="auth-page-container" aria-label="Authentication page">
      <div className="auth-toggle">
        <button
          className={`seg-btn ${mode === "login" ? "active" : ""}`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={`seg-btn ${mode === "register" ? "active" : ""}`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      {mode === "login" ? (
        <Card title="Welcome Back">
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <Input
              label="Email"
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              error={loginErrors.email}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              error={loginErrors.password}
              placeholder="Enter your password"
              required
            />
            <Button type="submit" loading={loginLoading}>
              Login
            </Button>
            {loginErrors.error && <p className="error-message">{loginErrors.error}</p>}
            <p className="auth-link">
              Don't have an account? <button type="button" onClick={() => setMode("register")}>Register here.</button>
            </p>
          </form>
        </Card>
      ) : (
        <Card title="Create an account">
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <Input
              label="Name"
              type="text"
              name="name"
              value={regData.name}
              onChange={handleRegChange}
              error={regErrors.name}
              placeholder="Enter your name"
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={regData.email}
              onChange={handleRegChange}
              error={regErrors.email}
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={regData.password}
              onChange={handleRegChange}
              error={regErrors.password}
              placeholder="Enter your password"
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={regData.confirmPassword}
              onChange={handleRegChange}
              error={regErrors.confirmPassword}
              placeholder="Confirm your password"
              required
            />
            <Button type="submit" loading={regLoading}>
              Register
            </Button>
            {regErrors.error && <p className="error-message">{regErrors.error}</p>}
          </form>
        </Card>
      )}
    </div>
  );
}
