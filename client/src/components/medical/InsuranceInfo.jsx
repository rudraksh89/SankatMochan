const InsuranceInfo = ({ insurance, setInsurance }) => {

  const handleChange = (e) => {

    const { name, value } = e.target;

    setInsurance((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  return (

    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        Insurance Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <label className="block mb-2 font-medium">
            Insurance Provider
          </label>

          <input
            type="text"
            name="provider"
            value={insurance.provider}
            onChange={handleChange}
            placeholder="Insurance Provider"
            className="w-full border rounded-xl p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Policy Number
          </label>

          <input
            type="text"
            name="policyNumber"
            value={insurance.policyNumber}
            onChange={handleChange}
            placeholder="Policy Number"
            className="w-full border rounded-xl p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Policy Holder
          </label>

          <input
            type="text"
            name="policyHolder"
            value={insurance.policyHolder}
            onChange={handleChange}
            placeholder="Policy Holder"
            className="w-full border rounded-xl p-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Valid Till
          </label>

          <input
            type="date"
            name="validTill"
            value={insurance.validTill}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

        </div>

      </div>

    </div>

  );

};

export default InsuranceInfo;