const AuthCard = ({ children }) => {
  return (
    <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8">
      {children}
    </div>
  );
};

export default AuthCard;