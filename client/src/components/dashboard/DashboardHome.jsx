import WelcomeCard from "./WelcomeCard";
import EmergencyStatus from "./EmergencyStatus";
import HealthSummary from "./HealthSummary";

const DashboardHome = () => {
  return (
    <div className="space-y-8">

      <WelcomeCard />

      <EmergencyStatus />

      <HealthSummary />

    </div>
  );
};

export default DashboardHome;