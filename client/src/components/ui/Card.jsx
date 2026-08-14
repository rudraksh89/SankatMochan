const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-3xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;