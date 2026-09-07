import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const EmergencyStatus = ({ profile, contacts }) => {
  const bloodGroupAdded = !!profile?.bloodGroup;
  const medicalInfoAdded = !!(
    profile?.medicalConditions ||
    profile?.allergies ||
    profile?.medications
  );
  const emergencyContactAdded = contacts?.length > 0;

  const completedItems = [
    bloodGroupAdded,
    medicalInfoAdded,
    emergencyContactAdded,
  ].filter(Boolean).length;

  const totalItems = 3;
  const isComplete = completedItems === totalItems;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isComplete ? (
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 size={28} />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertCircle size={28} />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isComplete ? "Emergency Ready" : "Action Required"}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                isComplete ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}>
                {isComplete ? "100% SECURE" : "INCOMPLETE"}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              {isComplete
                ? "Your life-saving medical credentials are fully configured."
                : "Complete all medical fields so first responders can treat you safely."}
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/profile"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition duration-200 flex items-center gap-2 shadow-lg shadow-blue-600/20 self-stretch sm:self-auto justify-center"
        >
          <span>Manage Profile</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mt-7">
        <div className="flex justify-between items-center text-xs font-semibold mb-2">
          <span className="text-slate-400">Profile Readiness Score</span>
          <span className="text-cyan-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/20"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="grid sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
        <StatusItem
          title="Blood Group"
          completed={bloodGroupAdded}
          subtitle={bloodGroupAdded ? profile?.bloodGroup : "Not added yet"}
        />
        <StatusItem
          title="Medical Details"
          completed={medicalInfoAdded}
          subtitle={medicalInfoAdded ? "Vitals recorded" : "Missing history"}
        />
        <StatusItem
          title="ICE Contacts"
          completed={emergencyContactAdded}
          subtitle={emergencyContactAdded ? `${contacts.length} Contact(s)` : "No contacts"}
        />
      </div>
    </div>
  );
};

const StatusItem = ({ title, completed, subtitle }) => {
  return (
    <div className={`p-4 rounded-2xl border transition duration-200 flex items-center justify-between ${
      completed
        ? "bg-slate-950/60 border-slate-800 text-slate-200"
        : "bg-amber-500/5 border-amber-500/20 text-slate-300"
    }`}>
      <div>
        <p className="text-xs font-bold text-white">{title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{subtitle}</p>
      </div>
      {completed ? (
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle size={18} className="text-amber-400 shrink-0" />
      )}
    </div>
  );
};

export default EmergencyStatus;