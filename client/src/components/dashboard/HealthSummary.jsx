import {
  Droplets,
  TriangleAlert,
  HeartPulse,
  HeartHandshake,
  Phone,
} from "lucide-react";

import SummaryItem from "./SummaryItem";

const healthData = [
  {
    title: "Blood Group",
    value: "O+",
    icon: Droplets,
    color: "text-red-500",
  },
  {
    title: "Allergies",
    value: "None",
    icon: TriangleAlert,
    color: "text-yellow-500",
  },
  {
    title: "Medical Condition",
    value: "Healthy",
    icon: HeartPulse,
    color: "text-blue-500",
  },
  {
    title: "Organ Donor",
    value: "Yes",
    icon: HeartHandshake,
    color: "text-pink-500",
  },
  {
    title: "Emergency Contacts",
    value: "2",
    icon: Phone,
    color: "text-green-500",
  },
];

const HealthSummary = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-800">
          Health Summary
        </h2>

        <p className="text-gray-500 mt-1">
          Quick overview of your emergency medical information.
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {healthData.map((item) => (
          <SummaryItem
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}

      </div>

    </div>
  );
};

export default HealthSummary;