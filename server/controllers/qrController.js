import crypto from "crypto";
import { generateQRCodeDataURL } from "../utils/generateQR.js";
import User from "../models/User.js";
import MedicalProfile from "../models/MedicalProfile.js";
import EmergencyContact from "../models/EmergencyContact.js";

export const generateQRCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";

    const user = await User.findById(userId).select("fullName phone");
    const profile = await MedicalProfile.findOne({ user: userId });
    const contacts = await EmergencyContact.find({ user: userId }).sort({ isPrimary: -1, createdAt: 1 });

    const primaryContact = contacts[0];
    const secondaryContact = contacts[1];

    // Compact signed emergency payload for offline scanner reading
    const compactPayload = {
      fn: user?.fullName || "Citizen",
      bg: profile?.bloodGroup || "",
      al: profile?.allergies || "None",
      mc: profile?.medicalConditions || "None",
      ice: primaryContact?.phone || user?.phone || "",
      ice1: primaryContact ? `${primaryContact.contactName} (${primaryContact.relationship}): ${primaryContact.phone}` : "",
      ice2: secondaryContact ? `${secondaryContact.contactName} (${secondaryContact.relationship}): ${secondaryContact.phone}` : "",
      od: profile?.organDonor || false,
      ts: Date.now(),
    };

    const secret = process.env.JWT_SECRET || "sankat_mochan_secret";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(compactPayload))
      .digest("hex")
      .slice(0, 10);

    const signedData = { ...compactPayload, sig: signature };
    const base64Data = Buffer.from(JSON.stringify(signedData)).toString("base64url");

    const emergencyUrl = `${clientUrl}/emergency/${userId}?data=${base64Data}`;
    const qrDataUrl = await generateQRCodeDataURL(emergencyUrl);

    res.status(200).json({
      success: true,
      userId,
      emergencyUrl,
      qrDataUrl,
      offlinePayload: signedData,
      encodedData: base64Data,
    });
  } catch (error) {
    console.error("QR ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};