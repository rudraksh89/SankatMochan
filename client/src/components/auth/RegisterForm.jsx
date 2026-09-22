import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, ShieldCheck, HeartPulse, ArrowRight, KeyRound, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";


import AuthCard from "./AuthCard";
import PasswordInput from "./PasswordInput";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [unverifiedAttempt, setUnverifiedAttempt] = useState(false);



  const [accountType, setAccountType] = useState("normal");
  const [adminSecret, setAdminSecret] = useState("");

  const [profession, setProfession] = useState("");
  const [organization, setOrganization] = useState("");
  const [professionalId, setProfessionalId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter a valid email address first.");
      return;
    }

    try {
      setSendingOtp(true);
      setIsOtpVerified(false);
      setOtpError("");
      setEmailError("");
      setUnverifiedAttempt(false);
      const res = await api.post("/auth/send-register-otp", { email });
      if (res.data.success) {
        setOtpSent(true);
        toast.success(res.data.message || "Verification OTP sent to your email!");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP email.";
      setEmailError(msg);
      toast.error(msg);
    } finally {
      setSendingOtp(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the full 6-digit OTP code.");
      toast.error("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    try {
      setVerifyingOtp(true);
      setOtpError("");
      const res = await api.post("/auth/verify-register-otp", { email, otp });
      if (res.data.success) {
        setIsOtpVerified(true);
        setOtpError("");
        setUnverifiedAttempt(false);
        toast.success("Email Verified Successfully! ✓");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid or expired OTP code. Please check your email.";
      setOtpError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setUnverifiedAttempt(true);
      toast.error("⚠️ Email Verification Required! Please verify your email before registering.");
      return;
    }



    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        fullName,
        email,
        phone,
        password,
        otp,
        accountType: accountType === "admin" ? "normal" : accountType,
        role: accountType === "admin" ? "admin" : "user",
        adminSecret: accountType === "admin" ? adminSecret : "",
        profession: accountType === "responder" ? profession : "",
        organization: accountType === "responder" ? organization : "",
        professionalId: accountType === "responder" ? professionalId : "",
      });

      toast.success(response.data.message || "Registration Successful!");
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center w-full my-4">
      <AuthCard>
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-3">
            <HeartPulse className="text-red-500 text-2xl animate-pulse" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Create Account
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Join the Sankat Mochan Lifesaving Network
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Unverified Registration Block Warning */}
          {unverifiedAttempt && !isOtpVerified && (
            <div className="p-3.5 bg-amber-950/70 border border-amber-500/60 rounded-xl flex items-start gap-3 text-amber-300 text-xs shadow-lg shadow-amber-950/50 animate-fadeIn">
              <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <strong className="block text-amber-200 text-sm mb-0.5">
                  Email Verification Required ⚠️
                </strong>
                You cannot complete registration without verifying your email address. Please click <strong className="text-white">Send OTP</strong>, check your inbox, and verify your email.
              </div>
            </div>
          )}

          {/* Email & OTP Section */}
          {isOtpVerified ? (
            /* Verified Green Card */
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl space-y-1 text-emerald-300 shadow-lg shadow-emerald-950/40 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Email Address
                </span>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                  <CheckCircle2 size={14} className="text-emerald-400 animate-pulse" /> Verified ✓
                </span>
              </div>
              <div className="text-sm font-semibold text-white tracking-wide">{email}</div>
              <button
                type="button"
                onClick={() => {
                  setIsOtpVerified(false);
                  setOtpSent(false);
                  setOtp("");
                  setOtpError("");
                }}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline pt-1 inline-block"
              >
                Change Email
              </button>
            </div>
          ) : (
            /* Email Input & Send OTP */
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-950/80 text-white placeholder:text-slate-500 outline-none transition-all duration-200 text-sm ${
                      emailError
                        ? "border-red-500 focus:border-red-400 ring-1 ring-red-500/40 text-red-200"
                        : unverifiedAttempt && !isOtpVerified
                        ? "border-amber-500/80 ring-2 ring-amber-500/20"
                        : "border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (otpSent) setOtpSent(false);
                      if (otpError) setOtpError("");
                      if (emailError) setEmailError("");
                    }}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !email}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl whitespace-nowrap transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>

              {/* Email Error / Already Registered Alert */}
              {emailError && (
                <div className="mt-2.5 p-2.5 bg-red-950/70 border border-red-500/50 rounded-xl flex items-center justify-between text-red-300 text-xs font-medium animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-400 shrink-0" />
                    <span>{emailError}</span>
                  </div>
                  {emailError.includes("already registered") && (
                    <Link to="/login" className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-bold whitespace-nowrap ml-2">
                      Sign In →
                    </Link>
                  )}
                </div>
              )}
            </div>

          )}

          {/* OTP Input & Verify Button (When OTP Sent but not yet verified) */}
          {otpSent && !isOtpVerified && (
            <div className={`p-3.5 rounded-xl space-y-2.5 animate-fadeIn border transition-all ${
              otpError ? "bg-red-950/30 border-red-500/60 shadow-lg shadow-red-950/30" : "bg-blue-950/40 border-blue-800/60"
            }`}>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Enter 6-Digit Email OTP
                </label>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> OTP Sent to Email
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-950 text-white placeholder:text-slate-500 outline-none text-sm tracking-widest font-mono transition-all ${
                      otpError
                        ? "border-red-500 focus:border-red-400 ring-1 ring-red-500/40 text-red-200"
                        : "border-blue-800/80 focus:border-blue-400"
                    }`}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (otpError) setOtpError("");
                    }}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || otp.length !== 6}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl whitespace-nowrap transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              {/* Invalid OTP Error Alert */}
              {otpError ? (
                <div className="p-2.5 bg-red-900/40 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-300 text-xs font-medium animate-fadeIn">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{otpError}</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Enter the 6-digit code sent to your email and click <strong className="text-emerald-400">Verify OTP</strong>.
                </p>
              )}
            </div>
          )}



          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create strong password"
            />
          </div>

          {/* Account Type Selector */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Account Type
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAccountType("normal")}
                className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${accountType === "normal"
                  ? "border-blue-500 bg-blue-600/15 text-white shadow-lg shadow-blue-500/10"
                  : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">👤 Citizen</span>
                  {accountType === "normal" && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                </div>
                <p className="text-[10px] opacity-70 mt-1">Regular Profile</p>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("responder")}
                className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${accountType === "responder"
                  ? "border-cyan-500 bg-cyan-600/15 text-white shadow-lg shadow-cyan-500/10"
                  : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">🛡️ Responder</span>
                  {accountType === "responder" && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                </div>
                <p className="text-[10px] opacity-70 mt-1">Doctor, EMT, Police</p>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("admin")}
                className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${accountType === "admin"
                  ? "border-purple-500 bg-purple-600/15 text-white shadow-lg shadow-purple-500/10"
                  : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">👑 Admin</span>
                  {accountType === "admin" && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                </div>
                <p className="text-[10px] opacity-70 mt-1">System Portal</p>
              </button>
            </div>
          </div>

          {/* Admin Fields */}
          {accountType === "admin" && (
            <div className="p-4 bg-purple-950/30 border border-purple-800/50 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-purple-800/50 pb-2">
                <ShieldCheck size={16} className="text-purple-400" />
                <h3 className="font-bold text-xs text-purple-200 uppercase tracking-wider">
                  Admin Authorization
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-purple-300 mb-1">
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  placeholder="Enter Admin Secret Key"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-purple-800/60 bg-slate-950 text-white outline-none focus:border-purple-500 text-sm"
                  required
                />
              </div>
            </div>
          )}

          {/* Responder Fields */}
          {accountType === "responder" && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3.5 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <ShieldCheck size={16} className="text-cyan-400" />
                <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
                  Responder Credentials
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Profession
                </label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white outline-none focus:border-cyan-500 text-sm"
                  required
                >
                  <option value="">Select Profession</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Police Officer">Police Officer</option>
                  <option value="Paramedic">Paramedic</option>
                  <option value="Firefighter">Firefighter</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Organization / Hospital
                </label>
                <input
                  type="text"
                  placeholder="Apollo Hospital / City Police"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Professional License / Registration ID
                </label>
                <input
                  type="text"
                  placeholder="MCI-984920 / EMP-1029"
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white outline-none focus:border-cyan-500 text-sm"
                  required
                />
              </div>

              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                ⚠️ Account requires administrator verification before full emergency access.
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-2 py-3.5 px-6
              rounded-xl
              bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600
              hover:from-blue-500 hover:to-cyan-500
              text-white font-bold text-sm
              shadow-lg shadow-blue-600/30
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
              group
            "
          >
            <span>{loading ? "Creating Account..." : "Complete Registration"}</span>
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-slate-400">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition hover:underline">
            Sign In Here
          </Link>
        </p>
      </AuthCard>
    </section>
  );
};

export default RegisterForm;
