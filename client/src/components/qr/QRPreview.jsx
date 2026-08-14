const QRPreview = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-4">
        Emergency QR
      </h2>

      <p className="text-gray-600 leading-7">
        This QR Code is unique to your account. Emergency responders,
        hospitals, police, or anyone helping you can scan it to access
        your emergency medical information.
      </p>

      <div className="mt-6 p-5 rounded-xl bg-blue-50 border border-blue-200">

        <h3 className="font-semibold text-blue-700">
          Your QR provides access to:
        </h3>

        <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
          <li>Blood Group</li>
          <li>Medical Conditions</li>
          <li>Allergies</li>
          <li>Current Medications</li>
          <li>Emergency Contact</li>
          <li>Insurance Information</li>
        </ul>

      </div>

      <div className="mt-6 p-5 rounded-xl bg-green-50 border border-green-200">

        <h3 className="font-semibold text-green-700">
          🔒 How it works
        </h3>

        <p className="mt-2 text-gray-700 leading-6">
          The QR code contains a secure public emergency link.
          When someone scans it, they are taken to your emergency
          page where your latest emergency information is displayed.
        </p>

      </div>

    </div>
  );
};

export default QRPreview;