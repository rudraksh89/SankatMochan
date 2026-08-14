const SecuritySettings = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Security
      </h2>

      <div className="space-y-5">

        <input
          type="password"
          placeholder="Current Password"
          className="w-full border rounded-xl p-3"
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border rounded-xl p-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border rounded-xl p-3"
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">

          Change Password

        </button>

      </div>

    </div>
  );
};

export default SecuritySettings;