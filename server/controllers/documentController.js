import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import PatientDocument from "../models/PatientDocument.js";

// =====================================================
// UPLOAD DOCUMENT
// =====================================================

export const uploadDocument = async (req, res) => {
  try {
    // -----------------------------------------------
    // CHECK FILE
    // -----------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // -----------------------------------------------
    // CHECK DOCUMENT TYPE
    // -----------------------------------------------

    const allowedTypes = [
      "prescription",
      "medical_report",
      "blood_report",
      "scan_report",
      "discharge_summary",
      "other",
    ];

    const { documentType } = req.body;

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: "Document type is required",
      });
    }

    if (!allowedTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document type",
      });
    }

    // -----------------------------------------------
    // UPLOAD TO CLOUDINARY
    // -----------------------------------------------

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "SankatMochan/Documents",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });
    };

    const result = await streamUpload();

    // -----------------------------------------------
    // SAVE DOCUMENT IN MONGODB
    // -----------------------------------------------

    const document = await PatientDocument.create({
      user: req.user._id,
      documentType: documentType,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });

    console.log("=================================");
    console.log("DOCUMENT UPLOADED");
    console.log("USER ID:", req.user._id);
    console.log("DOCUMENT ID:", document._id);
    console.log("DOCUMENT TYPE:", document.documentType);
    console.log("FILE:", document.fileName);
    console.log("=================================");

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });

  } catch (error) {
    console.error(
      "UPLOAD DOCUMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET MY DOCUMENTS
// =====================================================

export const getDocuments = async (req, res) => {
  try {
    const documents = await PatientDocument.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      documents,
    });

  } catch (error) {
    console.error(
      "GET DOCUMENTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE MY DOCUMENT
// =====================================================

export const deleteDocument = async (req, res) => {
  try {
    const document = await PatientDocument.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // -----------------------------------------------
    // DELETE FROM CLOUDINARY
    // -----------------------------------------------

    await cloudinary.uploader.destroy(
      document.publicId,
      {
        resource_type: document.resourceType,
      }
    );

    // -----------------------------------------------
    // DELETE FROM MONGODB
    // -----------------------------------------------

    await document.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE DOCUMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};