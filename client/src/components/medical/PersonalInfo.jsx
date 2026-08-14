const PersonalInfo = ({ user, profile, setProfile }) => {

  const handleChange = (e) => {

    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  return (

    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Full Name */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={user?.fullName || ""}
            readOnly
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

        </div>

        {/* Email */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

        </div>

        {/* Phone */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Phone Number
          </label>

          <input
            type="text"
            value={user?.phone || ""}
            readOnly
            className="w-full border rounded-xl p-3 bg-gray-100"
          />

        </div>

        {/* Date of Birth */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Date of Birth
          </label>

          <input
            type="date"
            name="dateOfBirth"
            value={profile.dateOfBirth}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Gender */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Gender
          </label>

          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
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