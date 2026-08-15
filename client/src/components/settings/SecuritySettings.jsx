import { useState } from "react";
import { Lock } from "lucide-react";
import api from "../../api/axios";

const SecuritySettings = () => {

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

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
  // Change password
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      alert("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters"
      );
      return;
    }

    try {

      setSaving(true);

      const res = await api.put(
        "/auth/change-password",
        {
          currentPassword:
            formData.currentPassword,

          newPassword:
            formData.newPassword,

          confirmPassword:
            formData.confirmPassword,
        }
      );

      alert(
        res.data.message ||
        "Password changed successfully"
      );

      // Clear form after successful change
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {

      console.error(
        "Change password error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to change password"
      );

    } finally {

      setSaving(false);

    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Security
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Current Password */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Password
          </label>

          <input
            type="password"
            name="currentPassword"
            value={
              formData.currentPassword
            }
            onChange={handleChange}
            placeholder="Enter current password"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>


        {/* New Password */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>

          <input
            type="password"
            name="newPassword"
            value={
              formData.newPassword
            }
            onChange={handleChange}
            placeholder="Enter new password"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>


        {/* Confirm Password */}

        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
            placeholder="Confirm new password"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>


        {/* Change Password */}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition"
        >

          <Lock size={20} />

          {saving
            ? "Changing..."
            : "Change Password"}

        </button>

      </form>

    </div>
  );
};

export default SecuritySettings;