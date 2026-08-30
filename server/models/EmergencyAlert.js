import mongoose from "mongoose";

const emergencyAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "dispatched", "resolved"],
      default: "active",
    },
    notes: {
      type: String,
      default: "Emergency SOS triggered from mobile device",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("EmergencyAlert", emergencyAlertSchema);
