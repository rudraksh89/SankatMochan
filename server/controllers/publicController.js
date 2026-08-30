import User from "../models/User.js";
import MedicalProfile from "../models/MedicalProfile.js";
import EmergencyContact from "../models/EmergencyContact.js";
import Insurance from "../models/Insurance.js";
import PatientDocument from "../models/PatientDocument.js";

// =====================================================
// GET PUBLIC EMERGENCY CARD
// =====================================================

export const getEmergencyCard = async (req, res) => {
  try {
    const { userId } = req.params;

    // =================================================
    // FIND PATIENT
    // =================================================

    const user = await User.findById(userId).select(
      "fullName phone email"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // MEDICAL PROFILE
    // =================================================

    const profile = await MedicalProfile.findOne({
      user: userId,
    });

    // =================================================
    // EMERGENCY CONTACT
    // =================================================

    const contact = await EmergencyContact.findOne({
      user: userId,
    });

    // =================================================
    // CHECK VERIFIED RESPONDER
    // =================================================

    const isVerifiedResponder =
      req.user &&
      req.user.accountType === "responder" &&
      req.user.isVerified === true &&
      req.user.verificationStatus === "approved";

    // =================================================
    // BASIC INFORMATION
    // EVERYONE CAN SEE
    // =================================================

    const emergencyCard = {
      fullName: user.fullName,

      bloodGroup: profile?.bloodGroup || "",

      emergencyContact: contact,

      accessLevel: isVerifiedResponder
        ? "verified_responder"
        : "public",
    };

    // =================================================
    // VERIFIED RESPONDER INFORMATION
    // =================================================

    if (isVerifiedResponder) {

      // -----------------------------------------------
      // FULL MEDICAL PROFILE
      // -----------------------------------------------

      emergencyCard.medicalProfile = {
        dateOfBirth:
          profile?.dateOfBirth || null,

        gender:
          profile?.gender || "",

        height:
          profile?.height || 0,

        weight:
          profile?.weight || 0,

        allergies:
          profile?.allergies || "",

        medicalConditions:
          profile?.medicalConditions || "",

        medications:
          profile?.medications || "",

        organDonor:
          profile?.organDonor || false,

        address:
          profile?.address || "",
      };

      // -----------------------------------------------
      // CONTACT
      // -----------------------------------------------

      emergencyCard.phone = user.phone;
      emergencyCard.email = user.email;

      // -----------------------------------------------
      // INSURANCE
      // -----------------------------------------------

      emergencyCard.insurance =
        await Insurance.findOne({
          user: userId,
        }).sort({
          createdAt: -1,
        });

      // -----------------------------------------------
      // MEDICAL DOCUMENTS
      // -----------------------------------------------

      const documents =
        await PatientDocument.find({
          user: userId,
        })
          .select(
            "_id documentType fileName fileUrl publicId resourceType createdAt"
          )
          .sort({
            createdAt: -1,
          });

      console.log("=================================");
      console.log("EMERGENCY CARD");
      console.log("QR USER ID:", userId);
      console.log("DOCUMENT COUNT:", documents.length);
      console.log("DOCUMENTS:", documents);
      console.log("=================================");

      emergencyCard.documents = documents;
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      emergencyCard,
    });

  } catch (error) {
    console.error(
      "GET EMERGENCY CARD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET AI TRIAGE ADVICE
// =====================================================
import { generateAITriageAdvice } from "../services/aiService.js";

export const getAITriageAdvice = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("fullName");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profile = await MedicalProfile.findOne({ user: userId });

    const triageAdvice = await generateAITriageAdvice({
      fullName: user.fullName,
      bloodGroup: profile?.bloodGroup || "",
      allergies: profile?.allergies || "",
      medicalConditions: profile?.medicalConditions || "",
      medications: profile?.medications || "",
      organDonor: profile?.organDonor || false,
      gender: profile?.gender || "",
    });

    return res.status(200).json({
      success: true,
      triageAdvice,
    });
  } catch (error) {
    console.error("GET AI TRIAGE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};