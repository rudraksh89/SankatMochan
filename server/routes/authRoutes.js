import express from "express";

import {
  sendRegisterOtp,
  verifyRegisterOtp,
  register,
  login,
  getMe,
  updateAccount,
  sendPasswordChangeOtp,
  changePassword,
  deleteAccount,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-register-otp", sendRegisterOtp);
router.post("/verify-register-otp", verifyRegisterOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", protect, getMe);
router.put("/update", protect, updateAccount);
router.post("/send-password-change-otp", protect, sendPasswordChangeOtp);
router.put("/change-password", protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

export default router;