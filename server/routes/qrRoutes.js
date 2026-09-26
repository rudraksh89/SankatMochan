import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  generateQRCode,
  getQRScanHistory,
  clearQRScanHistory,
  deleteQRScanHistoryItem,
} from "../controllers/qrController.js";

const router = express.Router();

router.get("/", protect, generateQRCode);
router.get("/history", protect, getQRScanHistory);
router.delete("/history", protect, clearQRScanHistory);
router.delete("/history/:id", protect, deleteQRScanHistoryItem);

export default router;