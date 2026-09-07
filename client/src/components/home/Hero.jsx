import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaPlayCircle,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaRobot,
  FaUserNurse,
  FaHeartbeat
} from "react-icons/fa";
import { MdQrCode2 } from "react-icons/md";
import { Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-slate-950 flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] -top-20 -left-20 pointer-events-none animate-pulse-glow" />
      <div className="absolute w-[450px] h-[450px] bg-rose-600/15 rounded-full blur-[120px] bottom-0 right-0 pointer-events-none animate-pulse-glow" />
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg shadow-blue-500/10">
            <Sparkles size={16} className="text-cyan-400 animate-spin-slow" />
            <span>AI-Powered Lifesaving Emergency Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-6 leading-[1.1] tracking-tight">
            Every Second <br />
            <span className="gradient-text">Can Save a Life.</span>
          </h1>

          {/* Paragraph */}
          <p className="text-slate-300 text-base sm:text-lg mt-6 leading-relaxed max-w-xl font-normal">
            Sankat Mochan securely encodes critical medical profiles inside a encrypted QR Code & NFC tag, allowing hospitals and first responders to access life-saving data in milliseconds.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/register"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all duration-300 flex items-center gap-3 group hover:scale-[1.02]"
            >
              <span>Create Free Profile</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#aidemo"
              className="px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-base backdrop-blur-md transition-all duration-300 flex items-center gap-3 group hover:border-slate-600"
            >
              <FaPlayCircle className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Watch AI Demo</span>
            </a>
          </div>

          {/* Key Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80">
            {[
              { icon: MdQrCode2, text: "Instant QR Access", color: "text-cyan-400" },
              { icon: FaShieldAlt, text: "Encrypted Data", color: "text-emerald-400" },
              { icon: FaRobot, text: "AI Triage Advice", color: "text-purple-400" },
              { icon: FaMapMarkerAlt, text: "Live GPS SOS", color: "text-rose-400" },
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-medium">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <feat.icon className={`${feat.color} text-lg`} />
                </div>
                <span>{feat.text}</span>
              </div>
            ))}
          </div>

        </motion.div>

        {/* RIGHT VISUAL MOCKUP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center items-center py-8"
        >

          {/* Floating Outer Glass Card Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-rose-600/20 rounded-3xl blur-2xl -z-10 transform scale-95" />

          {/* Phone Shell */}
          <div className="relative w-full max-w-[340px] bg-slate-900 border border-slate-800 rounded-[40px] p-4 shadow-2xl shadow-blue-950/50 backdrop-blur-xl">

            {/* Top Speaker & Notch Bar */}
            <div className="w-32 h-4 bg-slate-950 rounded-full mx-auto mb-4 flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-800" />
              <div className="w-10 h-1.5 rounded-full bg-slate-800" />
            </div>

            {/* App UI Screen */}
            <div className="bg-slate-950 border border-slate-800 rounded-[28px] p-4 space-y-4 overflow-hidden">
              
              {/* Emergency Banner */}
              <div className="flex items-center justify-between bg-gradient-to-r from-red-600/90 to-rose-600/90 rounded-2xl p-3.5 text-white shadow-lg shadow-red-600/30">
                <div className="flex items-center gap-2.5">
                  <FaHeartbeat className="text-xl animate-ping" />
                  <div>
                    <p className="text-[10px] font-bold tracking-wider uppercase opacity-80">EMERGENCY CARD</p>
                    <p className="text-sm font-extrabold">Active QR ID</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold uppercase">LIVE</span>
              </div>

              {/* Vitals Summary Pills */}
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                  <span className="text-slate-400">Blood Group</span>
                  <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 font-bold border border-red-500/30">O Positive (O+)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                  <span className="text-slate-400">Allergies</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">Penicillin (Severe)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                  <span className="text-slate-400">Emergency Contact</span>
                  <span className="text-cyan-400 font-medium">+91 98765 43210</span>
                </div>
              </div>

              {/* QR Container */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <MdQrCode2 className="text-8xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
                <p className="text-[11px] font-medium text-slate-400 mt-2">Scan to unlock medical vitals</p>
              </div>

            </div>

          </div>

          {/* Floating Glass Badge 1: Instant SOS */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-6 sm:-left-10 top-16 bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-xl shadow-blue-950/60 flex items-center gap-3 z-20"
          >
            <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">Instant GPS SOS</p>
              <p className="text-[10px] text-slate-400">1-Tap Location Broadcast</p>
            </div>
          </motion.div>

          {/* Floating Glass Badge 2: Verified Security */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -right-6 sm:-right-10 bottom-12 bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl p-3.5 rounded-2xl shadow-xl shadow-purple-950/60 flex items-center gap-3 z-20"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">Encrypted Profile</p>
              <p className="text-[10px] text-slate-400">HIPAA & ISO Standard</p>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;