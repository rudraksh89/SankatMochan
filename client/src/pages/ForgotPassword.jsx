import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.success) {
        toast.success(res.data.message || "OTP sent successfully!");
        if (res.data.demoOtp) {
          toast(`Demo OTP Code: ${res.data.demoOtp}`, { icon: "🔑", duration: 8000 });
        }
        navigate("/verify-otp", { state: { email } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request password reset");
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
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500">
            <ShieldAlert size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Reset Password
        </h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          Enter your registered email address and we will send you a 6-digit OTP code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all disabled:opacity-50 text-sm flex items-center justify-center"
          >
            {loading ? "Sending OTP..." : "Send Verification OTP"}
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

export default ForgotPassword;
