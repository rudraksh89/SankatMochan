import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import { sendEmail, getOtpHtmlTemplate } from "../utils/sendEmail.js";

// ================= SEND REGISTER OTP =================

export const sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please log in.",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Otp collection
    await Otp.deleteMany({ email: email.toLowerCase() });
    await Otp.create({
      email: email.toLowerCase(),
      otp,
    });

    console.log(`\n==================================================`);
    console.log(`🔑 [SANKAT MOCHAN] REGISTRATION OTP FOR ${email}: ${otp}`);
    console.log(`==================================================\n`);

    // Send email notification
    const emailResult = await sendEmail({
      to: email,
      subject: "Sankat Mochan - Account Registration Verification OTP",
      html: getOtpHtmlTemplate(otp, "Account Registration Verification"),
      text: `Your Sankat Mochan registration verification OTP is ${otp}. It will expire in 15 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: emailResult?.devFallback
        ? "Verification OTP generated! (SMTP pending in .env - OTP printed to server terminal)"
        : "Verification OTP code sent to your email address",
    });
  } catch (error) {
    console.error("SEND REGISTER OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= VERIFY REGISTER OTP =================

export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit OTP code are required",
      });
    }

    const validOtp = await Otp.findOne({
      email: email.toLowerCase(),
      otp: otp.trim(),
    });

    if (!validOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please check your email or request a new OTP.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email address verified successfully!",
    });
  } catch (error) {
    console.error("VERIFY REGISTER OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= REGISTER =================

export const register = async (req, res) => {
  console.log("Register API Hit");
  console.log(req.body);

  try {
    const {
      fullName,
      email,
      password,
      phone,
      otp,
      accountType,
      profession,
      organization,
      professionalId,
      adminSecret,
      role,
    } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Verification OTP code is required",
      });
    }

    // Verify OTP code
    const validOtp = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
    });

    if (!validOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please request a new verification OTP.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    if (
      accountType &&
      !["normal", "responder"].includes(accountType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type",
      });
    }

    const finalAccountType = accountType || "normal";

    // Responder details are required
    if (finalAccountType === "responder") {
      if (!profession || !organization || !professionalId) {
        return res.status(400).json({
          success: false,
          message:
            "Profession, organization and professional ID are required for responders",
        });
      }
    }

    // Check for admin role creation via secret
    const expectedSecret = process.env.ADMIN_SECRET || "SankatMochanAdmin2026";
    const isAdminRequested = role === "admin" || Boolean(adminSecret);

    if (isAdminRequested && adminSecret !== expectedSecret) {
      return res.status(403).json({
        success: false,
        message: "Invalid Admin Secret Key",
      });
    }

    const userRole = isAdminRequested ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: userRole,

      accountType: finalAccountType,

      profession:
        finalAccountType === "responder"
          ? profession
          : "",

      organization:
        finalAccountType === "responder"
          ? organization
          : "",

      professionalId:
        finalAccountType === "responder"
          ? professionalId
          : "",

      verificationStatus:
        userRole === "admin"
          ? "not_required"
          : finalAccountType === "responder"
            ? "not_submitted"
            : "not_required",

      isVerified: userRole === "admin" ? true : false,
    });

    // Delete verified OTP
    await Otp.deleteMany({ email: email.toLowerCase() });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,

      message:
        finalAccountType === "responder"
          ? "Registration successful. Please submit your verification documents."
          : "Registration Successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        profession: user.profession,
        organization: user.organization,
        professionalId: user.professionalId,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= LOGIN =================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        profession: user.profession,
        organization: user.organization,
        professionalId: user.professionalId,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= GET ME =================

export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};


// ================= UPDATE ACCOUNT =================

export const updateAccount = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      city,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      user.email = email;
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (city) user.city = city;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account updated successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        city: user.city,
        accountType: user.accountType,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("UPDATE ACCOUNT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= SEND PASSWORD CHANGE OTP =================

export const sendPasswordChangeOtp = async (req, res) => {
  try {
    const user = req.user || (await User.findById(req.user?._id || req.user?.id));

    if (!user || !user.email) {
      return res.status(404).json({
        success: false,
        message: "User account or email address not found",
      });
    }

    const { newPassword, confirmPassword } = req.body || {};

    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "New passwords do not match",
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Otp collection (keyed by user's email)
    const userEmail = user.email.toLowerCase().trim();
    await Otp.deleteMany({ email: userEmail });
    await Otp.create({
      email: userEmail,
      otp,
    });

    console.log(`\n==================================================`);
    console.log(`🔑 [SANKAT MOCHAN] PASSWORD CHANGE OTP FOR ${userEmail}: ${otp}`);
    console.log(`==================================================\n`);

    // Send email safely
    let emailResult = { devFallback: true };
    try {
      emailResult = await sendEmail({
        to: userEmail,
        subject: "Sankat Mochan - Password Change Verification OTP",
        html: getOtpHtmlTemplate(otp, "Password Change Verification"),
        text: `Your Sankat Mochan password change verification OTP is ${otp}. It will expire in 15 minutes.`,
      });
    } catch (emailErr) {
      console.error("[SMTP DELIVERY WARN]", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: emailResult?.devFallback
        ? "Verification OTP generated! (SMTP pending - OTP printed to server terminal)"
        : "Verification OTP sent to your registered email",
    });
  } catch (error) {
    console.error("SEND PASSWORD CHANGE OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send OTP code",
    });
  }
};


// ================= CHANGE PASSWORD (OTP-verified) =================

export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, otp } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!otp || otp.trim().length !== 6) {
      return res.status(400).json({
        success: false,
        message: "A valid 6-digit OTP code is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify OTP from the Otp collection
    const validOtp = await Otp.findOne({
      email: user.email.toLowerCase(),
      otp: otp.trim(),
    });

    if (!validOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code. Please request a new OTP.",
      });
    }

    // OTP valid — update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Clean up used OTP
    await Otp.deleteMany({ email: user.email.toLowerCase() });

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= DELETE ACCOUNT =================

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Import related models dynamically to avoid circular deps
    const { default: MedicalProfile } = await import("../models/MedicalProfile.js");
    const { default: EmergencyContact } = await import("../models/EmergencyContact.js");
    const { default: Insurance } = await import("../models/Insurance.js");
    const { default: QRScanHistory } = await import("../models/QRScanHistory.js");
    const { default: PatientDocument } = await import("../models/PatientDocument.js");

    // Purge all user data across collections
    await Promise.all([
      User.findByIdAndDelete(userId),
      MedicalProfile.deleteMany({ userId }),
      EmergencyContact.deleteMany({ userId }),
      Insurance.deleteMany({ userId }),
      QRScanHistory.deleteMany({ userId }),
      PatientDocument.deleteMany({ userId }),
      Otp.deleteMany({ email: user.email.toLowerCase() }),
    ]);

    console.log(`🗑️ [SANKAT MOCHAN] Account permanently deleted: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Account and all associated data permanently deleted",
    });
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= FORGOT PASSWORD =================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email address",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetOtp = otp;
    user.resetOtpExpires = expiresAt;
    await user.save();

    console.log(`\n==================================================`);
    console.log(`🔑 [SANKAT MOCHAN] PASSWORD RESET OTP FOR ${email}: ${otp}`);
    console.log(`==================================================\n`);

    // Send email notification
    const emailResult = await sendEmail({
      to: email,
      subject: "Sankat Mochan - Password Reset Verification OTP",
      html: getOtpHtmlTemplate(otp, "Password Reset Verification"),
      text: `Your Sankat Mochan password reset OTP is ${otp}. It will expire in 15 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: emailResult?.devFallback
        ? "Verification OTP generated! (SMTP pending in .env - OTP printed to server terminal)"
        : "Verification OTP code sent to your registered email address",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= RESET PASSWORD =================

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

