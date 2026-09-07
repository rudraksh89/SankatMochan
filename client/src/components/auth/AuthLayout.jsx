const AuthLayout = ({ left, right }) => {
  return (
    <section className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] top-10 left-10 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] bottom-10 right-10 pointer-events-none" />

      {/* Left Column Visual */}
      <div className="hidden lg:flex items-center justify-center relative border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/50 to-indigo-950/30 pointer-events-none" />
        <div className="relative z-10 w-full max-w-lg p-10">
          {left}
        </div>
      </div>

      {/* Right Column Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {right}
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;