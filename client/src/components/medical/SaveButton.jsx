import { Save } from "lucide-react";

const SaveButton = ({ saveProfile }) => {
  return (
    <div className="flex justify-end pt-4">
      <button
        onClick={saveProfile}
        className="
          px-8 py-3.5 rounded-xl
          bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600
          hover:from-blue-500 hover:to-cyan-500
          text-white font-bold text-sm
          shadow-lg shadow-blue-600/30
          transition-all duration-300
          flex items-center gap-2.5
          hover:scale-[1.02]
        "
      >
        <Save size={18} />
        <span>Save Medical Profile</span>
      </button>
    </div>
  );
};

export default SaveButton;