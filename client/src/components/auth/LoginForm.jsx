import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, HeartPulse } from "lucide-react";

import AuthCard from "./AuthCard";
import PasswordInput from "./PasswordInput";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      // Save User in Context
      setUser(response.data.user);

      // Redirect to Dashboard
      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center w-full">
      <AuthCard>
        {/* Brand Icon Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
            <HeartPulse className="text-red-500 text-2xl animate-pulse" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Welcome Back
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Access your Sankat Mochan portal
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                className="
                  w-full
                  pl-10 pr-4 py-3
                  rounded-xl
                  border border-slate-800
                  bg-slate-950/80
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  transition-all duration-200
                  text-sm
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
              >
                Forgot Password?
              </Link>
            </div>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
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
            <span>{loading ? "Signing In..." : "Sign In to Portal"}</span>
            {!loading && (
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        {/* Demo Admin Quick Login Helper */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Demo Quick Login</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">Admin Portal</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setEmail("admin@sankatmochan.com");
              setPassword("Admin@123456");
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between transition-all"
          >
            <span>👑 System Admin Login</span>
            <span className="font-mono text-[11px] text-purple-400">Auto-fill Admin Creds</span>
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center mt-5 text-sm text-slate-400">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-400 hover:text-blue-300 transition hover:underline"
          >
            Register Now
          </Link>
        </p>
      </AuthCard>
    </section>
  );
};

export default LoginForm;