import { useEffect, useState } from "react";

const NotificationSettings = () => {

  const [settings, setSettings] = useState({
    email: true,
    sms: true,
    emergency: true,
  });

  // Load saved settings
  useEffect(() => {
    const savedSettings =
      localStorage.getItem("notificationSettings");

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Toggle notification
  const handleToggle = (name) => {
    setSettings((prev) => {

      const updated = {
        ...prev,
        [name]: !prev[name],
      };

      localStorage.setItem(
        "notificationSettings",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Notification Settings
      </h2>

      <div className="space-y-6">

        {/* Email Notifications */}

        <div className="flex items-center justify-between">

          <div>
            <h3 className="font-semibold text-gray-900">
              Email Notifications
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Receive important updates through email.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              handleToggle("email")
            }
            className={`relative w-12 h-6 rounded-full transition ${
              settings.email
                ? "bg-blue-600"
                : "bg-gray-300"
            }`}
          >

            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                settings.email
                  ? "left-7"
                  : "left-1"
              }`}
            />

          </button>

        </div>


        {/* SMS */}

        <div className="flex items-center justify-between">

          <div>
            <h3 className="font-semibold text-gray-900">
              SMS Alerts
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Receive important alerts through SMS.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              handleToggle("sms")
            }
            className={`relative w-12 h-6 rounded-full transition ${
              settings.sms
                ? "bg-blue-600"
                : "bg-gray-300"
            }`}
          >

            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                settings.sms
                  ? "left-7"
                  : "left-1"
              }`}
            />

          </button>

        </div>


        {/* Emergency Notifications */}

        <div className="flex items-center justify-between">

          <div>
            <h3 className="font-semibold text-gray-900">
              Emergency Notifications
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Receive notifications related to emergency activity.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              handleToggle("emergency")
            }
            className={`relative w-12 h-6 rounded-full transition ${
              settings.emergency
                ? "bg-blue-600"
                : "bg-gray-300"
            }`}
          >

            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                settings.emergency
                  ? "left-7"
                  : "left-1"
              }`}
            />

          </button>

        </div>

      </div>

    </div>
  );
};

export default NotificationSettings;