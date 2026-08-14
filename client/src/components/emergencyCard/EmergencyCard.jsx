import EmergencyInfo from "./EmergencyInfo";
import EmergencyQR from "./EmergencyQR";

const EmergencyCard = () => {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl text-white p-10 flex justify-between items-center">

      <EmergencyInfo />

      <EmergencyQR />

    </div>
  );
};

export default EmergencyCard;