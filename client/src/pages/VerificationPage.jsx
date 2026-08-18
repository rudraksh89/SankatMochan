import { useEffect, useState } from "react";
import api from "../api/axios";

const VerificationPage = () => {
  const [status, setStatus] = useState(null);

  const [documentType, setDocumentType] = useState(
    "professional_id"
  );

  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await api.get("/verification/me");

      setStatus(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const uploadDocument = async () => {
    if (!file) {
      alert("Please select a document");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("document", file);
      formData.append(
        "documentType",
        documentType
      );

      const response = await api.post(
        "/verification/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);

      setFile(null);

      fetchStatus();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Upload failed"
      );

    } finally {
      setUploading(false);
    }
  };

  const verificationStatus =
    status?.user?.verificationStatus;

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-3xl font-bold">
          Responder Verification
        </h1>

        <p className="text-gray-500 mt-2">
          Submit your professional document to become
          a verified emergency responder.
        </p>


        {/* Status */}

        <div className="mt-8">

          {verificationStatus ===
            "not_submitted" && (
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">

              <p className="font-semibold text-yellow-800">
                Verification not submitted
              </p>

              <p className="text-sm text-yellow-700 mt-1">
                Upload your professional document
                to start verification.
              </p>

            </div>
          )}


          {verificationStatus === "pending" && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">

              <p className="font-semibold text-blue-800">
                Verification Pending
              </p>

              <p className="text-sm text-blue-700 mt-1">
                Your document is currently being
                reviewed by an administrator.
              </p>

            </div>
          )}


          {verificationStatus === "approved" && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">

              <p className="font-semibold text-green-800">
                ✓ Verified Responder
              </p>

              <p className="text-sm text-green-700 mt-1">
                Your professional credentials have
                been verified.
              </p>

            </div>
          )}


          {verificationStatus === "rejected" && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">

              <p className="font-semibold text-red-800">
                Verification Rejected
              </p>

              <p className="text-sm text-red-700 mt-1">
                Please submit a valid professional
                document.
              </p>

            </div>
          )}

        </div>


        {/* Upload */}

        {verificationStatus !== "approved" &&
          verificationStatus !== "pending" && (

          <div className="mt-8">

            <h2 className="text-xl font-semibold">
              Upload Verification Document
            </h2>


            <div className="mt-5">

              <label className="block font-medium mb-2">
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(e.target.value)
                }
                className="w-full border rounded-xl p-3"
              >

                <option value="professional_id">
                  Professional ID
                </option>

                <option value="medical_license">
                  Medical License
                </option>

                <option value="police_id">
                  Police ID
                </option>

                <option value="government_id">
                  Government ID
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </div>


            <div className="mt-5">

              <label className="block font-medium mb-2">
                Document
              </label>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
                className="w-full border rounded-xl p-3"
              />

            </div>


            <button
              onClick={uploadDocument}
              disabled={uploading}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : "Submit for Verification"}
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default VerificationPage;