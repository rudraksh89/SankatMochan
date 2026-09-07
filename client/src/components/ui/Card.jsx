const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl transition-all duration-300 hover:border-slate-700 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;