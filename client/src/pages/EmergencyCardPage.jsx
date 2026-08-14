import DashboardLayout from "../components/dashboard/DashboardLayout";

import EmergencyCard from "../components/emergencyCard/EmergencyCard";
import EmergencyActions from "../components/emergencyCard/EmergencyActions";

const EmergencyCardPage = () => {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <EmergencyCard />

        <EmergencyActions />

      </div>

    </DashboardLayout>
  );
};

export default EmergencyCardPage;