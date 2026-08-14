const NotificationSettings = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Notifications
      </h2>

      <div className="space-y-5">

        <label className="flex justify-between items-center">
          <span>Email Notifications</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex justify-between items-center">
          <span>SMS Alerts</span>
          <input type="checkbox" defaultChecked />
        </label>

        <label className="flex justify-between items-center">
          <span>Emergency Notifications</span>
          <input type="checkbox" defaultChecked />
        </label>

      </div>

    </div>
  );
};

export default NotificationSettings;