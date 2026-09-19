import { ShieldCheck } from "lucide-react";

const ProfileProgress = ({
  profile,
  insurance,
  emergencyContacts,
  documents,
}) => {
  const profileDone =
    !!profile.bloodGroup &&
    !!profile.dateOfBirth &&
    !!profile.gender &&
    !!profile.height &&
    !!profile.weight;

  const medicalDone =
    !!profile.allergies ||
    !!profile.medicalConditions ||
    !!profile.medications;

  const emergencyDone = emergencyContacts.length > 0;

  const insuranceDone =
    !!insurance.provider &&
    !!insurance.policyNumber &&
    !!insurance.policyHolder &&
    !!insurance.validTill;

  const documentsDone = documents.length > 0;

  let completed = 0;
  if (profileDone) completed++;
  if (medicalDone) completed++;
  if (emergencyDone) completed++;
  if (insuranceDone) completed++;
  if (documentsDone) completed++;

  const progress = Math.round((completed / 5) * 100);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Medical Identity Completion
            </h2>
            <p className="text-xs text-slate-400">
              5 Key Sections for Comprehensive Lifesaving Records
            </p>
          </div>
        </div>

        <span className="text-2xl font-black gradient-text">
          {progress}%
        </span>
      </div>

      <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800">
        <div
          className="bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 h-2 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/20"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 text-[11px] font-semibold text-center">
        <span className={`py-1.5 rounded-lg border ${profileDone ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-950 text-slate-500 border-slate-800"}`}>1. Vitals Info</span>
        <span className={`py-1.5 rounded-lg border ${medicalDone ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-950 text-slate-500 border-slate-800"}`}>2. Medical History</span>
        <span className={`py-1.5 rounded-lg border ${emergencyDone ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-950 text-slate-500 border-slate-800"}`}>3. ICE Contacts</span>
        <span className={`py-1.5 rounded-lg border ${insuranceDone ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-950 text-slate-500 border-slate-800"}`}>4. Insurance</span>
        <span className={`py-1.5 rounded-lg border ${documentsDone ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-950 text-slate-500 border-slate-800"}`}>5. Documents</span>
      </div>
    </div>
  );
};

export default ProfileProgress;