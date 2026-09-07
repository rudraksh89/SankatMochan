import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { BadgeCheck, Upload, FileText, CheckCircle2, AlertTriangle, Clock, ExternalLink, Loader2 } from "lucide-react";
import api from "../api/axios";

const VerificationPage = () => {
  const [status, setStatus] = useState(null);
  const [documentType, setDocumentType] = useState("professional_id");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get("/verification/me");
      setStatus(response.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load verification status");
    } finally {
      setLoading(false);
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
      formData.append("documentType", documentType);

      const response = await api.post("/verification/upload", formData);
      alert(response.data.message);
      setFile(null);

      const fileInput = document.getElementById("verification-document");
      if (fileInput) {
        fileInput.value = "";
      }

      fetchStatus();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 space-y-3">
          <Loader2 className="animate-spin text-blue-500" size={36} />
          <p className="text-sm font-medium">Checking verification credentials...</p>
        </div>
      </DashboardLayout>
    );
  }

  const verificationStatus = status?.user?.verificationStatus;
  const documents = status?.documents || [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BadgeCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Responder Professional Verification
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Submit official credentials (MCI Medical License, Paramedic ID, Hospital ID) to unlock emergency responder access.
              </p>
            </div>
          </div>
        </div>

        {/* STATUS CARD */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Current Verification Status
          </h2>

          {verificationStatus === "not_submitted" && (
            <div className="mt-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
              <AlertTriangle className="text-amber-400 shrink-0" size={24} />
              <div>
                <p className="font-bold text-amber-300 text-sm">Credentials Not Submitted</p>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Upload an official document below to begin verification.
                </p>
              </div>
            </div>
          )}

          {verificationStatus === "pending" && (
            <div className="mt-4 p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-4">
              <Clock className="text-blue-400 shrink-0 animate-spin-slow" size={24} />
              <div>
                <p className="font-bold text-blue-300 text-sm">Review Under Progress</p>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  Your credentials have been submitted and are under review by an administrator.
                </p>
              </div>
            </div>
          )}

          {verificationStatus === "approved" && (
            <div className="mt-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
              <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
              <div>
                <p className="font-bold text-emerald-300 text-sm">✓ Officially Verified Emergency Responder</p>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Your credentials are approved. You have full access to responder features.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* UPLOAD FORM */}
        {verificationStatus !== "approved" && verificationStatus !== "pending" && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Upload Verification Document
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white outline-none focus:border-blue-500 text-sm"
                >
                  <option value="professional_id">Professional ID Card</option>
                  <option value="medical_license">Medical License / Certificate</option>
                  <option value="police_id">Police ID</option>
                  <option value="government_id">Government Issued ID</option>
                  <option value="other">Other Official Credential</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Document File
                </label>
                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/80 flex flex-col items-center justify-center text-center">
                  <Upload className="text-blue-400 mb-2" size={28} />
                  <input
                    id="verification-document"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">Accepted formats: JPG, PNG, PDF (Max 10MB)</p>
                </div>
              </div>

              <button
                onClick={uploadDocument}
                disabled={uploading || !file}
                className="
                  w-full py-3.5 rounded-xl
                  bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600
                  hover:from-blue-500 hover:to-cyan-500
                  text-white font-bold text-sm
                  shadow-lg shadow-blue-600/30
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {uploading ? "Uploading Document..." : "Submit Credentials For Review"}
              </button>
            </div>
          </div>
        )}

        {/* SUBMITTED DOCUMENTS HISTORY */}
        {documents.length > 0 && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white tracking-tight mb-5">
              Document Submission Logs
            </h2>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc._id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-400" size={22} />
                    <div>
                      <p className="text-xs font-bold text-white uppercase">{doc.documentType}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{doc.fileName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      doc.status === "approved" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      {doc.status}
                    </span>

                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VerificationPage;