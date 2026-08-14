import { Search, Bell, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500">
          Welcome back, {user?.fullName || "User"} 👋
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-4 py-2">
          <Search size={18} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-slate-100 transition">
          <Settings size={22} />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {user?.fullName?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="hidden lg:block">

            <h3 className="font-semibold">
              {user?.fullName || "User"}
            </h3>

            <p className="text-sm text-slate-500">
              Citizen
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Topbar;