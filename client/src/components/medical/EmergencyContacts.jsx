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

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Emergency Contacts
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Contact Name"
          value={contact.contactName}
          onChange={(e) =>
            handleChange("contactName", e.target.value)
          }
          className="border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Relationship"
          value={contact.relationship}
          onChange={(e) =>
            handleChange("relationship", e.target.value)
          }
          className="border rounded-xl p-3"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={contact.phone}
          onChange={(e) =>
            handleChange("phone", e.target.value)
          }
          className="border rounded-xl p-3"
        />

        <input
          type="email"
          placeholder="Email (Optional)"
          value={contact.email}
          onChange={(e) =>
            handleChange("email", e.target.value)
          }
          className="border rounded-xl p-3"
        />

        <input
          type="text"
          placeholder="Address (Optional)"
          value={contact.address}
          onChange={(e) =>
            handleChange("address", e.target.value)
          }
          className="border rounded-xl p-3 md:col-span-2"
        />

      </div>

      <button
        onClick={saveEmergencyContact}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
      >
        Save Emergency Contact
      </button>

    </div>
  );
};

export default EmergencyContacts;