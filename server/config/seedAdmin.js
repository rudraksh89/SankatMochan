import User from "../models/User.js";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@sankatmochan.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
    let admin = await User.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (!admin) {
      admin = await User.create({
        fullName: "System Administrator",
        email: adminEmail,
        password: hashedPassword,
        phone: "9999999999",
        accountType: "normal",
        role: "admin",
        isVerified: true,
        verificationStatus: "not_required",
      });

      console.log(`👑 Created System Admin account (${adminEmail})`);
    } else {
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isVerified = true;
      admin.verificationStatus = "not_required";
      await admin.save();

      console.log(`👑 Verified/Updated System Admin account (${adminEmail})`);
    }
  } catch (error) {
    console.error("❌ Failed to seed admin account:", error.message);
  }
};

export default seedAdmin;
