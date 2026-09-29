import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // 1. Send OTP to Registered Email
  // ==========================================
  const handleSendOtp = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please enter your New Password and Confirm Password first");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      setSendOtpLoading(true);
      const res = await api.post("/auth/send-password-change-otp", {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setOtpSent(true);
      setCountdown(60); // 60s resend cooldown

      toast.success(
        res.data?.message || "6-digit OTP code sent to your registered email!"
      );
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send OTP code. Please try again."
      );
    } finally {
      setSendOtpLoading(false);
    }
  };

  // ==========================================
  // 2. Submit Password Change with OTP
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("New password and confirm password are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (!formData.otp || formData.otp.trim().length !== 6) {
      toast.error("Please click 'Send Email OTP' and enter the 6-digit code received in your email");
      return;
    }

    try {
      setSaving(true);

      const res = await api.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
        otp: formData.otp.trim(),
      });

      toast.success(
        res.data?.message || "Password updated successfully!"
      );

      // Clear form on success
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
      setOtpSent(false);
      setCountdown(0);
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update password. Invalid or expired OTP code."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Security & Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Update your account password using 2-Factor Email OTP verification
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Current Password <span className="text-xs font-normal text-slate-400">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition cursor-pointer"
              title={showCurrentPassword ? "Hide Password" : "Show Password"}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password (min. 6 characters)"
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition cursor-pointer"
              title={showNewPassword ? "Hide Password" : "Show Password"}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition cursor-pointer"
              title={showConfirmPassword ? "Hide Password" : "Show Password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* OTP Entry Section — ALWAYS Visible for direct verification */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <KeyRound size={18} />
              <label className="text-xs font-bold uppercase tracking-wider">
                6-Digit Email OTP Verification Code <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Send / Resend OTP Action Button */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendOtpLoading || countdown > 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              {sendOtpLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Send size={14} />
              )}
              <span>
                {sendOtpLoading
                  ? "Sending Code..."
                  : countdown > 0
                  ? `Resend Code in ${countdown}s`
                  : otpSent
                  ? "Resend Email OTP"
                  : "Send Email OTP Code"}
              </span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              name="otp"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={formData.otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData((prev) => ({ ...prev, otp: val }));
              }}
              placeholder="● ● ● ● ● ●"
              className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-amber-500/60 dark:border-amber-500/40 rounded-xl px-4 py-3 text-xl font-mono font-bold tracking-[0.4em] text-center text-amber-600 dark:text-amber-400 placeholder-slate-300 dark:placeholder-slate-700 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click <strong>"Send Email OTP Code"</strong> to receive your 6-digit code via email, then enter it above.
          </p>
        </div>

        {/* Final Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span>
              {saving ? "Verifying & Updating..." : "Verify OTP & Update Password"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;