import { useEffect, useState } from "react";
import { Bell, Mail, MessageSquare, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: true,
    sms: true,
    emergency: true,
  });

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem("notificationSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse notification settings:", e);
      }
    }
  }, []);

  // Toggle notification
  const handleToggle = (name) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        [name]: !prev[name],
      };

      localStorage.setItem("notificationSettings", JSON.stringify(updated));
      toast.success(`${name.toUpperCase()} notification preferences saved!`);
      return updated;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Bell size={22} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Notification Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Choose how you receive emergency alerts and account updates
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3.5">
            <Mail className="text-slate-500 dark:text-slate-400" size={20} />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                Email Notifications
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Receive security OTPs and medical alerts via email.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle("email")}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
              settings.email ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                settings.email ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* SMS Alerts */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3.5">
            <MessageSquare className="text-slate-500 dark:text-slate-400" size={20} />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                SMS Alerts
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Receive urgent SMS notifications on your phone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle("sms")}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
              settings.sms ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                settings.sms ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Emergency Notifications */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3.5">
            <AlertTriangle className="text-red-500" size={20} />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                Emergency Priority Broadcasts
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Receive high-priority SOS emergency notifications.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggle("emergency")}
            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
              settings.emergency ? "bg-red-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                settings.emergency ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;