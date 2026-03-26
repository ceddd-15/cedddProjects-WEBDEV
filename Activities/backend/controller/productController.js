import Product from "../models/Product.js";
import slugify from "slugify";

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;
    
    const query = { isActive: true };
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "popular") sortOption = { sold: -1 };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query),
    ]);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, originalPrice, category, brand, images, stock } = req.body;
    
    const slug = slugify(name, { lower: true, strict: true });
    
    const product = new Product({
      name,
      slug,
      description,
      price,
      originalPrice,
      category,
      brand,
      images,
      stock,
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ sold: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
