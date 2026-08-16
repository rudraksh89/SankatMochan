const InsuranceInfo = ({ insurance, setInsurance }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInsurance((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        Insurance Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Insurance Provider */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Insurance Provider
          </label>

          <input
            type="text"
            name="provider"
            value={insurance.provider}
            onChange={handleChange}
            placeholder="Insurance Provider"
            className="
              w-full
              border border-gray-300 dark:border-slate-700
              rounded-xl
              p-3
              bg-white dark:bg-slate-800
              text-slate-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-slate-500
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* Policy Number */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Policy Number
          </label>

          <input
            type="text"
            name="policyNumber"
            value={insurance.policyNumber}
            onChange={handleChange}
            placeholder="Policy Number"
            className="
              w-full
              border border-gray-300 dark:border-slate-700
              rounded-xl
              p-3
              bg-white dark:bg-slate-800
              text-slate-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-slate-500
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* Policy Holder */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Policy Holder
          </label>

          <input
            type="text"
            name="policyHolder"
            value={insurance.policyHolder}
            onChange={handleChange}
            placeholder="Policy Holder"
            className="
              w-full
              border border-gray-300 dark:border-slate-700
              rounded-xl
              p-3
              bg-white dark:bg-slate-800
              text-slate-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-slate-500
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* Valid Till */}
        <div>
          <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            Valid Till
          </label>

          <input
            type="date"
            name="validTill"
            value={insurance.validTill}
            onChange={handleChange}
            className="
              w-full
              border border-gray-300 dark:border-slate-700
              rounded-xl
              p-3
              bg-white dark:bg-slate-800
              text-slate-900 dark:text-white
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

      </div>
    </div>
  );
};

export default InsuranceInfo;