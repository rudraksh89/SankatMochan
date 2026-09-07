import EmergencyInfo from "./EmergencyInfo";
import EmergencyQR from "./EmergencyQR";
import { HeartPulse, ShieldAlert } from "lucide-react";

const EmergencyCard = () => {
  return (
    <div
      id="emergency-card"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white shadow-2xl border border-red-500/30 p-8 sm:p-10 transition-all duration-300"
    >
      {/* Background Decorative Hologram Lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Card Header Strip */}
      <div className="flex items-center justify-between border-b border-red-500/20 pb-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30">
            <HeartPulse className="text-white text-xl animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase text-white">
              Sankat<span className="text-red-500">Mochan</span>
            </h1>
            <p className="text-[10px] text-red-300 font-bold uppercase tracking-widest">
              OFFICIAL EMERGENCY MEDICAL PASS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-extrabold uppercase">
          <ShieldAlert size={14} className="text-red-400" />
          <span>Priority 1 ICE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
        {/* LEFT SIDE: Medical Info */}
        <div className="md:col-span-2">
          <EmergencyInfo />
        </div>

        {/* RIGHT SIDE: Dynamic QR */}
        <div className="flex flex-col items-center justify-center">
          <EmergencyQR />
        </div>
      </div>

      {/* Bottom Security Footer */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-medium gap-2">
        <span>🔒 Encrypted Emergency Medical Credential</span>
        <span>HIPAA / ISO 27001 Standard Compliant</span>
      </div>
    </div>
  );
};

export default EmergencyCard;