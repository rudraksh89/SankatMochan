import {
  Download,
  Printer,
  Share2,
} from "lucide-react";

const EmergencyActions = () => {
  return (
    <div className="flex gap-5">

      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">

        <Download />

        Download PDF

      </button>

      <button className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">

        <Printer />

        Print

      </button>

      <button className="bg-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">

        <Share2 />

        Share

      </button>

    </div>
  );
};

export default EmergencyActions;