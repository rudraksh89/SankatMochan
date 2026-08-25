import ResponderEmergency from "../models/ResponderEmergency.js";
import User from "../models/User.js";


// =====================================================
// ACKNOWLEDGE EMERGENCY
// =====================================================

export const acknowledgeEmergency = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check victim exists
    const victim = await User.findById(userId).select(
      "-password"
    );

    if (!victim) {
      return res.status(404).json({
        success: false,
        message: "Victim not found",
      });
    }

    // Prevent duplicate active response
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

    res.status(201).json({
      success: true,
      message: "Emergency acknowledged",
      emergency,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
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

    res.status(200).json({
      success: true,
      message: "You are now responding to this emergency",
      emergency,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
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

    res.status(200).json({
      success: true,
      message: "Emergency marked as completed",
      emergency,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
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

    res.status(200).json({
      success: true,
      emergencies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};