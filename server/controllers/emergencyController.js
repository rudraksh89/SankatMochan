import EmergencyContact from "../models/EmergencyContact.js";

// =======================
// Create Emergency Contact
// =======================

export const createEmergencyContact = async (req, res) => {
  try {
    const count = await EmergencyContact.countDocuments({
      user: req.user._id,
    });

    if (count >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 emergency contacts allowed per profile",
      });
    }

    const isFirst = count === 0;

    const contact = await EmergencyContact.create({
      user: req.user._id,
      isPrimary: isFirst || req.body.isPrimary || false,
      ...req.body,
    });

    if (req.body.isPrimary && !isFirst) {
      await EmergencyContact.updateMany(
        { user: req.user._id, _id: { $ne: contact._id } },
        { isPrimary: false }
      );
    }

    const contacts = await EmergencyContact.find({ user: req.user._id }).sort({ isPrimary: -1, createdAt: 1 });

    res.status(201).json({
      success: true,
      message: "Emergency contact created successfully",
      contact,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Emergency Contacts
// =======================

export const getEmergencyContact = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      user: req.user._id,
    }).sort({ isPrimary: -1, createdAt: 1 });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Update Emergency Contact
// =======================

export const updateEmergencyContact = async (req, res) => {
  try {
    const contactId = req.params.id || req.body._id;

    let contact;
    if (contactId) {
      contact = await EmergencyContact.findOne({
        _id: contactId,
        user: req.user._id,
      });
    } else {
      contact = await EmergencyContact.findOne({
        user: req.user._id,
      });
    }

    // Create if it doesn't exist at all
    if (!contact) {
      contact = await EmergencyContact.create({
        user: req.user._id,
        isPrimary: true,
        ...req.body,
      });
    } else {
      Object.assign(contact, req.body);
      await contact.save();
    }

    if (req.body.isPrimary) {
      await EmergencyContact.updateMany(
        { user: req.user._id, _id: { $ne: contact._id } },
        { isPrimary: false }
      );
    }

    const contacts = await EmergencyContact.find({ user: req.user._id }).sort({ isPrimary: -1, createdAt: 1 });

    res.status(200).json({
      success: true,
      message: "Emergency contact updated successfully",
      contact,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Delete Emergency Contact
// =======================

export const deleteEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await EmergencyContact.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Emergency contact not found",
      });
    }

    // If deleted contact was primary, make the first remaining contact primary
    if (contact.isPrimary) {
      const remaining = await EmergencyContact.findOne({ user: req.user._id }).sort({ createdAt: 1 });
      if (remaining) {
        remaining.isPrimary = true;
        await remaining.save();
      }
    }

    const contacts = await EmergencyContact.find({ user: req.user._id }).sort({ isPrimary: -1, createdAt: 1 });

    res.status(200).json({
      success: true,
      message: "Emergency contact deleted successfully",
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Trigger SOS Alert
// =======================
import EmergencyAlert from "../models/EmergencyAlert.js";

export const triggerSOSAlert = async (req, res) => {
  try {
    const { latitude, longitude, address, notes, victimUserId } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required for SOS alert",
      });
    }

    const alert = await EmergencyAlert.create({
      user: req.user?._id || victimUserId || null,
      latitude,
      longitude,
      address: address || "",
      notes: notes || "Emergency SOS broadcast triggered",
    });


    res.status(201).json({
      success: true,
      message: "Emergency SOS broadcasted successfully! Responders notified.",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get SOS Alerts
// =======================
export const getSOSAlerts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : { status: { $in: ["active", "dispatched"] } };

    const alerts = await EmergencyAlert.find(filter)
      .populate("user", "fullName phone email bloodGroup")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Update SOS Alert Status
// =======================
export const updateSOSStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "dispatched", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const alert = await EmergencyAlert.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "fullName phone email bloodGroup");

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "SOS alert not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `SOS alert status updated to ${status}`,
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};