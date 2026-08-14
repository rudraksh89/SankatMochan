import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createEmergencyContact,
  getEmergencyContact,
  updateEmergencyContact,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.post("/", protect, createEmergencyContact);

router.get("/", protect, getEmergencyContact);

router.put("/", protect, updateEmergencyContact);

export default router;