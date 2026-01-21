import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

//Middleware
userSchema.pre("save", async function (next) {
  //short circuiting
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); //salt
});

export default mongoose.model("User", userSchema);
