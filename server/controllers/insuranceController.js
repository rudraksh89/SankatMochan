import Insurance from "../models/Insurance.js";


// ==========================
// Create Insurance
// ==========================

export const createInsurance = async (req, res) => {
  try {

    const existing = await Insurance.findOne({
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Insurance already exists",
      });
    }

    const insurance = await Insurance.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      insurance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================
// Get Insurance
// ==========================

export const getInsurance = async (req, res) => {
  try {

    const insurance = await Insurance.findOne({
      user: req.user._id,
    });

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }

    res.status(200).json({
      success: true,
      insurance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// ==========================
// Update Insurance
// ==========================

export const updateInsurance = async (req, res) => {
  try {

    const insurance = await Insurance.findOne({
      user: req.user._id,
    });

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance not found",
      });
    }

    Object.assign(insurance, req.body);

    await insurance.save();

    res.status(200).json({
      success: true,
      message: "Insurance updated successfully",
      insurance,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};