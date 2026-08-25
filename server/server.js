import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cloudinary from "./config/cloudinary.js";
dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});