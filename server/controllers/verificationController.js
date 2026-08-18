import VerificationDocument from "../models/VerificationDocument.js";
import User from "../models/User.js";


// ========================================
// Upload Verification Document
// ========================================

export const uploadVerificationDocument = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.accountType !== "responder") {
      return res.status(403).json({
        success: false,
        message: "Only responders can submit verification documents",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Your account is already verified",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Verification document is required",
      });
    }

    const existingDocument = await VerificationDocument.findOne({
      user: user._id,
      status: "pending",
    });

    if (existingDocument) {
      return res.status(400).json({
        success: false,
        message: "You already have a verification request pending",
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

    /*
      req.file.path should contain the uploaded
      Cloudinary URL if you are using multer-storage-cloudinary.

      If your existing upload middleware uses a different
      property, change this line accordingly.
    */

    const fileUrl = req.file.path;

    const document = await VerificationDocument.create({
      user: user._id,
      documentType,
      fileUrl,
      fileName: req.file.originalname,
      status: "pending",
    });

    user.verificationStatus = "pending";

    await user.save();

    res.status(201).json({
      success: true,
      message: "Verification document submitted successfully",
      document,
    });

  } catch (error) {
    console.error("Verification upload error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Get My Verification Status
// ========================================

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

    const document = await VerificationDocument.findOne({
      user: user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      user: {
        accountType: user.accountType,
        profession: user.profession,
        organization: user.organization,
        professionalId: user.professionalId,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
      },
      document,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Admin: Get Pending Verifications
// ========================================

export const getPendingVerifications = async (req, res) => {
  try {
    const documents = await VerificationDocument.find({
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Admin: Approve
// ========================================

export const approveVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;

    const document = await VerificationDocument.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Verification document not found",
      });
    }

    if (document.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This document has already been reviewed",
      });
    }

    document.status = "approved";
    document.adminRemark = remark || "";
    document.reviewedBy = req.user._id;
    document.reviewedAt = new Date();

    await document.save();

    const user = await User.findById(document.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isVerified = true;
    user.verificationStatus = "approved";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Responder verified successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// Admin: Reject
// ========================================

export const rejectVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;

    const document = await VerificationDocument.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Verification document not found",
      });
    }

    if (document.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This document has already been reviewed",
      });
    }

    document.status = "rejected";
    document.adminRemark = remark || "";
    document.reviewedBy = req.user._id;
    document.reviewedAt = new Date();

    await document.save();

    const user = await User.findById(document.user);

    if (user) {
      user.isVerified = false;
      user.verificationStatus = "rejected";

      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Verification request rejected",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};