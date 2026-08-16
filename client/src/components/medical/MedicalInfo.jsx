const MedicalInfo = ({ profile, setProfile }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Medical Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Blood Group */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Blood Group
          </label>

          <select
            name="bloodGroup"
            value={profile.bloodGroup}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl p-3
                       bg-white dark:bg-slate-800
                       text-slate-800 dark:text-white
                       focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Blood Group</option>

            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Height (cm)
          </label>

          <input
            type="number"
            name="height"
            value={profile.height}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl p-3
                       bg-white dark:bg-slate-800
                       text-slate-800 dark:text-white
                       placeholder:text-gray-400 dark:placeholder:text-slate-500
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Weight (kg)
          </label>

          <input
            type="number"
            name="weight"
            value={profile.weight}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl p-3
                       bg-white dark:bg-slate-800
                       text-slate-800 dark:text-white
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Allergies */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Allergies
          </label>

          <input
            type="text"
            name="allergies"
            value={profile.allergies}
            onChange={handleChange}
            placeholder="Penicillin, Dust..."
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl p-3
                       bg-white dark:bg-slate-800
                       text-slate-800 dark:text-white
                       placeholder:text-gray-400 dark:placeholder:text-slate-500
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Medical Conditions */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Medical Conditions
          </label>

          <textarea
            rows="4"
            name="medicalConditions"
            value={profile.medicalConditions}
            onChange={handleChange}
            placeholder="Diabetes, Asthma..."
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl p-3
                       bg-white dark:bg-slate-800
                       text-slate-800 dark:text-white
                       placeholder:text-gray-400 dark:placeholder:text-slate-500
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Medications */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Current Medications
          </label>

          <textarea
            rows="3"
            name="medications"
            value={profile.medications}
            onChange={handleChange}
            placeholder="Mention medicines..."
            className="w-full border border-gray-300 dark:border-slate-700 rounded-xl p-3
                       bg-white dark:bg-slate-800
                       text-slate-800 dark:text-white
                       placeholder:text-gray-400 dark:placeholder:text-slate-500
                       focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

    </div>
  );
};

export default MedicalInfo;