import mongoose from "mongoose";

const verificationDocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentType: {
      type: String,
      required: true,
      enum: [
        "professional_id",
        "medical_license",
        "police_id",
        "government_id",
        "other",
      ],
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminRemark: {
      type: String,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "VerificationDocument",
  verificationDocumentSchema
);