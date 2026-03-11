import { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { useAuth } from "../../contexts/AuthContext";

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors.error) setErrors({});
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ error: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      alert("Registration successful. You can now log in.");
    } catch (error) {
      setErrors({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {errors.error && (
        <div className="alert-error" role="alert">
          {errors.error}
        </div>
      )}
      <Input
        label="UserName"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="Enter your full name"
        required
      />
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
        placeholder="Create a password"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
        required
      />
      <Button type="submit" loading={loading}>
        Register
      </Button>
    </form>
  );
};

export default RegisterComponent;
