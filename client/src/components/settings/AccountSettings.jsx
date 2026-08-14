const AccountSettings = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Account Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Full Name"
          className="border rounded-xl p-3"
        />

        <input
          type="email"
          placeholder="Email"
          className="border rounded-xl p-3"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="City"
          className="border rounded-xl p-3"
        />

      </div>

    </div>
  );
};

export default AccountSettings;