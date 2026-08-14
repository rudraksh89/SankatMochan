import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    provider: {
      type: String,
      default: "",
    },

    policyNumber: {
      type: String,
      default: "",
    },

    policyHolder: {
      type: String,
      default: "",
    },

    validTill: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Insurance", insuranceSchema);