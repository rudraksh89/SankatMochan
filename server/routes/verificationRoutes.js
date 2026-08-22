import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import {
  getMyVerification,
  uploadVerificationDocument,
  getPendingVerifications,
  reviewVerification,
} from "../controllers/verificationController.js";

const router = express.Router();

// =====================================================
// RESPONDER ROUTES
// =====================================================

// Get own verification status
router.get(
  "/me",
  protect,
  getMyVerification
);

// Upload verification document
router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadVerificationDocument
);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Get pending verification requests
router.get(
  "/admin/pending",
  protect,
  adminOnly,
  getPendingVerifications
);

// Approve / reject
router.put(
  "/admin/review/:id",
  protect,
  adminOnly,
  reviewVerification
);

export default router;