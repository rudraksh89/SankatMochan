import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import MedicalDocument from "../models/MedicalDocument.js";


// ==============================
// Upload Document
// ==============================

export const uploadDocument = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "SankatMochan/Documents",
            resource_type: "auto",
          },
          (error, result) => {

            if (result) resolve(result);
            else reject(error);

          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);

      });

    const result = await streamUpload();

    const document = await MedicalDocument.create({
      user: req.user._id,
      documentType: req.body.documentType,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ==============================
// Get Documents
// ==============================

export const getDocuments = async (req, res) => {
  try {

    const documents = await MedicalDocument.find({
      user: req.user._id,
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



// ==============================
// Delete Document
// ==============================

export const deleteDocument = async (req, res) => {
  try {

    const document = await MedicalDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    await cloudinary.uploader.destroy(document.publicId, {
      resource_type: document.resourceType,
    });

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};