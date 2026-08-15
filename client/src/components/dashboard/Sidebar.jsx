import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  QrCode,
  IdCard,
  Settings,
  LogOut,
  ShieldPlus,
} from "lucide-react";

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
  return (
    <aside
      className="
        w-72 min-h-screen
        bg-white dark:bg-slate-900
        text-slate-900 dark:text-white
        border-r border-slate-200 dark:border-slate-700
        flex flex-col
      "
    >

      {/* Logo */}
      <div
        className="
          flex items-center gap-3
          px-6 py-8
          border-b border-slate-200 dark:border-slate-700
        "
      >

        <ShieldPlus
          className="text-blue-600 dark:text-blue-500"
          size={36}
        />

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Sankat Mochan
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400">
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
                `
                flex items-center gap-4
                px-6 py-4
                transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : `
                      text-slate-600 dark:text-slate-300
                      hover:bg-slate-100 dark:hover:bg-slate-800
                      hover:text-slate-900 dark:hover:text-white
                    `
                }
                `
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
      <div
        className="
          border-t border-slate-200 dark:border-slate-700
          p-5
        "
      >

        <button
          className="
            flex items-center gap-4
            w-full rounded-lg
            px-4 py-3
            text-slate-600 dark:text-slate-300
            hover:bg-red-600
            hover:text-white
            transition
          "
        >

          <LogOut size={22} />

          Logout

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;