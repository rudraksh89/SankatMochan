import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  QrCode,
  IdCard,
  Settings,
  LogOut,
  ShieldPlus,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Medical Profile",
    icon: User,
    path: "/dashboard/profile",
  },
  {
    title: "QR Code",
    icon: QrCode,
    path: "/dashboard/qr",
  },
  {
    title: "Emergency Card",
    icon: IdCard,
    path: "/dashboard/card",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = () => {
    // Remove JWT
    localStorage.removeItem("token");

    // Clear logged-in user
    setUser(null);

    // Go to login
    navigate("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}

      <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-700">

        <ShieldPlus className="text-blue-500" size={36} />

        <div>
          <h1 className="text-xl font-bold">
            Sankat Mochan
          </h1>

          <p className="text-xs text-slate-400">
            Emergency Platform
          </p>
        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 mt-6">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={22} />

              <span className="font-medium">
                {item.title}
              </span>

            </NavLink>
          );

        })}

      </nav>

      {/* Logout */}

      <div className="border-t border-slate-700 p-5">

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full rounded-lg px-4 py-3 hover:bg-red-600 transition"
        >
          <LogOut size={22} />

          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;