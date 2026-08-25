import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/axios";

const ResponderEmergencyPage = () => {
  const { userId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/responder/emergency/${userId}`
        );

        setData(response.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load emergency information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading emergency information...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    patient,
    medicalProfile,
    emergencyContacts,
    insurance,
  } = data;

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-8">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="bg-blue-600 text-white rounded-2xl p-7 shadow-lg">

          <p className="text-blue-100">
            Verified Responder Access
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Emergency Medical Information
          </h1>

          <p className="mt-2 text-blue-100">
            Information accessed for emergency assistance.
          </p>

        </div>

        {/* PATIENT */}

        <div className="bg-white rounded-2xl shadow mt-6 p-6">

          <h2 className="text-xl font-bold">
            Patient Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <Info
              label="Full Name"
              value={patient.fullName}
            />

            <Info
              label="Phone"
              value={patient.phone}
            />

            <Info
              label="Email"
              value={patient.email}
            />

          </div>

        </div>

        {/* MEDICAL PROFILE */}

        <div className="bg-white rounded-2xl shadow mt-6 p-6">

          <h2 className="text-xl font-bold">
            Medical Information
          </h2>

          {medicalProfile ? (
            <div className="grid md:grid-cols-2 gap-5 mt-5">

              <Info
                label="Blood Group"
                value={medicalProfile.bloodGroup}
              />

              <Info
                label="Date of Birth"
                value={medicalProfile.dateOfBirth}
              />

              <Info
                label="Gender"
                value={medicalProfile.gender}
              />

              <Info
                label="Height"
                value={medicalProfile.height}
              />

              <Info
                label="Weight"
                value={medicalProfile.weight}
              />

              <Info
                label="Allergies"
                value={medicalProfile.allergies}
              />

              <Info
                label="Medical Conditions"
                value={medicalProfile.medicalConditions}
              />

              <Info
                label="Medications"
                value={medicalProfile.medications}
              />

              <Info
                label="Organ Donor"
                value={
                  medicalProfile.organDonor
                    ? "Yes"
                    : "No"
                }
              />

              <Info
                label="Address"
                value={medicalProfile.address}
              />

            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              No medical profile available.
            </p>
          )}

        </div>

        {/* EMERGENCY CONTACTS */}

        <div className="bg-white rounded-2xl shadow mt-6 p-6">

          <h2 className="text-xl font-bold">
            Emergency Contacts
          </h2>

          {emergencyContacts?.length > 0 ? (
            <div className="space-y-4 mt-5">

              {emergencyContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="border rounded-xl p-4"
                >
                  <p className="font-bold">
                    {contact.name}
                  </p>

                  <p className="text-gray-600">
                    {contact.relationship}
                  </p>

                  <p className="text-blue-600 mt-1">
                    {contact.phone}
                  </p>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              No emergency contacts available.
            </p>
          )}

        </div>

        {/* INSURANCE */}

        <div className="bg-white rounded-2xl shadow mt-6 p-6 mb-10">

          <h2 className="text-xl font-bold">
            Insurance Information
          </h2>

          {insurance?.length > 0 ? (
            <div className="space-y-4 mt-5">

              {insurance.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-xl p-4"
                >
                  <p className="font-bold">
                    {item.provider}
                  </p>

                  <p className="text-gray-600">
                    Policy: {item.policyNumber}
                  </p>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              No insurance information available.
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

const Info = ({ label, value }) => {
  return (
    <div className="bg-slate-50 rounded-xl p-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value || "Not provided"}
      </p>

    </div>
  );
};

export default ResponderEmergencyPage;