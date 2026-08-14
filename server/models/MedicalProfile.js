import mongoose from "mongoose";

const medicalProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bloodGroup: {
      type: String,
      default: "",
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },

    height: {
      type: Number,
      default: 0,
    },

    weight: {
      type: Number,
      default: 0,
    },

    allergies: {
      type: String,
      default: "",
    },

    medicalConditions: {
      type: String,
      default: "",
    },

    medications: {
      type: String,
      default: "",
    },

    organDonor: {
      type: Boolean,
      default: false,
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

export default mongoose.model("MedicalProfile", medicalProfileSchema);