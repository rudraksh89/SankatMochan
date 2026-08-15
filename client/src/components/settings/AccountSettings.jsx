import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import api from "../../api/axios";

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ============================
  // Get current user
  // ============================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");

        const user = res.data.user;

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          city: user.city || "",
        });

      } catch (error) {
        console.error("Failed to load user:", error);

        alert(
          error.response?.data?.message ||
          "Failed to load account details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ============================
  // Handle input
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // Save account
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await api.put(
        "/auth/update",
        formData
      );

      console.log(
        "Updated user:",
        res.data.user
      );

      alert(
        res.data.message ||
        "Account updated successfully"
      );

    } catch (error) {
      console.error(
        "Update account error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update account"
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8">
        <p className="text-gray-500">
          Loading account settings...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Account Settings
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Full Name */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>


        {/* Email */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>


        {/* Phone */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
            required
          />
        </div>


        {/* City */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your city"
          />
        </div>


        {/* Save button */}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
        >

          <Save size={20} />

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      </form>

    </div>
  );
};

export default AccountSettings;