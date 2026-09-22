import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { KeyRound, Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully!");
        navigate("/login");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired OTP code.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-slate-700 shadow-2xl"
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-500">
            <KeyRound size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Verify OTP & Set Password
        </h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          Enter the 6-digit OTP code sent to your email and your new password.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              6-Digit OTP Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="123456"
                required
                className={`w-full bg-slate-900 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none text-sm tracking-widest font-mono transition-all ${
                  errorMsg
                    ? "border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500 text-red-200"
                    : "border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                }`}
              />
            </div>
            {errorMsg && (
              <div className="mt-2 p-2.5 bg-red-950/70 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-300 text-xs font-medium animate-fadeIn">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            {loading ? "Updating..." : (
              <>
                <CheckCircle2 size={18} /> Update Password
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
