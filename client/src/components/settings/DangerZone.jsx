const DangerZone = () => {
  return (
    <div className="bg-red-50 border border-red-300 rounded-2xl p-8">

      <h2 className="text-2xl font-bold text-red-600">
        Danger Zone
      </h2>

      <p className="text-gray-600 mt-3">
        Deleting your account will permanently remove all your
        medical information, emergency contacts, QR codes,
        and uploaded documents.
      </p>

      <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl">

        Delete My Account

      </button>

    </div>
  );
};

export default DangerZone;