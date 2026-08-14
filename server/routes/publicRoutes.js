import express from "express";
import { getEmergencyCard } from "../controllers/publicController.js";

const router = express.Router();

router.get("/:userId", getEmergencyCard);

export default router;