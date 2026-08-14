import EmergencyContact from "../models/EmergencyContact.js";

// =======================
// Create Emergency Contact
// =======================

export const createEmergencyContact = async (req, res) => {
  try {
    const existing = await EmergencyContact.findOne({
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Emergency contact already exists",
      });
    }

    const contact = await EmergencyContact.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Emergency contact created successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Emergency Contact
// =======================

export const getEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findOne({
      user: req.user._id,
    });

    // New user -> return empty array instead of 404
    if (!contact) {
      return res.status(200).json({
        success: true,
        contacts: [],
      });
    }

    res.status(200).json({
      success: true,
      contacts: [contact],
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
    let contact = await EmergencyContact.findOne({
      user: req.user._id,
    });

    // Create if it doesn't exist
    if (!contact) {
      contact = await EmergencyContact.create({
        user: req.user._id,
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        message: "Emergency contact created successfully",
        contact,
      });
    }

    Object.assign(contact, req.body);

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Emergency contact updated successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};