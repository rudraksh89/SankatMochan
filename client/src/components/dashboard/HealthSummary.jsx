import {
  Droplets,
  AlertTriangle,
  HeartPulse,
  HandHeart,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const HealthSummary = ({ profile, contacts }) => {
  const bloodGroup = profile?.bloodGroup || "Not Provided";
  const allergies = profile?.allergies || "None Reported";
  const medicalCondition = profile?.medicalConditions || "None Reported";
  const organDonor = profile?.organDonor ? "Registered Donor" : "Not Registered";
  const emergencyContactsCount = contacts?.length || 0;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Health Summary & Vitals
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Quick overview of information visible during emergency QR scans.
          </p>
        </div>

        <Link
          to="/dashboard/profile"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
        >
          <span>Edit Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {/* Blood Group */}
        <SummaryCard
          icon={<Droplets size={22} className="text-red-400" />}
          iconBg="bg-red-500/10 border-red-500/20"
          title="Blood Group"
          value={bloodGroup}
          valueColor={profile?.bloodGroup ? "text-red-400 font-black text-xl" : "text-slate-400"}
        />

        {/* Allergies */}
        <SummaryCard
          icon={<AlertTriangle size={22} className="text-amber-400" />}
          iconBg="bg-amber-500/10 border-amber-500/20"
          title="Known Allergies"
          value={allergies}
          valueColor={profile?.allergies ? "text-amber-300 font-bold" : "text-slate-400"}
        />

        {/* Medical Conditions */}
        <SummaryCard
          icon={<HeartPulse size={22} className="text-blue-400" />}
          iconBg="bg-blue-500/10 border-blue-500/20"
          title="Chronic Conditions"
          value={medicalCondition}
          valueColor={profile?.medicalConditions ? "text-blue-300 font-bold" : "text-slate-400"}
        />

        {/* Organ Donor */}
        <SummaryCard
          icon={<HandHeart size={22} className="text-emerald-400" />}
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          title="Organ Donor Status"
          value={organDonor}
          valueColor={profile?.organDonor ? "text-emerald-400 font-bold" : "text-slate-400"}
        />

        {/* Emergency Contacts */}
        <SummaryCard
          icon={<Phone size={22} className="text-cyan-400" />}
          iconBg="bg-cyan-500/10 border-cyan-500/20"
          title="Emergency Contacts"
          value={`${emergencyContactsCount} Contact(s) Active`}
          valueColor={emergencyContactsCount > 0 ? "text-cyan-300 font-bold" : "text-slate-400"}
        />
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, iconBg, title, value, valueColor }) => {
  return (
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700 transition">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${iconBg} shrink-0`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className={`text-sm mt-0.5 truncate ${valueColor}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default HealthSummary;