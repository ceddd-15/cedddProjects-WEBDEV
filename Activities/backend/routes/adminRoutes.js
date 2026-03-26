import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import slugify from "slugify";

const router = express.Router();

router.use(authenticate);
router.use(authorizeAdmin);

router.get("/dashboard", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username email");

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        revenue: totalRevenue[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, brand, images, stock } = req.body;
    const product = new Product({
      name,
      slug: slugify(name, { lower: true }),
      description,
      price,
      originalPrice,
      category,
      brand,
      images: images || [],
      stock: stock || 0,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, brand, images, stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug: slugify(name, { lower: true }),
        description,
        price,
        originalPrice,
        category,
        brand,
        images,
        stock,
      },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "username email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "username email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
