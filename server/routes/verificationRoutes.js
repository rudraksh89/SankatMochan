import express from "express";

import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

import {
  uploadVerificationDocument,
  getMyVerification,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
} from "../controllers/verificationController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// Responder
router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadVerificationDocument
);


// Responder
router.get(
  "/me",
  protect,
  getMyVerification
);


// Admin
router.get(
  "/pending",
  protect,
  adminOnly,
  getPendingVerifications
);


// Admin
router.put(
  "/:id/approve",
  protect,
  adminOnly,
  approveVerification
);


// Admin
router.put(
  "/:id/reject",
  protect,
  adminOnly,
  rejectVerification
);


export default router;