export const generateQRCode = async (req, res) => {
  try {
    console.log("========== QR CONTROLLER ==========");
    console.log("CLIENT_URL:", process.env.CLIENT_URL);
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
    console.log("USER ID:", req.user._id);

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
};