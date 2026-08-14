import DashboardLayout from "../components/dashboard/DashboardLayout";

import AccountSettings from "../components/settings/AccountSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import ThemeSettings from "../components/settings/ThemeSettings";
import DangerZone from "../components/settings/DangerZone";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <AccountSettings />

        <NotificationSettings />

        <SecuritySettings />

        <ThemeSettings />

        <DangerZone />

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;