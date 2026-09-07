const AuthCard = ({ children }) => {
  return (
    <div
      className="
        w-full max-w-md
        rounded-3xl
        bg-slate-900/80 backdrop-blur-2xl
        border border-slate-800/80
        shadow-2xl shadow-blue-950/40
        p-8 sm:p-10
        text-white
      "
    >
      {children}
    </div>
  );
};

export default AuthCard;