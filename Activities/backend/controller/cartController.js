import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    
    if (!cart) {
      return res.json({ items: [], total: 0 });
    }
    
    const validItems = cart.items.filter(item => item.product !== null);
    const total = validItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    res.json({ items: validItems, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }
    
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    const validItems = populatedCart.items.filter(item => item.product !== null);
    const total = validItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    res.json({ items: validItems, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }
    
    item.quantity = quantity;
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    const validItems = populatedCart.items.filter(item => item.product !== null);
    const total = validItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    res.json({ items: validItems, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    const validItems = populatedCart.items.filter(item => item.product !== null);
    const total = validItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    res.json({ items: validItems, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ items: [], total: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
