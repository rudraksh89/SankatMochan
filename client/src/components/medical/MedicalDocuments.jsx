import { useState } from "react";
import api from "../../api/axios";

const MedicalDocuments = ({ documents, setDocuments }) => {
  const [documentType, setDocumentType] =
    useState("prescription");

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // =====================================================
  // UPLOAD
  // =====================================================

  const uploadDocument = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("document", file);
      formData.append("documentType", documentType);

      const res = await api.post(
        "/documents",
        formData
      );

      setDocuments((prev) => [
        ...prev,
        res.data.document,
      ]);

      setFile(null);

      // Reset file input
      const fileInput =
        document.getElementById("medical-document");

      if (fileInput) {
        fileInput.value = "";
      }

      alert("Document uploaded successfully");

    } catch (err) {
      console.error(
        "DOCUMENT UPLOAD ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Upload failed"
      );

    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteDocument = async (id) => {
    try {
      await api.delete(
        `/documents/${id}`
      );

      setDocuments((prev) =>
        prev.filter(
          (doc) => doc._id !== id
        )
      );

      alert("Document deleted");

    } catch (err) {
      console.error(
        "DOCUMENT DELETE ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to delete document"
      );
    }
  };

  // =====================================================
  // DISPLAY NAME
  // =====================================================

  const getDocumentTypeName = (type) => {
    switch (type) {
      case "prescription":
        return "Prescription";

      case "medical_report":
        return "Medical Report";

      case "blood_report":
        return "Blood Report";

      case "scan_report":
        return "Scan / X-Ray Report";

      case "discharge_summary":
        return "Discharge Summary";

      case "other":
        return "Other";

      default:
        return type;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        Medical Documents
      </h2>

      {/* =================================================
          UPLOAD
      ================================================= */}

      <div className="space-y-4">

        <select
          value={documentType}
          onChange={(e) =>
            setDocumentType(e.target.value)
          }
          className="w-full border border-gray-300 dark:border-slate-700 rounded-xl p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <option value="prescription">
            Prescription
          </option>

          <option value="medical_report">
            Medical Report
          </option>

          <option value="blood_report">
            Blood Report
          </option>

          <option value="scan_report">
            Scan / X-Ray Report
          </option>

          <option value="discharge_summary">
            Discharge Summary
          </option>

          <option value="other">
            Other
          </option>
        </select>

        <input
          id="medical-document"
          type="file"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
          className="w-full text-slate-700 dark:text-slate-300"
        />

        <button
          onClick={uploadDocument}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl"
        >
          {uploading
            ? "Uploading..."
            : "Upload Document"}
        </button>

      </div>

      <hr className="my-8 border-gray-200 dark:border-slate-700" />

      {/* =================================================
          DOCUMENT LIST
      ================================================= */}

      <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
        Uploaded Documents
      </h3>

      {documents.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400">
          No documents uploaded.
        </p>
      ) : (
        <div className="space-y-4">

          {documents.map((doc) => (
            <div
              key={doc._id}
              className="flex justify-between items-center border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800"
            >

              <div>

                <p className="font-semibold text-slate-900 dark:text-white">
                  {getDocumentTypeName(
                    doc.documentType
                  )}
                </p>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {doc.fileName}
                </p>

              </div>

              <div className="flex gap-3">

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  View
                </a>

                <button
                  onClick={() =>
                    deleteDocument(doc._id)
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default MedicalDocuments;