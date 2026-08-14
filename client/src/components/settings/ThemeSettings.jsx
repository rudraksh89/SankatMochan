const ThemeSettings = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Appearance
      </h2>

      <div className="space-y-4">

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="theme"
            defaultChecked
          />
          Light Mode
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="theme"
          />
          Dark Mode
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            name="theme"
          />
          System Default
        </label>

      </div>

    </div>
  );
};

export default ThemeSettings;