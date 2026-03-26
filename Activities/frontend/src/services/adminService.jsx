const API_URL = "http://localhost:3000/api/admin";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const adminService = {
  async getDashboard() {
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard");
    return response.json();
  },

  async getProducts() {
    const response = await fetch(`${API_URL}/products`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async createProduct(data) {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  async updateProduct(id, data) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return response.json();
  },

  async deleteProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return response.json();
  },

  async getOrders() {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  async updateOrderStatus(id, status) {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update order");
    return response.json();
  },

  async getUsers() {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  },

  async updateUserRole(id, role) {
    const response = await fetch(`${API_URL}/users/${id}/role`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error("Failed to update user");
    return response.json();
  },

  async deleteUser(id) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return response.json();
  },
};
