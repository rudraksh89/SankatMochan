import DashboardLayout from "../components/dashboard/DashboardLayout";
import LiveSOSFeed from "../components/dashboard/LiveSOSFeed";

const SOSRadarPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <LiveSOSFeed />
      </div>
    </DashboardLayout>
  );
};

export default SOSRadarPage;
