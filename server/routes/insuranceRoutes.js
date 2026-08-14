import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createInsurance,
  getInsurance,
  updateInsurance,
} from "../controllers/insuranceController.js";

const router = express.Router();

router.post("/", protect, createInsurance);

router.get("/", protect, getInsurance);

router.put("/", protect, updateInsurance);

export default router;