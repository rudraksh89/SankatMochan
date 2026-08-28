import express from "express";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

// All document operations require logged-in user
router.use(protect);

// Upload
router.post(
  "/",
  upload.single("document"),
  uploadDocument
);

// Get my documents
router.get(
  "/",
  getDocuments
);

// Delete my document
router.delete(
  "/:id",
  deleteDocument
);

export default router;