import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    console.log("========== QR ROUTE ==========");
    console.log("CLIENT_URL:", process.env.CLIENT_URL);
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

    const userId = req.user._id;

    const emergencyUrl =
      `${process.env.CLIENT_URL}/emergency/${userId}`;

    console.log("Generated Emergency URL:", emergencyUrl);

    res.status(200).json({
      success: true,
      userId,
      emergencyUrl,
    });

  } catch (error) {
    console.error("QR ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;