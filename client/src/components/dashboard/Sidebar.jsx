import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  User,
  QrCode,
  History,
  IdCard,
  Settings,
  LogOut,
  BadgeCheck,
  ShieldCheck,
  HeartPulse,
  Radio,
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
    title: "Scan History",
    icon: History,
    path: "/dashboard/qr-history",
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
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800/80 text-white flex flex-col justify-between shrink-0">
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <HeartPulse className="text-white text-xl animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">
              Sankat<span className="text-red-500">Mochan</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Emergency Platform
            </p>
          </div>
        </div>

        {/* USER ROLE BADGE */}
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Account Type</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {user?.role === "admin" ? "Admin" : user?.accountType === "responder" ? "Responder" : "Citizen"}
            </span>
          </div>
        </div>

        {/* NAVIGATION MENU */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-blue-600/20 font-bold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}

          {/* LIVE SOS RADAR FOR RESPONDERS / ADMINS */}
          {(user?.accountType === "responder" || user?.role === "admin") && (
            <NavLink
              to="/dashboard/sos-radar"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg shadow-red-600/30 font-bold"
                    : "text-red-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Radio size={19} className="animate-pulse text-red-500" />
              <span>Live SOS Radar</span>
            </NavLink>
          )}

          {/* RESPONDER VERIFICATION */}
          {user?.accountType === "responder" && (
            <NavLink
              to="/dashboard/verification"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-600/20 font-bold"
                    : "text-cyan-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <BadgeCheck size={19} />
              <span>Verification</span>
            </NavLink>
          )}

          {/* ADMIN VERIFICATION */}
          {user?.role === "admin" && (
            <NavLink
              to="/dashboard/admin/verifications"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 font-bold"
                    : "text-purple-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <ShieldCheck size={19} />
              <span>Admin Verification</span>
            </NavLink>
          )}
        </nav>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="border-t border-slate-800/80 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-400 hover:text-white hover:bg-rose-600/20 hover:border-rose-500/30 border border-transparent transition text-sm font-semibold"
        >
          <LogOut size={19} className="text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;