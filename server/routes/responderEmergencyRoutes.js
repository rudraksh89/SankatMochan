import express from "express";

import protect from "../middleware/authMiddleware.js";
import responderOnly from "../middleware/responderMiddleware.js";

import {
  acknowledgeEmergency,
  markResponding,
  completeEmergency,
  getMyResponses,
  getEmergencyInformation,
} from "../controllers/responderEmergencyController.js";

const router = express.Router();

// =====================================================
// ALL ROUTES REQUIRE PROTECTED VERIFIED RESPONDER
// =====================================================

router.use(protect);
router.use(responderOnly);

// =====================================================
// MY ACTIVE RESPONSES
// =====================================================

router.get(
  "/my",
  getMyResponses
);

// =====================================================
// ACKNOWLEDGE EMERGENCY
// =====================================================

router.post(
  "/acknowledge/:userId",
  acknowledgeEmergency
);

// =====================================================
// MARK RESPONDING
// =====================================================

router.put(
  "/responding/:id",
  markResponding
);

// =====================================================
// COMPLETE EMERGENCY
// =====================================================

router.put(
  "/complete/:id",
  completeEmergency
);

// =====================================================
// GET PATIENT EMERGENCY INFORMATION
// =====================================================

router.get(
  "/:userId",
  getEmergencyInformation
);

export default router;