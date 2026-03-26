import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Order from "./models/Order.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";

const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 299.99,
    stock: 50,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
  },
  {
    name: "Smart Fitness Watch",
    slug: "smart-fitness-watch",
    description: "Track your fitness goals with this smart watch",
    price: 199.99,
    stock: 100,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
  },
  {
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    description: "Comfortable chair for long work hours",
    price: 349.99,
    stock: 30,
    category: "Furniture",
    images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400"],
  },
  {
    name: "Minimalist Desk Lamp",
    slug: "minimalist-desk-lamp",
    description: "Modern LED desk lamp with adjustable brightness",
    price: 79.99,
    stock: 80,
    category: "Home",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"],
  },
  {
    name: "Wireless Mechanical Keyboard",
    slug: "wireless-mechanical-keyboard",
    description: "Professional mechanical keyboard with RGB lighting",
    price: 159.99,
    stock: 45,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400"],
  },
  {
    name: "Ceramic Plant Pot Set",
    slug: "ceramic-plant-pot-set",
    description: "Set of 3 minimalist ceramic pots for plants",
    price: 49.99,
    stock: 60,
    category: "Home",
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400"],
  },
  {
    name: "Leather Backpack",
    slug: "leather-backpack",
    description: "Genuine leather backpack with laptop compartment",
    price: 189.99,
    stock: 25,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
  },
  {
    name: "Yoga Mat Premium",
    slug: "yoga-mat-premium",
    description: "Non-slip yoga mat with carrying strap",
    price: 39.99,
    stock: 120,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared products");

    await Product.insertMany(sampleProducts);
    console.log("Seeded products");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();