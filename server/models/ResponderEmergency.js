import mongoose from "mongoose";

const responderEmergencySchema = new mongoose.Schema(
  {
    victim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "acknowledged",
        "responding",
        "completed",
        "cancelled",
      ],
      default: "acknowledged",
    },

    location: {
      latitude: {
        type: Number,
        default: null,
      },

      longitude: {
        type: Number,
        default: null,
      },
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ResponderEmergency",
  responderEmergencySchema
);