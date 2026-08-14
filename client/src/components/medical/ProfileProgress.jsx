const ProfileProgress = ({
  profile,
  insurance,
  emergencyContacts,
  documents,
}) => {

  const profileDone =
    !!profile.bloodGroup &&
    !!profile.dateOfBirth &&
    !!profile.gender &&
    !!profile.height &&
    !!profile.weight;

  const medicalDone =
    !!profile.allergies &&
    !!profile.medicalConditions &&
    !!profile.medications;

  const emergencyDone = emergencyContacts.length > 0;

  const insuranceDone =
    !!insurance.provider &&
    !!insurance.policyNumber &&
    !!insurance.policyHolder &&
    !!insurance.validTill;

  const documentsDone = documents.length > 0;

  let completed = 0;

  if (profileDone) completed++;
  if (medicalDone) completed++;
  if (emergencyDone) completed++;
  if (insuranceDone) completed++;
  if (documentsDone) completed++;

  const progress = Math.round((completed / 5) * 100);

  console.log({
    profile,
    insurance,
    emergencyContacts,
    documents,
    profileDone,
    medicalDone,
    emergencyDone,
    insuranceDone,
    documentsDone,
    completed,
    progress,
  });

  return (
    <div className="bg-white rounded-2xl shadow p-8">

      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Profile Completion
        </h2>

        <span className="font-bold text-blue-600">
          {progress}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-gray-500">
        Complete your medical profile for better emergency assistance.
      </p>

    </div>
  );
};

export default ProfileProgress;