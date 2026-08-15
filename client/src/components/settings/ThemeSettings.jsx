import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeSettings = () => {
  const { theme, changeTheme } = useTheme();

  const selectTheme = (value) => {
    console.log("BUTTON CLICKED:", value);
    changeTheme(value);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Appearance
      </h2>

      <div className="space-y-4">

        {/* LIGHT */}

        <button
          type="button"
          onClick={() => selectTheme("light")}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
            theme === "light"
              ? "border-blue-500 bg-blue-50 dark:bg-slate-800"
              : "border-gray-200 dark:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-4">

            <Sun className="text-gray-700 dark:text-gray-200" />

            <div className="text-left">

              <p className="font-semibold text-gray-900 dark:text-white">
                Light Mode
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use the light appearance
              </p>

            </div>

          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 ${
              theme === "light"
                ? "border-blue-600 bg-blue-600"
                : "border-gray-400"
            }`}
          />

        </button>


        {/* DARK */}

        <button
          type="button"
          onClick={() => selectTheme("dark")}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
            theme === "dark"
              ? "border-blue-500 bg-blue-50 dark:bg-slate-800"
              : "border-gray-200 dark:border-slate-700"
          }`}
        >

          <div className="flex items-center gap-4">

            <Moon className="text-gray-700 dark:text-gray-200" />

            <div className="text-left">

              <p className="font-semibold text-gray-900 dark:text-white">
                Dark Mode
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use the dark appearance
              </p>

            </div>

          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 ${
              theme === "dark"
                ? "border-blue-600 bg-blue-600"
                : "border-gray-400"
            }`}
          />

        </button>


        {/* SYSTEM */}

        <button
          type="button"
          onClick={() => selectTheme("system")}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
            theme === "system"
              ? "border-blue-500 bg-blue-50 dark:bg-slate-800"
              : "border-gray-200 dark:border-slate-700"
          }`}
        >

          <div className="flex items-center gap-4">

            <Monitor className="text-gray-700 dark:text-gray-200" />

            <div className="text-left">

              <p className="font-semibold text-gray-900 dark:text-white">
                System Default
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Follow your device preference
              </p>

            </div>

          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 ${
              theme === "system"
                ? "border-blue-600 bg-blue-600"
                : "border-gray-400"
            }`}
          />

        </button>

      </div>

    </div>
  );
};

export default ThemeSettings;