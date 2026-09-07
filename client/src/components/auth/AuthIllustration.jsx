import { ShieldCheck, QrCode, Ambulance, HeartPulse, Lock } from "lucide-react";
import { motion } from "framer-motion";

const AuthIllustration = () => {
  return (
    <div className="flex flex-col justify-center items-center text-white text-center space-y-8">
      {/* Animated Brand Badge */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30 border border-white/20"
      >
        <ShieldCheck size={52} className="text-white" />
      </motion.div>

      <div>
        <h2 className="text-4xl font-black text-white tracking-tight">
          Sankat <span className="text-red-500">Mochan</span>
        </h2>
        <p className="text-slate-300 font-medium text-base mt-2 max-w-sm">
          Next-Gen Emergency Medical Identity & AI Triage Platform
        </p>
      </div>

      {/* Feature Pills */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center">
          <QrCode className="text-cyan-400 mb-2" size={28} />
          <span className="text-xs font-bold text-slate-200">Smart QR Pass</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center">
          <Ambulance className="text-rose-400 mb-2" size={28} />
          <span className="text-xs font-bold text-slate-200">Paramedic Sync</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center">
          <HeartPulse className="text-emerald-400 mb-2" size={28} />
          <span className="text-xs font-bold text-slate-200">Instant Vitals</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center">
          <Lock className="text-amber-400 mb-2" size={28} />
          <span className="text-xs font-bold text-slate-200">AES Encrypted</span>
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed max-w-xs pt-2">
        Every second matters during critical emergencies. Keep your life-saving medical information accessible everywhere.
      </p>
    </div>
  );
};

export default AuthIllustration;