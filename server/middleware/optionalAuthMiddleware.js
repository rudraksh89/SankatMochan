import jwt from "jsonwebtoken";
import User from "../models/User.js";

const optionalProtect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token is okay for public QR access
    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find logged-in user
    const user = await User.findById(decoded.id).select(
      "-password"
    );

    // Invalid user/token -> treat as public visitor
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;

    next();

  } catch (error) {
    // Invalid/expired token should NOT break QR access
    req.user = null;
    next();
  }
};

export default optionalProtect;