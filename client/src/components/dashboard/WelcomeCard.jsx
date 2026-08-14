import { CalendarDays } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const WelcomeCard = () => {
  const { user } = useAuth();

  const hour = new Date().getHours();

  let greeting = "";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold">
            {greeting}, {user?.fullName || "User"} 👋
          </h1>

          <p className="mt-3 text-blue-100 max-w-2xl">
            Welcome back to Sankat Mochan. Your emergency medical profile
            helps responders access life-saving information instantly during
            emergencies.
          </p>

        </div>

        <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl">

          <CalendarDays size={24} />

          <span className="font-medium">
            {today}
          </span>

        </div>

      </div>

    </div>
  );
};

export default WelcomeCard;