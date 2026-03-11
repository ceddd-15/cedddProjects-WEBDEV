import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import "../styles/Login.css";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData);
      alert("Login Successfully.");
    } catch (error) {
      setErrors({ error: error.message });
    }
  };

  return (
    <Card title="Welcome Back">
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          required
        />
        <Button type="submit" loading={loading}>
          Login
        </Button>

        <p className="auth-link">
          Don't have an account? <a href=""> Register here.</a>
        </p>
      </form>
    </Card>
  );
};

export default Login;
