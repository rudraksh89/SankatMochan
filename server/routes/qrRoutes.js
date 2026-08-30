import express from "express";
import protect from "../middleware/authMiddleware.js";
import { generateQRCode } from "../controllers/qrController.js";

const router = express.Router();

router.get("/", protect, generateQRCode);

export default router;