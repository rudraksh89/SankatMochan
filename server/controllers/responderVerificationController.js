import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

import ResponderVerification from "../models/ResponderVerification.js";
import User from "../models/User.js";


// ==========================================
// UPLOAD VERIFICATION DOCUMENT
// ==========================================

export const uploadVerificationDocument = async (req, res) => {
  try {

    // Only responder can upload
    if (req.user.accountType !== "responder") {
      return res.status(403).json({
        success: false,
        message: "Only responders can submit verification documents",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a document",
      });
    }

    const {
      documentType,
    } = req.body;

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: "Document type is required",
      });
    }


    // Check existing verification
    const existing =
      await ResponderVerification.findOne({
        user: req.user._id,
      });

    // Don't allow upload while already approved
    if (
      existing &&
      existing.status === "approved"
    ) {
      return res.status(400).json({
        success: false,
        message: "Your account is already verified",
      });
    }


    // Upload to Cloudinary
    const streamUpload = () =>
      new Promise((resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "SankatMochan/ResponderVerification",

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


    let verification;


    // If rejected, allow re-upload
    if (existing) {

      existing.documentType =
        documentType;

      existing.fileName =
        req.file.originalname;

      existing.fileUrl =
        result.secure_url;

      existing.publicId =
        result.public_id;

      existing.resourceType =
        result.resource_type;

      existing.status =
        "pending";

      existing.adminRemark = "";

      existing.reviewedBy = null;

      existing.reviewedAt = null;

      verification =
        await existing.save();

    } else {

      verification =
        await ResponderVerification.create({
          user: req.user._id,

          documentType,

          fileName:
            req.file.originalname,

          fileUrl:
            result.secure_url,

          publicId:
            result.public_id,

          resourceType:
            result.resource_type,

          status: "pending",
        });

    }


    // Update user status
    await User.findByIdAndUpdate(
      req.user._id,
      {
        verificationStatus: "pending",
        isVerified: false,
      }
    );


    res.status(201).json({
      success: true,
      message:
        "Verification document submitted successfully. Waiting for admin approval.",

      verification,
    });

  } catch (error) {

    console.error(
      "VERIFICATION UPLOAD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================================
// GET MY VERIFICATION
// ==========================================

export const getMyVerification = async (
  req,
  res
) => {

  try {

    if (
      req.user.accountType !==
      "responder"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only responders can access verification",
      });
    }


    const verification =
      await ResponderVerification.findOne({
        user: req.user._id,
      });


    res.status(200).json({
      success: true,

      verification,

      user: {
        accountType:
          req.user.accountType,

        verificationStatus:
          req.user.verificationStatus,

        isVerified:
          req.user.isVerified,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ==========================================
// ADMIN - GET ALL VERIFICATIONS
// ==========================================

export const getAllVerifications = async (
  req,
  res
) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }


    const verifications =
      await ResponderVerification
        .find()
        .populate(
          "user",
          `
          fullName
          email
          phone
          accountType
          profession
          organization
          professionalId
          verificationStatus
          isVerified
          `
        )
        .sort({
          createdAt: -1,
        });


    res.status(200).json({
      success: true,
      verifications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ==========================================
// ADMIN - APPROVE
// ==========================================

export const approveVerification = async (
  req,
  res
) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }


    const verification =
      await ResponderVerification.findById(
        req.params.id
      );


    if (!verification) {
      return res.status(404).json({
        success: false,
        message:
          "Verification request not found",
      });
    }


    verification.status =
      "approved";

    verification.adminRemark =
      req.body.remark ||
      "Verification approved";

    verification.reviewedBy =
      req.user._id;

    verification.reviewedAt =
      new Date();


    await verification.save();


    const user =
      await User.findById(
        verification.user
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    user.isVerified = true;

    user.verificationStatus =
      "approved";


    await user.save();


    res.status(200).json({
      success: true,
      message:
        "Responder verified successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// ==========================================
// ADMIN - REJECT
// ==========================================

export const rejectVerification = async (
  req,
  res
) => {

  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }


    const verification =
      await ResponderVerification.findById(
        req.params.id
      );


    if (!verification) {
      return res.status(404).json({
        success: false,
        message:
          "Verification request not found",
      });
    }


    verification.status =
      "rejected";

    verification.adminRemark =
      req.body.remark ||
      "Verification rejected";

    verification.reviewedBy =
      req.user._id;

    verification.reviewedAt =
      new Date();


    await verification.save();


    const user =
      await User.findById(
        verification.user
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    user.isVerified = false;

    user.verificationStatus =
      "rejected";


    await user.save();


    res.status(200).json({
      success: true,
      message:
        "Verification rejected",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};