const AuthCard = ({ children }) => {
  return (
    <div
      className="
        w-full max-w-md
        rounded-3xl
        bg-white dark:bg-slate-900
        shadow-2xl
        p-8
        text-slate-800 dark:text-white
      "
    >
      {children}
    </div>
  );
};

export default AuthCard;