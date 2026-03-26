import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, itemIds } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    let validItems = cart.items.filter(item => item.product !== null);
    
    if (itemIds && itemIds.length > 0) {
      validItems = validItems.filter(item => itemIds.includes(item.product._id.toString()));
    }
    
    if (validItems.length === 0) {
      return res.status(400).json({ message: "No valid items to order" });
    }
    
    for (const item of validItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }
    
    const subtotal = validItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    const shippingFee = subtotal >= 500 ? 0 : 50;
    const total = subtotal + shippingFee;
    
    const orderItems = validItems.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images?.[0] || "",
    }));
    
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingFee,
      total,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentMethod === "card" ? "paid" : "pending",
      status: "pending",
    });
    
    await order.save();
    
    for (const item of validItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }
    
    const orderedProductIds = validItems.map(item => item.product._id.toString());
    cart.items = cart.items.filter(item => !orderedProductIds.includes(item.product._id.toString()));
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }
    
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }
    
    order.status = "cancelled";
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
