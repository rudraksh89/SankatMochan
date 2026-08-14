import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createMedicalProfile,
  getMedicalProfile,
  updateMedicalProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/", protect, createMedicalProfile);

router.get("/", protect, getMedicalProfile);

router.put("/", protect, updateMedicalProfile);

export default router;