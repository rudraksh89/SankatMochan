import User from "../models/User.js";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@sankatmochan.com";
    let admin = await User.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash("Admin@123456", 10);

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

      console.log("👑 Created default System Admin account (admin@sankatmochan.com / Admin@123456)");
    } else {
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isVerified = true;
      admin.verificationStatus = "not_required";
      await admin.save();

      console.log("👑 Verified/Updated default System Admin account (admin@sankatmochan.com / Admin@123456)");
    }
  } catch (error) {
    console.error("❌ Failed to seed admin account:", error.message);
  }
};

export default seedAdmin;
