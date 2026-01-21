import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 3000;
dotenv.config();

// get -> display name, var name = "ced",
// post -> logic, if username = "ced" password = "123" success else failed

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is runnning on PORT: ${PORT}`);
});
