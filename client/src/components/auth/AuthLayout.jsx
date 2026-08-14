const AuthLayout = ({ left, right }) => {
  return (
    <section className="min-h-screen grid lg:grid-cols-2">

      {/* Left */}
      <div className="hidden lg:flex bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-500">
        {left}
      </div>

      {/* Right */}
      <div className="flex items-center justify-center bg-slate-100 p-6">
        {right}
      </div>

    </section>
  );
};

export default AuthLayout;