import User from "../models/User.js";
import MedicalProfile from "../models/MedicalProfile.js";
import EmergencyContact from "../models/EmergencyContact.js";
import Insurance from "../models/Insurance.js";
import MedicalDocument from "../models/MedicalDocument.js";

export const getEmergencyCard = async (req, res) => {
  try {
    const { userId } = req.params;

    // ==========================================
    // PERSON WHOSE QR IS BEING SCANNED
    // ==========================================

    const user = await User.findById(userId).select(
      "fullName phone email"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // GET MEDICAL PROFILE
    // ==========================================

    const profile = await MedicalProfile.findOne({
      user: userId,
    });

    // ==========================================
    // GET EMERGENCY CONTACT
    // ==========================================

    const contact = await EmergencyContact.findOne({
      user: userId,
    });

    // ==========================================
    // CHECK WHO IS SCANNING
    // ==========================================

    const isVerifiedResponder =
      req.user &&
      req.user.accountType === "responder" &&
      req.user.isVerified === true &&
      req.user.verificationStatus === "approved";

    // ==========================================
    // BASIC INFORMATION
    // EVERYONE CAN SEE THIS
    // ==========================================

    const emergencyCard = {
      fullName: user.fullName,

      bloodGroup: profile?.bloodGroup || "",

      emergencyContact: contact,

      accessLevel: isVerifiedResponder
        ? "verified_responder"
        : "public",
    };

    // ==========================================
    // FULL INFORMATION
    // ONLY VERIFIED RESPONDERS
    // ==========================================

    if (isVerifiedResponder) {

      // ========================================
      // FULL MEDICAL PROFILE
      // ========================================

      emergencyCard.medicalProfile = {
        dateOfBirth: profile?.dateOfBirth || null,

        gender: profile?.gender || "",

        height: profile?.height || 0,

        weight: profile?.weight || 0,

        allergies: profile?.allergies || "",

        medicalConditions:
          profile?.medicalConditions || "",

        medications:
          profile?.medications || "",

        organDonor:
          profile?.organDonor || false,

        address:
          profile?.address || "",
      };

      // ========================================
      // PATIENT CONTACT INFORMATION
      // ========================================

      emergencyCard.phone = user.phone;

      emergencyCard.email = user.email;

      // ========================================
      // INSURANCE
      // ========================================

      const insurance = await Insurance.findOne({
        user: userId,
      }).sort({
        createdAt: -1,
      });

      emergencyCard.insurance = insurance;

      // ========================================
      // MEDICAL DOCUMENTS
      // ========================================

      const documents = await MedicalDocument.find({
        user: userId,
      })
        .select(
          "_id documentType fileName fileUrl resourceType createdAt"
        )
        .sort({
          createdAt: -1,
        });

      emergencyCard.documents = documents;
    }

    // ==========================================
    // RESPONSE
    // ==========================================

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