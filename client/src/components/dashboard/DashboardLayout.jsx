import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 p-8 bg-slate-100 dark:bg-slate-950">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;