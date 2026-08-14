const SaveButton = ({ saveProfile }) => {
  return (
    <div className="flex justify-end">

      <button
        onClick={saveProfile}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
      >
        Save Medical Profile
      </button>

    </div>
  );
};

export default SaveButton;