import api from "../../api/axios";

const EmergencyContacts = ({
  emergencyContacts,
  setEmergencyContacts,
}) => {

  const contact =
    emergencyContacts[0] || {
      contactName: "",
      relationship: "",
      phone: "",
      email: "",
      address: "",
    };

  const handleChange = (field, value) => {
    setEmergencyContacts([
      {
        ...contact,
        [field]: value,
      },
    ]);
  };

  const saveEmergencyContact = async () => {
    try {
      if (contact._id) {
        await api.put("/emergency", contact);
      } else {
        await api.post("/emergency", contact);
      }

      alert("Emergency Contact Saved");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to save contact"
      );
    }
  };

  const inputClass = `
    w-full
    border border-gray-300 dark:border-slate-700
    rounded-xl
    p-3
    bg-white dark:bg-slate-800
    text-slate-900 dark:text-white
    placeholder:text-gray-400 dark:placeholder:text-slate-500
    outline-none
    focus:ring-2
    focus:ring-blue-500
  `;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        Emergency Contacts
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Contact Name */}
        <input
          type="text"
          placeholder="Contact Name"
          value={contact.contactName}
          onChange={(e) =>
            handleChange("contactName", e.target.value)
          }
          className={inputClass}
        />

        {/* Relationship */}
        <input
          type="text"
          placeholder="Relationship"
          value={contact.relationship}
          onChange={(e) =>
            handleChange("relationship", e.target.value)
          }
          className={inputClass}
        />

        {/* Phone */}
        <input
          type="tel"
          placeholder="Phone Number"
          value={contact.phone}
          onChange={(e) =>
            handleChange("phone", e.target.value)
          }
          className={inputClass}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email (Optional)"
          value={contact.email}
          onChange={(e) =>
            handleChange("email", e.target.value)
          }
          className={inputClass}
        />

        {/* Address */}
        <input
          type="text"
          placeholder="Address (Optional)"
          value={contact.address}
          onChange={(e) =>
            handleChange("address", e.target.value)
          }
          className={`${inputClass} md:col-span-2`}
        />

      </div>

      <button
        onClick={saveEmergencyContact}
        className="
          mt-6
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-6
          py-3
          rounded-xl
          transition
        "
      >
        Save Emergency Contact
      </button>

    </div>
  );
};

export default EmergencyContacts;