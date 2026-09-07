import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = ({ value, onChange, placeholder = "••••••••" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Lock size={18} />
      </div>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="
          w-full
          pl-10 pr-11 py-3
          rounded-xl
          border border-slate-800
          bg-slate-950/80
          text-white
          placeholder:text-slate-500
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
          transition-all duration-200
          text-sm
        "
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;