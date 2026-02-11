import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import "../styles/Login.css";
import { useEffect, useState } from "react";
import TextArea from "../components/TextArea";
import slugify from "slugify";

const Inventory = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState();
  const [slug, setSlug] = useState("");

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
      alert("Product Page");
    } catch (error) {
      setErrors({ error: error.message });
    }
  };

  useEffect(() => {
    const generatedSlug = slugify(formData.name, {
      lower: true,
      trict: true,
    });
    setSlug(generatedSlug);
  }, [formData]);

  return (
    <Card title="Create Product">
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter product name"
          required
        />
        <Input
          label="Slug"
          type="text"
          name="slug"
          value={slug}
          onChange={handleChange}
          error={errors.slug}
          disabled
        />
        <TextArea
          label="Description"
          name="description"
          error={errors.description}
          rows={10}
          cols={40}
        />
        <Input
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          error={errors.price}
          onChange={handleChange}
        />
        <Button type="submit" loading={loading}>
          Save Product
        </Button>
      </form>
    </Card>
  );
};

export default Inventory;
