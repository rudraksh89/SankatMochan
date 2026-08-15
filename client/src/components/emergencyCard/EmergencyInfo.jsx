import { useEffect, useState } from "react";
import api from "../../api/axios";

const EmergencyInfo = () => {

  const [user, setUser] = useState(null);
  const [medicalProfile, setMedicalProfile] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchEmergencyInfo();
  }, []);


  const fetchEmergencyInfo = async () => {
    try {

      setLoading(true);

      // Get medical profile
      const profileRes = await api.get("/profile");

      console.log(
        "EMERGENCY CARD PROFILE:",
        profileRes.data
      );


      setUser(profileRes.data.user);

      setMedicalProfile(
        profileRes.data.profile
      );


      // Get emergency contact
      const emergencyRes = await api.get("/emergency");

      console.log(
        "EMERGENCY CARD CONTACT RESPONSE:",
        emergencyRes.data
      );


      const contacts =
        emergencyRes.data.contacts || [];


      const contact =
        contacts.length > 0
          ? contacts[0]
          : null;


      console.log(
        "EMERGENCY CARD CONTACT:",
        contact
      );


      setEmergencyContact(contact);

    } catch (error) {

      console.error(
        "Failed to load emergency information:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-gray-500">
          Loading emergency information...
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-4">

      {/* Name */}
      <h2 className="text-3xl font-bold">
        {user?.fullName || "Not Available"}
      </h2>


      {/* Blood Group */}
      <p>
        🩸 Blood Group :{" "}
        {medicalProfile?.bloodGroup || "Not Available"}
      </p>


      {/* Allergy */}
      <p>
        ⚠ Allergy :{" "}
        {medicalProfile?.allergies || "None"}
      </p>


      {/* Medical Condition */}
      <p>
        💊 Medical Condition :{" "}
        {medicalProfile?.medicalConditions || "None"}
      </p>


      {/* Emergency Contact */}
      <p>
        📞 Emergency Contact :{" "}
        {emergencyContact?.phone || "Not Available"}
      </p>

    </div>
  );
};

export default EmergencyInfo;