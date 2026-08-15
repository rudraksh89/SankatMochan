import express from "express";

import {
  register,
  login,
  getMe,
  updateAccount,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);

router.put("/update", protect, updateAccount);

router.put("/change-password", protect, changePassword);

router.delete("/delete-account", protect, deleteAccount);

export default router;