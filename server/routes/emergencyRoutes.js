import express from "express";
import protect from "../middleware/authMiddleware.js";
import optionalProtect from "../middleware/optionalAuthMiddleware.js";

import {
  createEmergencyContact,
  getEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  triggerSOSAlert,
  getSOSAlerts,
  updateSOSStatus,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.post("/", protect, createEmergencyContact);
router.get("/", protect, getEmergencyContact);
router.put("/", protect, updateEmergencyContact);
router.put("/:id", protect, updateEmergencyContact);
router.delete("/:id", protect, deleteEmergencyContact);

router.post("/sos", optionalProtect, triggerSOSAlert);
router.get("/sos-alerts", protect, getSOSAlerts);
router.put("/sos-alerts/:id", protect, updateSOSStatus);

export default router;