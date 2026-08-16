import { useEffect, useState } from "react";

import WelcomeCard from "./WelcomeCard";
import EmergencyStatus from "./EmergencyStatus";
import HealthSummary from "./HealthSummary";

import api from "../../api/axios";

const DashboardHome = () => {

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

      console.log("PROFILE:", profileRes.data);
      console.log("EMERGENCY:", emergencyRes.data);

      setProfile(profileRes.data.profile || null);

      setContacts(
        emergencyRes.data.contacts || []
      );

    } catch (error) {

      console.error(
        "Failed to load dashboard:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <WelcomeCard />

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