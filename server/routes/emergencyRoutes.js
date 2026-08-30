import express from "express";
import protect from "../middleware/authMiddleware.js";
import optionalProtect from "../middleware/optionalAuthMiddleware.js";

import {
  createEmergencyContact,
  getEmergencyContact,
  updateEmergencyContact,
  triggerSOSAlert,
  getSOSAlerts,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.post("/", protect, createEmergencyContact);
router.get("/", protect, getEmergencyContact);
router.put("/", protect, updateEmergencyContact);

router.post("/sos", optionalProtect, triggerSOSAlert);
router.get("/sos-alerts", protect, getSOSAlerts);

export default router;