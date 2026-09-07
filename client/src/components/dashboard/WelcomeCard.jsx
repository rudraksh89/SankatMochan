import { CalendarDays, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const WelcomeCard = () => {
  const { user } = useAuth();

  const hour = new Date().getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon";
  } else if (hour >= 18) {
    greeting = "Good Evening";
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 p-8 text-white shadow-2xl shadow-blue-950/50 border border-blue-500/30">
      {/* Background Lighting Blobs */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-200 mb-3">
            <Sparkles size={14} className="text-cyan-300 animate-spin-slow" />
            <span>Sankat Mochan Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {greeting}, {user?.fullName || "User"} 👋
          </h1>

          <p className="mt-2 text-blue-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            Your emergency profile is active. Keep your medical vitals updated so paramedics and hospitals can deliver optimal treatment in seconds.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 bg-slate-950/40 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-inner shrink-0">
          <CalendarDays size={20} className="text-cyan-300" />
          <span className="font-semibold text-xs tracking-wide">
            {today}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;