import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 bg-slate-950">
        {/* Topbar Header */}
        <Topbar />

        {/* Page Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 bg-slate-950 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;