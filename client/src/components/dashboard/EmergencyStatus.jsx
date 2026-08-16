import { CheckCircle, AlertCircle } from "lucide-react";

const EmergencyStatus = ({ profile, contacts }) => {

  const bloodGroupAdded =
    !!profile?.bloodGroup;

  const medicalInfoAdded =
    !!(
      profile?.medicalConditions ||
      profile?.allergies ||
      profile?.medications
    );

  const emergencyContactAdded =
    contacts?.length > 0;

  const completedItems = [
    bloodGroupAdded,
    medicalInfoAdded,
    emergencyContactAdded,
  ].filter(Boolean).length;

  const totalItems = 3;

  const isComplete =
    completedItems === totalItems;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-md">

      {/* Header */}

      <div className="flex items-center gap-5">

        {isComplete ? (
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle
              size={32}
              className="text-green-600"
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertCircle
              size={32}
              className="text-yellow-600"
            />
          </div>
        )}

        <div>

          <h2 className="text-2xl font-bold text-gray-800">

            {isComplete
              ? "Emergency Ready"
              : "Profile Incomplete"}

          </h2>

          <p className="text-gray-500 mt-1">

            {isComplete
              ? "Your emergency profile is complete."
              : "Complete your emergency information for better assistance."}

          </p>

        </div>

      </div>


      {/* Progress */}

      <div className="mt-8">

        <div className="flex justify-between mb-2">

          <span className="text-sm text-gray-500">
            Profile Completion
          </span>

          <span className="text-sm font-semibold">
            {completedItems}/{totalItems}
          </span>

        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">

          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{
              width: `${(completedItems / totalItems) * 100}%`,
            }}
          />

        </div>

      </div>


      {/* Status Items */}

      <div className="mt-8 space-y-4">

        <StatusItem
          title="Blood Group Added"
          completed={bloodGroupAdded}
        />

        <StatusItem
          title="Medical Information Added"
          completed={medicalInfoAdded}
        />

        <StatusItem
          title="Emergency Contact Added"
          completed={emergencyContactAdded}
        />

      </div>


      {/* Last updated */}

      <div className="mt-8 flex justify-between items-center">

        <p className="text-gray-500 text-sm">
          Last Updated: Today
        </p>

        <button
          onClick={() =>
            window.location.href = "/dashboard/medical-profile"
          }
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Edit Profile
        </button>

      </div>

    </div>
  );
};


const StatusItem = ({ title, completed }) => {

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">

      <div className="flex items-center gap-3">

        {completed ? (
          <CheckCircle
            size={22}
            className="text-green-500"
          />
        ) : (
          <AlertCircle
            size={22}
            className="text-yellow-500"
          />
        )}

        <span className="font-medium text-gray-700">
          {title}
        </span>

      </div>

      <span
        className={
          completed
            ? "text-green-600 font-medium"
            : "text-yellow-600 font-medium"
        }
      >
        {completed ? "Added" : "Missing"}
      </span>

    </div>
  );
};

export default EmergencyStatus;