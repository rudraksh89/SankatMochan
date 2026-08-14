import User from "../models/User.js";
import MedicalProfile from "../models/MedicalProfile.js";
import EmergencyContact from "../models/EmergencyContact.js";

export const getEmergencyCard = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("fullName");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await MedicalProfile.findOne({
      user: userId,
    });

    const contact = await EmergencyContact.findOne({
      user: userId,
    });

    res.status(200).json({
      success: true,
      emergencyCard: {
        fullName: user.fullName,
        bloodGroup: profile?.bloodGroup || "",
        allergies: profile?.allergies || "",
        medicalConditions: profile?.medicalConditions || "",
        medications: profile?.medications || "",
        emergencyContact: contact,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};