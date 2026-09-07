import { Phone, ShieldAlert, Activity, AlertTriangle, Pill, Star } from "lucide-react";

const EmergencyCardPreview = ({
  user,
  medicalProfile,
  emergencyContact,
}) => {
  // Support both single contact object and array of contacts
  const contactsList = Array.isArray(emergencyContact)
    ? emergencyContact
    : emergencyContact
    ? [emergencyContact]
    : [];

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 tracking-tight flex items-center gap-3">
        <ShieldAlert className="text-red-500" size={28} />
        Emergency Digital ID Card Preview
      </h2>

      {/* Emergency Card container */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-red-500/40 bg-slate-950 shadow-2xl">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Sankat Mochan Verification
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-wide">
              {user?.fullName || "Citizen Medical Profile"}
            </h1>
            <p className="text-red-100 text-xs sm:text-sm mt-1 font-medium">
              Emergency Identity & Paramedic Protocol System
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl text-center shrink-0">
            <span className="text-[10px] font-bold text-red-200 uppercase tracking-wider block">
              Blood Type
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              {medicalProfile?.bloodGroup || "N/A"}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Medical Vitals Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium block">Date of Birth</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                {medicalProfile?.dateOfBirth
                  ? new Date(medicalProfile.dateOfBirth).toLocaleDateString("en-IN")
                  : "Not Specified"}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium block">Gender</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 capitalize block">
                {medicalProfile?.gender || "Not Specified"}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium block">Height / Weight</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                {medicalProfile?.height ? `${medicalProfile.height} cm` : "--"} /{" "}
                {medicalProfile?.weight ? `${medicalProfile.weight} kg` : "--"}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium block">Organ Donor</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                {medicalProfile?.organDonor ? "🫀 Registered Donor" : "No"}
              </span>
            </div>
          </div>

          {/* Medical Alerts (Allergies, Conditions, Medications) */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <AlertTriangle size={15} />
                Allergies
              </div>
              <p className="text-xs text-amber-200 font-medium">
                {medicalProfile?.allergies || "No known allergies declared"}
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Activity size={15} />
                Chronic Conditions
              </div>
              <p className="text-xs text-blue-200 font-medium">
                {medicalProfile?.medicalConditions || "None declared"}
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Pill size={15} />
                Current Medications
              </div>
              <p className="text-xs text-purple-200 font-medium">
                {medicalProfile?.medications || "None declared"}
              </p>
            </div>
          </div>

          {/* Emergency Contacts List (Primary & Secondary ICE) */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Phone className="text-red-400" size={16} />
              Emergency Contacts (ICE) ({contactsList.length})
            </h3>

            {contactsList.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {contactsList.map((c, i) => (
                  <div
                    key={c._id || i}
                    className={`rounded-2xl p-4 border flex flex-col justify-between ${
                      c.isPrimary || i === 0
                        ? "bg-slate-900 border-red-500/40"
                        : "bg-slate-900/60 border-slate-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                          {i === 0 && <Star size={10} className="fill-current text-red-400" />}
                          {c.isPrimary || i === 0 ? "Primary ICE Contact" : `Secondary Contact #${i + 1}`}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{c.relationship}</span>
                      </div>
                      <p className="font-bold text-white text-base mt-1">{c.contactName}</p>
                      <p className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">{c.phone}</p>
                    </div>

                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        className="mt-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-600/20"
                      >
                        <Phone size={14} />
                        Call {c.contactName}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-400">
                No emergency contacts added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCardPreview;