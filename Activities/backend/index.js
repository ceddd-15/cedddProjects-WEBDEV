import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = 3000;
dotenv.config();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on PORT: ${PORT}`);
});
