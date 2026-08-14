import { useState } from "react";
import api from "../../api/axios";

const MedicalDocuments = ({ documents, setDocuments }) => {
  const [documentType, setDocumentType] = useState("Prescription");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async () => {
    if (!file) {
      return alert("Please select a file");
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("document", file);
      formData.append("documentType", documentType);

      const res = await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDocuments((prev) => [...prev, res.data.document]);

      setFile(null);

      alert("Document uploaded successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (id) => {
    try {
      await api.delete(`/documents/${id}`);

      setDocuments((prev) => prev.filter((doc) => doc._id !== id));

      alert("Document deleted");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">
        Medical Documents
      </h2>

      <div className="space-y-4">

        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full border rounded-xl p-3"
        >
          <option>Prescription</option>
          <option>Medical Report</option>
          <option>Insurance Card</option>
          <option>X-Ray</option>
          <option>Other</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />

        <button
          onClick={uploadDocument}
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>

      </div>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-4">
        Uploaded Documents
      </h3>

      {documents.length === 0 ? (
        <p className="text-gray-500">
          No documents uploaded.
        </p>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="flex justify-between items-center border rounded-xl p-4"
            >
              <div>
                <p className="font-semibold">
                  {doc.documentType}
                </p>

                <p className="text-sm text-gray-500">
                  {doc.fileName}
                </p>
              </div>

              <div className="flex gap-3">

                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  View
                </a>

                <button
                  onClick={() => deleteDocument(doc._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
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