const EmergencyCardPreview = ({
  user,
  medicalProfile,
  emergencyContact,
}) => {
  // Handle different possible API response shapes
  const contact = Array.isArray(emergencyContact)
    ? emergencyContact[0]
    : emergencyContact;

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Emergency Card Preview
      </h2>

      {/* Emergency Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white shadow-lg">

        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-5">
          <div className="flex items-center gap-3">

            <div className="text-3xl">
              🚑
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Emergency Medical Card
              </h1>

              <p className="text-red-100 text-sm mt-1">
                Sankat Mochan Emergency Information
              </p>
            </div>

          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">

          {/* Name */}
          <div className="mb-5">
            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="text-xl font-bold text-gray-900">
              {user?.fullName || "Not Available"}
            </p>
          </div>


          {/* Medical Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Blood Group */}
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Blood Group
              </p>

              <p className="text-lg font-bold text-red-600">
                {medicalProfile?.bloodGroup || "Not Available"}
              </p>
            </div>


            {/* Date of Birth */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Date of Birth
              </p>

              <p className="font-semibold text-gray-900">
                {medicalProfile?.dateOfBirth
                  ? new Date(
                      medicalProfile.dateOfBirth
                    ).toLocaleDateString("en-IN")
                  : "Not Available"}
              </p>
            </div>


            {/* Gender */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Gender
              </p>

              <p className="font-semibold text-gray-900">
                {medicalProfile?.gender || "Not Available"}
              </p>
            </div>


            {/* Height */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Height
              </p>

              <p className="font-semibold text-gray-900">
                {medicalProfile?.height
                  ? `${medicalProfile.height} cm`
                  : "Not Available"}
              </p>
            </div>


            {/* Weight */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Weight
              </p>

              <p className="font-semibold text-gray-900">
                {medicalProfile?.weight
                  ? `${medicalProfile.weight} kg`
                  : "Not Available"}
              </p>
            </div>


            {/* Organ Donor */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Organ Donor
              </p>

              <p className="font-semibold text-gray-900">
                {medicalProfile?.organDonor
                  ? "Yes"
                  : "No"}
              </p>
            </div>

          </div>


          {/* Allergies */}
          <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-xl p-4">

            <p className="text-sm font-semibold text-yellow-700">
              ⚠️ Allergies
            </p>

            <p className="mt-1 text-gray-800">
              {medicalProfile?.allergies || "None"}
            </p>

          </div>


          {/* Medical Conditions */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">

            <p className="text-sm font-semibold text-blue-700">
              🏥 Medical Conditions
            </p>

            <p className="mt-1 text-gray-800">
              {medicalProfile?.medicalConditions || "None"}
            </p>

          </div>


          {/* Medications */}
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">

            <p className="text-sm font-semibold text-purple-700">
              💊 Medications
            </p>

            <p className="mt-1 text-gray-800">
              {medicalProfile?.medications || "None"}
            </p>

          </div>


          {/* ========================= */}
          {/* Emergency Contact */}
          {/* ========================= */}

          <div className="mt-6 border-t pt-6">

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              🚨 Emergency Contact
            </h2>

            {contact ? (

              <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                {/* Contact Name */}
                <p className="font-bold text-gray-900 text-lg">
                  {contact.contactName ||
                    contact.name ||
                    "Not Available"}
                </p>

                {/* Relationship */}
                <p className="text-gray-600 mt-1">
                  {contact.relationship ||
                    contact.relation ||
                    "Relationship not specified"}
                </p>

                {/* Phone */}
                <p className="text-gray-700 mt-2 font-medium">
                  📱 {contact.phone ||
                    contact.phoneNumber ||
                    "Phone not available"}
                </p>

                {/* Call Button */}
                {(contact.phone || contact.phoneNumber) && (
                  <a
                    href={`tel:${
                      contact.phone ||
                      contact.phoneNumber
                    }`}
                    className="inline-flex items-center mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                  >
                    📞 Call Emergency Contact
                  </a>
                )}

              </div>

            ) : (

              <div className="bg-gray-100 rounded-xl p-4">

                <p className="text-gray-500">
                  No emergency contact available.
                </p>

              </div>

            )}

          </div>


          {/* Footer */}
          <div className="mt-6 pt-5 border-t text-center">

            <p className="text-sm text-gray-500">
              Scan the QR code to access this emergency
              information.
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Powered by Sankat Mochan
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EmergencyCardPreview;