import { HeartPulse, Lock } from "lucide-react";

const QRPreview = () => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Emergency QR Protocol
        </h2>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">
          This QR Code is unique to your profile. Emergency responders, hospitals, or bystanders can scan it to immediately read your vital medical details without needing a password.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Included Data */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-3">
            <HeartPulse size={16} />
            <span>Encrypted Data Payload</span>
          </div>

          <ul className="space-y-2 text-slate-300 text-xs font-medium">
            <li className="flex items-center gap-2">✓ Blood Group & Rh Factor</li>
            <li className="flex items-center gap-2">✓ Critical Drug Allergies</li>
            <li className="flex items-center gap-2">✓ Chronic Medical Conditions</li>
            <li className="flex items-center gap-2">✓ Active Prescriptions</li>
            <li className="flex items-center gap-2">✓ 1-Tap Emergency Contact Dials</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
            <Lock size={16} />
            <span>Instant Zero-Delay Access</span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            When scanned, the QR code resolves to your public emergency portal. Paramedics can trigger 1-tap SOS broadcasts, fetch AI triage summaries, and alert your emergency contacts with live GPS coordinates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRPreview;