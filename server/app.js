import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import insuranceRoutes from "./routes/insuranceRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";




const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://172.20.10.4:5173",
    ],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/verification", verificationRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Sankat Mochan API 🚑",
  });
});

export default app;