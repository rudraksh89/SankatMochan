import User from "../models/User.js";
import MedicalDocument from "../models/MedicalDocument.js";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

// =====================================================
// GET MY VERIFICATION STATUS
// =====================================================

export const getMyVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const documents = await MedicalDocument.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,

        accountType: user.accountType,

        profession: user.profession,
        organization: user.organization,
        professionalId: user.professionalId,

        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
      },

      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPLOAD VERIFICATION DOCUMENT
// =====================================================

export const uploadVerificationDocument = async (
  req,
  res
) => {
  try {
    console.log("=================================");
    console.log("VERIFICATION UPLOAD HIT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user?._id);
    console.log("=================================");
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only responders can upload verification documents
    if (user.accountType !== "responder") {
      return res.status(403).json({
        success: false,
        message:
          "Only responder accounts can submit verification documents",
      });
    }

    // Already verified
    if (user.verificationStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "Your account is already verified",
      });
    }

    // ==============================
    // CLOUDINARY UPLOAD
    // ==============================

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder: "SankatMochan/Documents",
              resource_type: "auto",
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });

    const result = await streamUpload();

    // ==============================
    // SAVE DOCUMENT
    // ==============================

    const document = await MedicalDocument.create({
      user: req.user._id,

      documentType: req.body.documentType,

      fileName: req.file.originalname,

      fileUrl: result.secure_url,

      publicId: result.public_id,

      resourceType: result.resource_type,

      status: "pending",
    });

    // ==============================
    // UPDATE USER
    // ==============================

    user.verificationStatus = "pending";
    user.isVerified = false;

    await user.save();

    res.status(201).json({
      success: true,

      message:
        "Document submitted successfully. Waiting for admin verification.",

      document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN - GET PENDING VERIFICATIONS
// =====================================================

export const getPendingVerifications = async (
  req,
  res
) => {
  try {
    const documents = await MedicalDocument.find({
      status: "pending",
    })
      .populate(
        "user",
        "fullName email phone accountType profession organization professionalId"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN - REVIEW DOCUMENT
// =====================================================

export const reviewVerification = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      action,
      rejectionReason,
    } = req.body;

    // ==============================
    // VALIDATE ACTION
    // ==============================

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review action",
      });
    }

    // ==============================
    // FIND DOCUMENT
    // ==============================

    const document =
      await MedicalDocument.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ==============================
    // CHECK STATUS
    // ==============================

    if (document.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "This document has already been reviewed",
      });
    }

    // ==============================
    // FIND USER
    // ==============================

    const user = await User.findById(
      document.user
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // APPROVE
    // =================================================

    if (action === "approve") {
      document.status = "approved";

      document.reviewedBy = req.user._id;

      document.reviewedAt = new Date();

      document.rejectionReason = "";

      await document.save();

      // Make responder verified
      user.isVerified = true;

      user.verificationStatus = "approved";

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Responder verification approved",
      });
    }

    // =================================================
    // REJECT
    // =================================================

    if (action === "reject") {
      document.status = "rejected";

      document.reviewedBy = req.user._id;

      document.reviewedAt = new Date();

      document.rejectionReason =
        rejectionReason ||
        "Document rejected";

      await document.save();

      user.isVerified = false;

      user.verificationStatus = "rejected";

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "Responder verification rejected",
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};