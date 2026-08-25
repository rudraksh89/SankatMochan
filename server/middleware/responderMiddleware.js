const responderOnly = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      user.accountType !== "responder" ||
      user.isVerified !== true ||
      user.verificationStatus !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only verified responders can access this feature",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default responderOnly;