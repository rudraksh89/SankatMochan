import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, ShieldCheck, HeartPulse, ArrowRight, Building, IdCard } from "lucide-react";

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

  const [accountType, setAccountType] = useState("normal");

  const [profession, setProfession] = useState("");
  const [organization, setOrganization] = useState("");
  const [professionalId, setProfessionalId] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        fullName,
        email,
        phone,
        password,
        accountType,
        profession: accountType === "responder" ? profession : "",
        organization: accountType === "responder" ? organization : "",
        professionalId: accountType === "responder" ? professionalId : "",
      });

      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert(
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

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

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

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("normal")}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  accountType === "normal"
                    ? "border-blue-500 bg-blue-600/15 text-white shadow-lg shadow-blue-500/10"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">👤 Citizen</span>
                  {accountType === "normal" && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                </div>
                <p className="text-[11px] opacity-70 mt-1">Regular user profile</p>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("responder")}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  accountType === "responder"
                    ? "border-cyan-500 bg-cyan-600/15 text-white shadow-lg shadow-cyan-500/10"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">🛡️ Responder</span>
                  {accountType === "responder" && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                </div>
                <p className="text-[11px] opacity-70 mt-1">Doctor, EMT, Police</p>
              </button>
            </div>
          </div>

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