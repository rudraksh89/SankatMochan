import User from "../models/User.js";
import MedicalProfile from "../models/MedicalProfile.js";
import EmergencyContact from "../models/EmergencyContact.js";
import Insurance from "../models/Insurance.js";

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
    // GET BASIC INFORMATION
    // ==========================================

    const profile = await MedicalProfile.findOne({
      user: userId,
    });

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
    // BASIC INFORMATION (everyone sees this)
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
    // FULL MEDICAL DETAILS
    // ONLY FOR VERIFIED RESPONDERS
    // ==========================================

    if (isVerifiedResponder) {
      // Full medical profile
      emergencyCard.medicalProfile = {
        dateOfBirth: profile?.dateOfBirth || null,
        gender: profile?.gender || "",
        height: profile?.height || 0,
        weight: profile?.weight || 0,
        allergies: profile?.allergies || "",
        medicalConditions:
          profile?.medicalConditions || "",
        medications: profile?.medications || "",
        organDonor: profile?.organDonor || false,
        address: profile?.address || "",
      };

      // Patient contact info
      emergencyCard.phone = user.phone;
      emergencyCard.email = user.email;

      // Insurance
      const insurance = await Insurance.findOne({
        user: userId,
      });

      emergencyCard.insurance = insurance;
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,
      emergencyCard,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};