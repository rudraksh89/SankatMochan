import { useEffect, useState } from "react";
import api from "../api/axios";

const VerificationPage = () => {
  const [status, setStatus] = useState(null);

  const [documentType, setDocumentType] =
    useState("professional_id");

  const [file, setFile] = useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH STATUS
  // ==========================================

  const fetchStatus = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/verification/me");

      setStatus(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load verification status"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // ==========================================
  // UPLOAD
  // ==========================================

  const uploadDocument = async () => {
    if (!file) {
      alert("Please select a document");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "document",
        file
      );

      formData.append(
        "documentType",
        documentType
      );

      const response =
        await api.post(
          "/verification/upload",
          formData
        );

      alert(response.data.message);

      setFile(null);

      // Reset file input
      const fileInput =
        document.getElementById(
          "verification-document"
        );

      if (fileInput) {
        fileInput.value = "";
      }

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8">
        <p className="text-gray-500">
          Loading verification information...
        </p>
      </div>
    );
  }

  const verificationStatus =
    status?.user?.verificationStatus;

  const documents =
    status?.documents || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-md p-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Responder Verification
        </h1>

        <p className="text-gray-500 mt-2">
          Submit your professional credentials
          to become a verified emergency responder.
        </p>

      </div>

      {/* =====================================
          STATUS
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-md p-8">

        <h2 className="text-xl font-semibold text-gray-900">
          Verification Status
        </h2>

        {/* NOT SUBMITTED */}

        {verificationStatus ===
          "not_submitted" && (
          <div className="mt-5 p-5 rounded-xl bg-yellow-50 border border-yellow-200">

            <p className="font-semibold text-yellow-800">
              Verification Not Submitted
            </p>

            <p className="text-sm text-yellow-700 mt-1">
              Upload your professional document
              to start verification.
            </p>

          </div>
        )}

        {/* NOT REQUIRED */}

        {verificationStatus ===
          "not_required" && (
          <div className="mt-5 p-5 rounded-xl bg-gray-50 border">

            <p className="font-semibold text-gray-800">
              Verification Not Required
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Your account is registered as a
              normal user.
            </p>

          </div>
        )}

        {/* PENDING */}

        {verificationStatus ===
          "pending" && (
          <div className="mt-5 p-5 rounded-xl bg-blue-50 border border-blue-200">

            <p className="font-semibold text-blue-800">
              Verification Pending
            </p>

            <p className="text-sm text-blue-700 mt-1">
              Your document is currently being
              reviewed by an administrator.
            </p>

          </div>
        )}

        {/* APPROVED */}

        {verificationStatus ===
          "approved" && (
          <div className="mt-5 p-5 rounded-xl bg-green-50 border border-green-200">

            <p className="font-semibold text-green-800 text-lg">
              ✓ Verified Responder
            </p>

            <p className="text-sm text-green-700 mt-1">
              Your professional credentials
              have been verified.
            </p>

          </div>
        )}

        {/* REJECTED */}

        {verificationStatus ===
          "rejected" && (
          <div className="mt-5 p-5 rounded-xl bg-red-50 border border-red-200">

            <p className="font-semibold text-red-800">
              Verification Rejected
            </p>

            <p className="text-sm text-red-700 mt-1">
              Your document was rejected.
              Please upload a valid document.
            </p>

          </div>
        )}

      </div>

      {/* =====================================
          UPLOAD
      ====================================== */}

      {verificationStatus !== "approved" &&
        verificationStatus !== "pending" &&
        verificationStatus !== "not_required" && (
          <div className="bg-white rounded-2xl shadow-md p-8">

            <h2 className="text-xl font-semibold text-gray-900">
              Upload Verification Document
            </h2>

            <p className="text-gray-500 mt-2">
              Upload a valid document proving
              your professional identity.
            </p>

            {/* DOCUMENT TYPE */}

            <div className="mt-6">

              <label className="block font-medium mb-2">
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(e) =>
                  setDocumentType(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl p-3"
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

            {/* FILE */}

            <div className="mt-6">

              <label className="block font-medium mb-2">
                Document
              </label>

              <input
                id="verification-document"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) =>
                  setFile(
                    e.target.files[0]
                  )
                }
                className="w-full border border-gray-300 rounded-xl p-3"
              />

              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or PDF. Maximum size:
                10 MB.
              </p>

            </div>

            {/* BUTTON */}

            <button
              onClick={uploadDocument}
              disabled={uploading}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : "Submit for Verification"}
            </button>

          </div>
        )}

      {/* =====================================
          DOCUMENT HISTORY
      ====================================== */}

      {documents.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="text-xl font-semibold text-gray-900">
            Submitted Documents
          </h2>

          <div className="mt-5 space-y-4">

            {documents.map((document) => (
              <div
                key={document._id}
                className="border rounded-xl p-5"
              >

                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                  <div>

                    <p className="font-semibold">
                      {document.documentType}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {document.fileName}
                    </p>

                  </div>

                  <div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        document.status ===
                        "approved"
                          ? "bg-green-100 text-green-700"
                          : document.status ===
                            "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {document.status}
                    </span>

                  </div>

                </div>

                <a
                  href={document.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  View Document
                </a>

                {document.rejectionReason && (
                  <p className="mt-3 text-sm text-red-600">
                    Reason:{" "}
                    {document.rejectionReason}
                  </p>
                )}

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default VerificationPage;