import express from "express";

import protect from "../middleware/authMiddleware.js";
import responderOnly from "../middleware/responderMiddleware.js";

import {
  acknowledgeEmergency,
  markResponding,
  completeEmergency,
  getMyResponses,
} from "../controllers/responderEmergencyController.js";

const router = express.Router();


// =====================================================
// ALL ROUTES REQUIRE VERIFIED RESPONDER
// =====================================================

router.use(protect);
router.use(responderOnly);


// Get my active emergency responses

router.get(
  "/my",
  getMyResponses
);


// Acknowledge victim emergency

router.post(
  "/acknowledge/:userId",
  acknowledgeEmergency
);


// Mark response as active

router.put(
  "/responding/:id",
  markResponding
);


// Complete emergency

router.put(
  "/complete/:id",
  completeEmergency
);


export default router;