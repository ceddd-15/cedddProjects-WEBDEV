import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["frames", "wheels", "groupsets", "components", "accessories", "clothing", "parts"],
    },
    brand: {
      type: String,
    },
    images: [{
      type: String,
    }],
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
