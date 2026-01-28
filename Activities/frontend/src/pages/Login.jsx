import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import "../styles/Login.css";
import { useState } from "react";

const Login = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState();
  return (
    <Card title="Welcome Back">
      <form className="login-form">
        <Input
          label="Email"
          type="email"
          name="email"
          error={errors.email}
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          error={errors.password}
          placeholder="Enter your password"
          required
        />
        <Button type="submit" loading={loading}>
          Login
        </Button>

        <p className="auth-link">
          Don't have an account? <a href="/register"> Register here.</a>
        </p>
      </form>
    </Card>
  );
};

export default Login;
