import EmergencyInfo from "./EmergencyInfo";
import EmergencyQR from "./EmergencyQR";

const EmergencyCard = () => {
  return (
    <div
      id="emergency-card"
      className="relative overflow-hidden rounded-2xl bg-red-600 text-white shadow-xl p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* LEFT SIDE */}
        <EmergencyInfo />

        {/* RIGHT SIDE */}
        <div className="flex justify-center">
          <EmergencyQR />
        </div>

      </div>
    </div>
  );
};

export default EmergencyCard;