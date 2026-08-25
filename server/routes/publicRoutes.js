import express from "express";
import { getEmergencyCard } from "../controllers/publicController.js";
import optionalProtect from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

router.get("/:userId", optionalProtect, getEmergencyCard);

export default router;