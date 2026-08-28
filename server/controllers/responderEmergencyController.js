import ResponderEmergency from "../models/ResponderEmergency.js";
import User from "../models/User.js";
import MedicalProfile from "../models/MedicalProfile.js";
import EmergencyContact from "../models/EmergencyContact.js";
import Insurance from "../models/Insurance.js";
import PatientDocument from "../models/PatientDocument.js";


// =====================================================
// GET EMERGENCY INFORMATION
// ONLY VERIFIED RESPONDERS
// =====================================================

export const getEmergencyInformation = async (req, res) => {
  try {
    const { userId } = req.params;

    // =================================================
    // CHECK VERIFIED RESPONDER
    // =================================================

    if (
      !req.user ||
      req.user.accountType !== "responder" ||
      req.user.isVerified !== true ||
      req.user.verificationStatus !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only verified responders can access emergency information",
      });
    }

    // =================================================
    // FIND PATIENT
    // =================================================

    const patient = await User.findById(userId).select(
      "fullName email phone"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // =================================================
    // MEDICAL PROFILE
    // =================================================

    const medicalProfile = await MedicalProfile.findOne({
      user: userId,
    });

    // =================================================
    // EMERGENCY CONTACT
    // =================================================

    const emergencyContact = await EmergencyContact.findOne({
      user: userId,
    });

    const emergencyContacts = emergencyContact
      ? [emergencyContact]
      : [];

    // =================================================
    // INSURANCE
    // =================================================

    const insurance = await Insurance.find({
      user: userId,
    });

    // =================================================
    // PATIENT MEDICAL DOCUMENTS
    // =================================================

    const documents = await PatientDocument.find({
      user: userId,
    })
      .select(
        "documentType fileName fileUrl resourceType createdAt"
      )
      .sort({
        createdAt: -1,
      });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      patient,

      medicalProfile,

      emergencyContacts,

      insurance,

      documents,
    });

  } catch (error) {
    console.error(
      "GET EMERGENCY INFORMATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// ACKNOWLEDGE EMERGENCY
// =====================================================

export const acknowledgeEmergency = async (req, res) => {
  try {
    const { userId } = req.params;

    const victim = await User.findById(userId).select(
      "-password"
    );

    if (!victim) {
      return res.status(404).json({
        success: false,
        message: "Victim not found",
      });
    }

    const existing = await ResponderEmergency.findOne({
      victim: userId,
      responder: req.user._id,
      status: {
        $in: ["acknowledged", "responding"],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "You have already acknowledged this emergency",
        emergency: existing,
      });
    }

    const emergency = await ResponderEmergency.create({
      victim: userId,
      responder: req.user._id,
      status: "acknowledged",
    });

    return res.status(201).json({
      success: true,
      message: "Emergency acknowledged",
      emergency,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// MARK RESPONDING
// =====================================================

export const markResponding = async (req, res) => {
  try {
    const { id } = req.params;

    const emergency =
      await ResponderEmergency.findOne({
        _id: id,
        responder: req.user._id,
      });

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency response not found",
      });
    }

    if (emergency.status !== "acknowledged") {
      return res.status(400).json({
        success: false,
        message:
          "Emergency cannot be marked as responding",
      });
    }

    emergency.status = "responding";
    emergency.respondedAt = new Date();

    await emergency.save();

    return res.status(200).json({
      success: true,
      message:
        "You are now responding to this emergency",
      emergency,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// COMPLETE EMERGENCY
// =====================================================

export const completeEmergency = async (req, res) => {
  try {
    const { id } = req.params;

    const emergency =
      await ResponderEmergency.findOne({
        _id: id,
        responder: req.user._id,
      });

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: "Emergency response not found",
      });
    }

    if (emergency.status !== "responding") {
      return res.status(400).json({
        success: false,
        message:
          "Only a responding emergency can be completed",
      });
    }

    emergency.status = "completed";
    emergency.completedAt = new Date();

    if (req.body.notes) {
      emergency.notes = req.body.notes;
    }

    await emergency.save();

    return res.status(200).json({
      success: true,
      message: "Emergency marked as completed",
      emergency,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET MY ACTIVE RESPONSES
// =====================================================

export const getMyResponses = async (req, res) => {
  try {
    const emergencies =
      await ResponderEmergency.find({
        responder: req.user._id,
        status: {
          $in: ["acknowledged", "responding"],
        },
      })
        .populate(
          "victim",
          "fullName phone accountType"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      emergencies,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};