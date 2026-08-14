import {
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";

const profile = {
  bloodGroup: true,
  emergencyContact: true,
  medicalInfo: true,
  qrGenerated: true,
  lastUpdated: "Today",
};

const EmergencyStatus = () => {
  const isReady =
    profile.bloodGroup &&
    profile.emergencyContact &&
    profile.medicalInfo &&
    profile.qrGenerated;

  const checklist = [
    {
      label: "Blood Group Added",
      status: profile.bloodGroup,
    },
    {
      label: "Emergency Contact Added",
      status: profile.emergencyContact,
    },
    {
      label: "Medical Information Added",
      status: profile.medicalInfo,
    },
    {
      label: "QR Generated",
      status: profile.qrGenerated,
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">

      {/* Header */}

      <div className="flex items-center gap-4 mb-6">

        {isReady ? (
          <CheckCircle2
            size={42}
            className="text-green-500"
          />
        ) : (
          <AlertTriangle
            size={42}
            className="text-yellow-500"
          />
        )}

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            {isReady
              ? "Emergency Ready"
              : "Attention Required"}
          </h2>

          <p className="text-gray-500">
            {isReady
              ? "Your emergency profile is complete."
              : "Complete your profile for better emergency response."}
          </p>

        </div>

      </div>

      {/* Checklist */}

      <div className="space-y-4">

        {checklist.map((item) => (

          <div
            key={item.label}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
          >

            <span className="font-medium">
              {item.label}
            </span>

            {item.status ? (
              <CheckCircle2
                size={22}
                className="text-green-500"
              />
            ) : (
              <AlertTriangle
                size={22}
                className="text-yellow-500"
              />
            )}

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between mt-8 border-t pt-5">

        <div className="flex items-center gap-2 text-gray-500">

          <Clock size={18} />

          <span>
            Last Updated: {profile.lastUpdated}
          </span>

        </div>

        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          Edit Profile
        </button>

      </div>

    </div>
  );
};

export default EmergencyStatus;