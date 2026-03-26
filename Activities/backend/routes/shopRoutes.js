import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  getCategories,
  getFeaturedProducts,
} from "../controller/productController.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cartController.js";
import {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
} from "../controller/orderController.js";
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controller/userController.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/featured", getFeaturedProducts);
router.get("/products/categories", getCategories);
router.get("/products/slug/:slug", getProductBySlug);
router.get("/products/:id", getProduct);
router.post("/products", authenticate, createProduct);

router.get("/cart", authenticate, getCart);
router.post("/cart", authenticate, addToCart);
router.put("/cart", authenticate, updateCartItem);
router.delete("/cart/:productId", authenticate, removeFromCart);
router.delete("/cart", authenticate, clearCart);

router.post("/orders", authenticate, createOrder);
router.get("/orders", authenticate, getOrders);
router.get("/orders/:id", authenticate, getOrder);
router.put("/orders/:id/cancel", authenticate, cancelOrder);

router.get("/user/profile", authenticate, getProfile);
router.put("/user/profile", authenticate, updateProfile);
router.post("/user/addresses", authenticate, addAddress);
router.put("/user/addresses/:addressId", authenticate, updateAddress);
router.delete("/user/addresses/:addressId", authenticate, deleteAddress);
router.put("/user/addresses/:addressId/default", authenticate, setDefaultAddress);

export default router;
