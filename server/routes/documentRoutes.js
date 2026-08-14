import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

// Upload Document
router.post(
  "/",
  protect,
  upload.single("document"),
  uploadDocument
);

// Get All Documents
router.get(
  "/",
  protect,
  getDocuments
);

// Delete Document
router.delete(
  "/:id",
  protect,
  deleteDocument
);

export default router;