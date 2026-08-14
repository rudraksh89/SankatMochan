import MedicalProfile from "../models/MedicalProfile.js";

// ==============================
// Create Medical Profile
// ==============================

export const createMedicalProfile = async (req, res) => {
  try {
    const existingProfile = await MedicalProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Medical profile already exists",
      });
    }

    const profile = await MedicalProfile.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Medical profile created successfully",
      profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Get Medical Profile
// ==============================

export const getMedicalProfile = async (req, res) => {
  try {

    let profile = await MedicalProfile.findOne({
      user: req.user._id,
    });

    // Return empty profile instead of 404
    if (!profile) {
      profile = {
        bloodGroup: "",
        dateOfBirth: "",
        gender: "Male",
        height: "",
        weight: "",
        allergies: "",
        medicalConditions: "",
        medications: "",
        organDonor: false,
        address: "",
      };
    }

    res.status(200).json({
      success: true,
      profile,
      user: {
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==============================
// Update Medical Profile
// ==============================

export const updateMedicalProfile = async (req, res) => {
  try {

    const profile = await MedicalProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: req.body,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Medical profile saved successfully",
      profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};