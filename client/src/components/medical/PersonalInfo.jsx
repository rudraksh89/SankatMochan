const PersonalInfo = ({ user, profile, setProfile }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md dark:shadow-black/20 p-8 border border-gray-200 dark:border-slate-700">

      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Full Name
          </label>

          <input
            type="text"
            value={user?.fullName || ""}
            readOnly
            className="
              w-full
              border border-gray-200 dark:border-slate-700
              rounded-xl
              p-3
              bg-gray-100 dark:bg-slate-800
              text-gray-700 dark:text-gray-200
              outline-none
            "
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email
          </label>

          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="
              w-full
              border border-gray-200 dark:border-slate-700
              rounded-xl
              p-3
              bg-gray-100 dark:bg-slate-800
              text-gray-700 dark:text-gray-200
              outline-none
            "
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Phone Number
          </label>

          <input
            type="text"
            value={user?.phone || ""}
            readOnly
            className="
              w-full
              border border-gray-200 dark:border-slate-700
              rounded-xl
              p-3
              bg-gray-100 dark:bg-slate-800
              text-gray-700 dark:text-gray-200
              outline-none
            "
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Date of Birth
          </label>

          <input
            type="date"
            name="dateOfBirth"
            value={profile.dateOfBirth}
            onChange={handleChange}
            className="
              w-full
              border border-gray-300 dark:border-slate-700
              rounded-xl
              p-3
              bg-white dark:bg-slate-800
              text-gray-900 dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Gender
          </label>

          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="
              w-full
              border border-gray-300 dark:border-slate-700
              rounded-xl
              p-3
              bg-white dark:bg-slate-800
              text-gray-900 dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default PersonalInfo;