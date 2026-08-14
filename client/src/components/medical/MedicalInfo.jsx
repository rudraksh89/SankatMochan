const MedicalInfo = ({ profile, setProfile }) => {

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
        Medical Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Blood Group */}

        <div>

          <label className="block mb-2 font-medium">
            Blood Group
          </label>

          <select
            name="bloodGroup"
            value={profile.bloodGroup}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
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

          <label className="block mb-2 font-medium">
            Height (cm)
          </label>

          <input
            type="number"
            name="height"
            value={profile.height}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

        </div>

        {/* Weight */}

        <div>

          <label className="block mb-2 font-medium">
            Weight (kg)
          </label>

          <input
            type="number"
            name="weight"
            value={profile.weight}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

        </div>

        {/* Allergies */}

        <div>

          <label className="block mb-2 font-medium">
            Allergies
          </label>

          <input
            type="text"
            name="allergies"
            value={profile.allergies}
            onChange={handleChange}
            placeholder="Penicillin, Dust..."
            className="w-full border rounded-xl p-3"
          />

        </div>

        {/* Medical Conditions */}

        <div className="md:col-span-2">

          <label className="block mb-2 font-medium">
            Medical Conditions
          </label>

          <textarea
            rows="4"
            name="medicalConditions"
            value={profile.medicalConditions}
            onChange={handleChange}
            placeholder="Diabetes, Asthma..."
            className="w-full border rounded-xl p-3"
          />

        </div>

        {/* Medications */}

        <div className="md:col-span-2">

          <label className="block mb-2 font-medium">
            Current Medications
          </label>

          <textarea
            rows="3"
            name="medications"
            value={profile.medications}
            onChange={handleChange}
            placeholder="Mention medicines..."
            className="w-full border rounded-xl p-3"
          />

        </div>

      </div>

    </div>
  );
};

export default MedicalInfo;