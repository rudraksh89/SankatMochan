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
        setError("");

        const response = await api.get(
          `/responder/emergency/${userId}`
        );

        console.log("RESPONDER EMERGENCY DATA:", response.data);

        setData(response.data);
      } catch (error) {
        console.error("Emergency API Error:", error);

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

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading emergency information...
        </p>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

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

  // IMPORTANT:
  // documents is now included
  const {
    patient,
    medicalProfile,
    emergencyContacts,
    insurance,
    documents,
  } = data;

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-8">

      <div className="max-w-5xl mx-auto">

        {/* =====================================
            HEADER
        ===================================== */}

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


        {/* =====================================
            PATIENT INFORMATION
        ===================================== */}

        <div className="bg-white rounded-2xl shadow mt-6 p-6">

          <h2 className="text-xl font-bold">
            Patient Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <Info
              label="Full Name"
              value={patient?.fullName}
            />

            <Info
              label="Phone"
              value={patient?.phone}
            />

            <Info
              label="Email"
              value={patient?.email}
            />

          </div>

        </div>


        {/* =====================================
            MEDICAL PROFILE
        ===================================== */}

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


        {/* =====================================
            EMERGENCY CONTACTS
        ===================================== */}

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
                    {contact.contactName ||
                      contact.name ||
                      "Not provided"}
                  </p>

                  <p className="text-gray-600">
                    {contact.relationship ||
                      "Not provided"}
                  </p>

                  <p className="text-blue-600 mt-1">
                    {contact.phone ||
                      "Not provided"}
                  </p>

                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-block mt-3 bg-red-600 text-white px-5 py-2 rounded-lg"
                    >
                      📞 Call Contact
                    </a>
                  )}

                </div>

              ))}

            </div>

          ) : (

            <p className="text-gray-500 mt-4">
              No emergency contacts available.
            </p>

          )}

        </div>


        {/* =====================================
            INSURANCE
        ===================================== */}

        <div className="bg-white rounded-2xl shadow mt-6 p-6">

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


        {/* =====================================
            MEDICAL DOCUMENTS
        ===================================== */}

        <div className="bg-white rounded-2xl shadow mt-6 p-6 mb-10">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-bold">
              📄 Medical Documents
            </h2>

            <span className="text-sm text-blue-600 font-semibold">
              Patient Records
            </span>

          </div>


          {documents?.length > 0 ? (

            <div className="space-y-4 mt-5">

              {documents.map((document) => (

                <div
                  key={document._id}
                  className="border rounded-xl p-5 bg-slate-50"
                >

                  {/* DOCUMENT NAME */}

                  <p className="font-bold text-lg">
                    {document.fileName}
                  </p>


                  {/* DOCUMENT TYPE */}

                  <p className="text-gray-600 mt-1">
                    Type:{" "}
                    {formatDocumentType(
                      document.documentType
                    )}
                  </p>


                  {/* STATUS */}

                  <p className="text-blue-600 font-semibold mt-2 text-xs uppercase tracking-wide">
                    Patient Health Record
                  </p>


                  {/* OPEN DOCUMENT */}

                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    📄 View Document
                  </a>

                </div>

              ))}

            </div>

          ) : (

            <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-5">

              <p className="font-semibold text-slate-700">
                No medical documents uploaded by patient.
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Patient's prescriptions, lab reports, and medical summaries will appear here when uploaded.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};


// =====================================
// INFO COMPONENT
// =====================================

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


// =====================================
// DOCUMENT TYPE FORMATTER
// =====================================

const formatDocumentType = (type) => {

  if (!type) {
    return "Medical Document";
  }

  const types = {
    prescription: "Prescription",
    medical_report: "Medical Report",
    blood_report: "Blood Test Report",
    scan_report: "MRI / CT / X-Ray Scan",
    discharge_summary: "Hospital Discharge Summary",
    other: "Other Medical Document",
  };

  return types[type] || type.replace(/_/g, " ").toUpperCase();
};


export default ResponderEmergencyPage;