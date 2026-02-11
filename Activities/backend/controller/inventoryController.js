import Product from "../models/Product.js";
import mongoose from "mongoose";

export const create = async (req, res) => {
  try {
    const { name, slug, description, price } = req.body;
    const productExists = await Product.findOne({ slug });

    if (productExists)
      return res.status(400).json({ message: "Product already exists." });

    const product = await Product.create({ name, slug, description, price });
    res.status(201).json({ message: "Product listing successfully.", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { objectId } = req.params;
    const { name, slug, description, price } = req.body;
    const productExists = await Product.findOne({ slug });
    if (!productExists) {
      return res.status(404).json({ message: "Product does not exists." });
    }

    const productFields = {
      name,
      slug,
      description,
      price,
      updatedAt: new Date(),
    };

    const product = await Product.updateOne(
      { _id: mongoose.Types.ObjectId(objectId) },
      { $set: productFields },
    );
    res.status(200).json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// successfully created 201
// redirection 300
// 400 series client error, 401 authorization, 403 forbidden, 404 resource not found
// 500 internal server error server error
