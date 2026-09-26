import mongoose from "mongoose";

const qrScanHistorySchema = new mongoose.Schema(
  {
    scannedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    scannerName: {
      type: String,
      default: "Anonymous First Responder",
      trim: true,
    },

    scannerRole: {
      type: String,
      enum: ["responder", "citizen", "anonymous", "admin"],
      default: "anonymous",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    deviceType: {
      type: String,
      default: "Mobile Browser",
    },

    location: {
      type: String,
      default: "",
    },

    scannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("QRScanHistory", qrScanHistorySchema);
