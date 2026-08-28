import mongoose from "mongoose";

const patientDocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentType: {
      type: String,
      enum: [
        "prescription",
        "medical_report",
        "blood_report",
        "scan_report",
        "discharge_summary",
        "other",
      ],
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      default: "auto",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PatientDocument",
  patientDocumentSchema
);