import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 900, // Automatically expires after 15 minutes (900 seconds)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
