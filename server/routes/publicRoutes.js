import express from "express";
import { getEmergencyCard, getAITriageAdvice } from "../controllers/publicController.js";
import optionalProtect from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

router.get("/ai-triage/:userId", optionalProtect, getAITriageAdvice);
router.get("/:userId", optionalProtect, getEmergencyCard);

export default router;