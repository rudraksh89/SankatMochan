import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Loader2,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  CreditCard,
  AlertTriangle
} from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminVerificationPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/verification/admin/pending");
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPendingVerifications();
    }
  }, [user]);

  const handleApprove = async (documentId) => {
    const confirmApprove = window.confirm("Are you sure you want to approve this responder?");
    if (!confirmApprove) return;

    try {
      setReviewingId(documentId);
      const response = await api.put(`/verification/admin/review/${documentId}`, { action: "approve" });
      alert(response.data.message);
      setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to approve verification");
    } finally {
      setReviewingId(null);
    }
  };

  const handleReject = async (documentId) => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    try {
      setReviewingId(documentId);
      const response = await api.put(`/verification/admin/review/${documentId}`, {
        action: "reject",
        rejectionReason: rejectionReason.trim(),
      });
      alert(response.data.message);
      setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
      setRejectingId(null);
      setRejectionReason("");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to reject verification");
    } finally {
      setReviewingId(null);
    }
  };

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-10 text-center">
            <ShieldCheck size={50} className="mx-auto text-rose-500 mb-4" />
            <h1 className="text-2xl font-bold text-white">Access Denied</h1>
            <p className="text-slate-400 text-sm mt-2">
              Only administrators can access responder verification requests.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 space-y-3">
          <Loader2 size={36} className="animate-spin text-purple-500" />
          <p className="text-sm font-medium">Fetching responder verification queue...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Responder Verification Portal
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Review credential submissions to grant medical responder privileges.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-2">
            <span>Pending Queue:</span>
            <span className="text-sm font-black text-amber-400">{documents.length}</span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 text-rose-300 space-y-3">
            <p className="font-bold text-sm">{error}</p>
            <button
              onClick={fetchPendingVerifications}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY QUEUE */}
        {!error && documents.length === 0 && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-12 text-center">
            <CheckCircle size={55} className="mx-auto text-emerald-400 mb-4" />
            <h2 className="text-2xl font-bold text-white">Verification Queue Empty</h2>
            <p className="text-slate-400 text-sm mt-2">
              There are currently no pending responder document requests.
            </p>
          </div>
        )}

        {/* PENDING DOCUMENTS GRID */}
        <div className="space-y-6">
          {documents.map((doc) => {
            const responder = doc.user;
            const isReviewing = reviewingId === doc._id;
            const isRejecting = rejectingId === doc._id;

            return (
              <div
                key={doc._id}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                      {responder?.fullName?.charAt(0) || "R"}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {responder?.fullName || "Unknown Responder"}
                      </h2>
                      <p className="text-xs text-slate-400">Responder ID Verification Request</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase">
                    Pending Admin Review
                  </span>
                </div>

                {/* Details Grid */}
                <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</span>
                    <span className="text-sm font-semibold text-white mt-1 block">{responder?.fullName || "-"}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                    <span className="text-sm font-semibold text-cyan-300 truncate mt-1 block">{responder?.email || "-"}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                    <span className="text-sm font-semibold text-slate-200 mt-1 block">{responder?.phone || "-"}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Profession</span>
                    <span className="text-sm font-semibold text-purple-300 mt-1 block">{responder?.profession || "-"}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Organization</span>
                    <span className="text-sm font-semibold text-slate-200 mt-1 block">{responder?.organization || "-"}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Professional ID</span>
                    <span className="text-sm font-mono font-bold text-emerald-300 mt-1 block">{responder?.professionalId || "-"}</span>
                  </div>
                </div>

                {/* Submitted Document Box */}
                <div className="px-6 pb-6">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-400" size={24} />
                      <div>
                        <p className="text-xs font-bold text-white uppercase">{doc.documentType}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{doc.fileName}</p>
                      </div>
                    </div>

                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white font-semibold text-xs flex items-center gap-2"
                    >
                      <ExternalLink size={16} />
                      <span>View Credential Document</span>
                    </a>
                  </div>
                </div>

                {/* Rejection Form */}
                {isRejecting && (
                  <div className="px-6 pb-6">
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                      <h3 className="font-bold text-xs text-rose-300 uppercase tracking-wider">Provide Rejection Reason</h3>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this document is being rejected..."
                        rows={3}
                        className="w-full p-3 rounded-xl border border-rose-500/30 bg-slate-950 text-white text-xs outline-none focus:border-rose-500"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReject(doc._id)}
                          disabled={isReviewing}
                          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectionReason("");
                          }}
                          className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {!isRejecting && (
                  <div className="px-6 pb-6 flex gap-4">
                    <button
                      onClick={() => handleApprove(doc._id)}
                      disabled={isReviewing}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      {isReviewing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={18} />}
                      <span>Approve Responder</span>
                    </button>

                    <button
                      onClick={() => {
                        setRejectingId(doc._id);
                        setRejectionReason("");
                      }}
                      disabled={isReviewing}
                      className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-rose-600/20 border border-slate-800 hover:border-rose-500/40 text-rose-400 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      <span>Reject Application</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminVerificationPage;