import rateLimit from "express-rate-limit";

// General API rate limiter (protects all endpoints from spam)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again later.",
  },
});

// Auth endpoints rate limiter (login / register / forgot-password / reset-password)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // 25 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests. Please try again after 15 minutes.",
  },
});

// Public Emergency Card & AI Triage rate limiter
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // 60 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Rate limit exceeded for public emergency card access.",
  },
});

// Emergency SOS trigger rate limiter (prevents SOS broadcast spam loops)
export const sosLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // 15 distress calls per 5 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "SOS broadcast limit reached for this device. Please wait a few minutes.",
  },
});
