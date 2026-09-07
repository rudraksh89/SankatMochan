import { useEffect, useState } from "react";
import { User, Droplets, AlertTriangle, HeartPulse, Phone, Loader2 } from "lucide-react";
import api from "../../api/axios";

const EmergencyInfo = () => {
  const [user, setUser] = useState(null);
  const [medicalProfile, setMedicalProfile] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyInfo();
  }, []);

  const fetchEmergencyInfo = async () => {
    try {
      setLoading(true);
      const [profileRes, emergencyRes] = await Promise.all([
        api.get("/profile"),
        api.get("/emergency"),
      ]);

      setUser(profileRes.data.user);
      setMedicalProfile(profileRes.data.profile);

      const contacts = emergencyRes.data.contacts || [];
      setEmergencyContact(contacts.length > 0 ? contacts[0] : null);
    } catch (error) {
      console.error("Failed to load emergency information:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-400 py-6">
        <Loader2 className="animate-spin text-red-500" size={24} />
        <span className="text-sm font-medium">Fetching card credentials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Patient Name */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-slate-400">PATIENT NAME</span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
          {user?.fullName || "Full Name Unrecorded"}
        </h2>
      </div>

      {/* Grid of Medical Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Blood Group */}
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Droplets className="text-red-400" size={20} />
            <span className="text-xs font-semibold text-slate-300">Blood Group</span>
          </div>
          <span className="text-lg font-black text-red-400">
            {medicalProfile?.bloodGroup || "N/A"}
          </span>
        </div>

        {/* Severe Allergies */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="text-amber-400" size={20} />
            <span className="text-xs font-semibold text-slate-300">Allergies</span>
          </div>
          <span className="text-xs font-bold text-amber-300 truncate max-w-[120px]">
            {medicalProfile?.allergies || "None"}
          </span>
        </div>

        {/* Medical History */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HeartPulse className="text-blue-400" size={20} />
            <span className="text-xs font-semibold text-slate-300">Conditions</span>
          </div>
          <span className="text-xs font-bold text-blue-300 truncate max-w-[120px]">
            {medicalProfile?.medicalConditions || "None"}
          </span>
        </div>

        {/* ICE Phone */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Phone className="text-emerald-400" size={20} />
            <span className="text-xs font-semibold text-slate-300">ICE Call</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-300">
            {emergencyContact?.phone || "Not Set"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyInfo;