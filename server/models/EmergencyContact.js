import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },

    contactName: {
      type: String,
      required: true,
    },

    relationship: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);