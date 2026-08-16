import {
  Droplets,
  AlertTriangle,
  HeartPulse,
  HandHeart,
  Phone,
} from "lucide-react";

const HealthSummary = ({ profile, contacts }) => {

  const bloodGroup =
    profile?.bloodGroup || "Not Added";

  const allergies =
    profile?.allergies || "None";

  const medicalCondition =
    profile?.medicalConditions || "None";

  const organDonor =
    profile?.organDonor
      ? "Yes"
      : "No";

  const emergencyContacts =
    contacts?.length || 0;


  return (
    <div className="bg-white rounded-3xl p-8 shadow-md">

      <h2 className="text-3xl font-bold text-gray-800">
        Health Summary
      </h2>

      <p className="text-gray-500 mt-2">
        Quick overview of your emergency medical information.
      </p>


      <div className="grid md:grid-cols-2 gap-6 mt-8">


        {/* Blood Group */}

        <SummaryCard
          icon={
            <Droplets
              size={28}
              className="text-red-500"
            />
          }
          title="Blood Group"
          value={bloodGroup}
        />


        {/* Allergies */}

        <SummaryCard
          icon={
            <AlertTriangle
              size={28}
              className="text-yellow-500"
            />
          }
          title="Allergies"
          value={allergies}
        />


        {/* Medical Condition */}

        <SummaryCard
          icon={
            <HeartPulse
              size={28}
              className="text-blue-500"
            />
          }
          title="Medical Condition"
          value={medicalCondition}
        />


        {/* Organ Donor */}

        <SummaryCard
          icon={
            <HandHeart
              size={28}
              className="text-pink-500"
            />
          }
          title="Organ Donor"
          value={organDonor}
        />


        {/* Emergency Contacts */}

        <SummaryCard
          icon={
            <Phone
              size={28}
              className="text-green-500"
            />
          }
          title="Emergency Contacts"
          value={emergencyContacts}
        />

      </div>

    </div>
  );
};


const SummaryCard = ({
  icon,
  title,
  value,
}) => {

  return (
    <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-5">

      <div className="bg-white rounded-xl p-4 shadow-sm">
        {icon}
      </div>

      <div>

        <p className="text-gray-500">
          {title}
        </p>

        <p className="text-xl font-semibold text-gray-800 mt-1">
          {value}
        </p>

      </div>

    </div>
  );
};

export default HealthSummary;