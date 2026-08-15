import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const DangerZone = () => {
  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?\n\n" +
      "This action cannot be undone. All your medical information, " +
      "emergency contacts, QR codes, and uploaded documents will be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const res = await api.delete("/auth/delete-account");

      if (res.data.success) {
        // Remove authentication token
        localStorage.removeItem("token");

        // Redirect to login
        navigate("/login", { replace: true });
      }

    } catch (error) {
      console.error("Delete account error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to delete your account. Please try again."
      );

    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="
        bg-red-50 dark:bg-red-950/30
        border border-red-300 dark:border-red-900
        rounded-2xl p-8
      "
    >

      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
        Danger Zone
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mt-3">
        Deleting your account will permanently remove all your
        medical information, emergency contacts, QR codes,
        and uploaded documents.
      </p>

      <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={deleting}
        className="
          mt-6
          bg-red-600
          hover:bg-red-700
          disabled:bg-red-400
          disabled:cursor-not-allowed
          text-white
          px-6 py-3
          rounded-xl
          font-semibold
          transition
        "
      >
        {deleting ? "Deleting Account..." : "Delete My Account"}
      </button>

    </div>
  );
};

export default DangerZone;