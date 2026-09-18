import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import WelcomeCard from "./WelcomeCard";
import EmergencyStatus from "./EmergencyStatus";
import HealthSummary from "./HealthSummary";
import LiveSOSFeed from "./LiveSOSFeed";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const DashboardHome = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, emergencyRes] = await Promise.all([
        api.get("/profile"),
        api.get("/emergency"),
      ]);

      setProfile(profileRes.data.profile || null);
      setContacts(emergencyRes.data.contacts || []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-slate-400 space-y-3">
        <Loader2 className="animate-spin text-blue-500" size={36} />
        <p className="text-sm font-medium">Synchronizing medical profile...</p>
      </div>
    );
  }

  const isResponderOrAdmin = user?.accountType === "responder" || user?.role === "admin";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <WelcomeCard />

      {isResponderOrAdmin && <LiveSOSFeed />}

      <EmergencyStatus
        profile={profile}
        contacts={contacts}
      />

      <HealthSummary
        profile={profile}
        contacts={contacts}
      />
    </div>
  );
};

export default DashboardHome;