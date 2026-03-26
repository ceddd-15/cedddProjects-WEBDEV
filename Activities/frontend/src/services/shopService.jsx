const API_URL = "http://localhost:3000/api/shop";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const productService = {
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/products?${queryString}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async getFeaturedProducts() {
    const response = await fetch(`${API_URL}/products/featured`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch featured products");
    return response.json();
  },

  async getProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  async getProductBySlug(slug) {
    const response = await fetch(`${API_URL}/products/slug/${slug}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  async getCategories() {
    const response = await fetch(`${API_URL}/products/categories`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  },
};

export const cartService = {
  async getCart() {
    const response = await fetch(`${API_URL}/cart`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch cart");
    return response.json();
  },

  async addToCart(productId, quantity = 1) {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) throw new Error("Failed to add to cart");
    return response.json();
  },

  async updateCartItem(productId, quantity) {
    const response = await fetch(`${API_URL}/cart`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    
    if (!response.ok) throw new Error("Failed to update cart");
    return response.json();
  },

  async removeFromCart(productId) {
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to remove from cart");
    return response.json();
  },

  async clearCart() {
    const response = await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to clear cart");
    return response.json();
  },
};

export const orderService = {
  async createOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create order");
    }
    return response.json();
  },

  async getOrders() {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  async getOrder(id) {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch order");
    return response.json();
  },

  async cancelOrder(id) {
    const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
      method: "PUT",
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to cancel order");
    return response.json();
  },
};

export const userService = {
  async getProfile() {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  },

  async updateProfile(data) {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
  },

  async addAddress(address) {
    const response = await fetch(`${API_URL}/user/addresses`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(address),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to add address" }));
      throw new Error(error.message);
    }
    return response.json();
  },

  async updateAddress(addressId, address) {
    const response = await fetch(`${API_URL}/user/addresses/${addressId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(address),
    });
    
    if (!response.ok) throw new Error("Failed to update address");
    return response.json();
  },

  async deleteAddress(addressId) {
    const response = await fetch(`${API_URL}/user/addresses/${addressId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to delete address");
    return response.json();
  },

  async setDefaultAddress(addressId) {
    const response = await fetch(`${API_URL}/user/addresses/${addressId}/default`, {
      method: "PUT",
      headers: getHeaders(),
    });
    
    if (!response.ok) throw new Error("Failed to set default address");
    return response.json();
  },
};
