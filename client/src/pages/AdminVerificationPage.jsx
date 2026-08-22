import { useEffect, useState } from "react";
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

  // =====================================================
  // GET PENDING VERIFICATIONS
  // =====================================================

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/verification/admin/pending"
      );

      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load verification requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPendingVerifications();
    }
  }, [user]);

  // =====================================================
  // APPROVE DOCUMENT
  // =====================================================

  const handleApprove = async (documentId) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this responder?"
    );

    if (!confirmApprove) {
      return;
    }

    try {
      setReviewingId(documentId);

      const response = await api.put(
        `/verification/admin/review/${documentId}`,
        {
          action: "approve",
        }
      );

      alert(response.data.message);

      setDocuments((prev) =>
        prev.filter(
          (document) => document._id !== documentId
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to approve verification"
      );
    } finally {
      setReviewingId(null);
    }
  };

  // =====================================================
  // REJECT DOCUMENT
  // =====================================================

  const handleReject = async (documentId) => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    try {
      setReviewingId(documentId);

      const response = await api.put(
        `/verification/admin/review/${documentId}`,
        {
          action: "reject",
          rejectionReason: rejectionReason.trim(),
        }
      );

      alert(response.data.message);

      setDocuments((prev) =>
        prev.filter(
          (document) => document._id !== documentId
        )
      );

      setRejectingId(null);
      setRejectionReason("");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to reject verification"
      );
    } finally {
      setReviewingId(null);
    }
  };

  // =====================================================
  // NOT ADMIN
  // =====================================================

  if (user?.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <ShieldCheck
            size={50}
            className="mx-auto text-red-500"
          />

          <h1 className="text-2xl font-bold mt-5">
            Access Denied
          </h1>

          <p className="text-gray-500 mt-2">
            Only administrators can access responder
            verification requests.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin mx-auto text-blue-600"
          />

          <p className="mt-4 text-gray-500">
            Loading verification requests...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}

      <div className="bg-white rounded-2xl shadow-md p-8">

        <div className="flex items-center gap-4">

          <div className="p-3 bg-blue-100 rounded-xl">
            <ShieldCheck
              size={32}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Responder Verification
            </h1>

            <p className="text-gray-500 mt-1">
              Review and verify emergency responder
              credentials.
            </p>
          </div>

        </div>

        {/* COUNT */}

        <div className="mt-6 inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl">

          <span className="font-semibold text-yellow-800">
            Pending Requests:
          </span>

          <span className="font-bold text-yellow-900">
            {documents.length}
          </span>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-5">

          <p className="font-semibold text-red-800">
            Error
          </p>

          <p className="text-red-700 mt-1">
            {error}
          </p>

          <button
            onClick={fetchPendingVerifications}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>

        </div>
      )}

      {/* EMPTY */}

      {!error && documents.length === 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-md p-12 text-center">

          <CheckCircle
            size={55}
            className="mx-auto text-green-500"
          />

          <h2 className="text-2xl font-bold mt-5">
            No Pending Requests
          </h2>

          <p className="text-gray-500 mt-2">
            There are currently no responder verification
            requests waiting for review.
          </p>

        </div>
      )}

      {/* DOCUMENTS */}

      <div className="mt-6 space-y-6">

        {documents.map((document) => {

          const responder = document.user;

          const isReviewing =
            reviewingId === document._id;

          const isRejecting =
            rejectingId === document._id;

          return (
            <div
              key={document._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >

              {/* CARD HEADER */}

              <div className="p-6 border-b border-gray-200 flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="p-3 bg-blue-100 rounded-xl">
                    <User
                      size={28}
                      className="text-blue-600"
                    />
                  </div>

                  <div>

                    <h2 className="text-xl font-bold">
                      {responder?.fullName ||
                        "Unknown Responder"}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Responder Verification Request
                    </p>

                  </div>

                </div>

                <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                  Pending
                </span>

              </div>

              {/* RESPONDER DETAILS */}

              <div className="p-6">

                <h3 className="text-lg font-semibold mb-4">
                  Responder Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                  {/* NAME */}

                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">

                    <User
                      size={20}
                      className="text-gray-500 mt-1"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Full Name
                      </p>

                      <p className="font-semibold">
                        {responder?.fullName || "-"}
                      </p>
                    </div>

                  </div>

                  {/* EMAIL */}

                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">

                    <Mail
                      size={20}
                      className="text-gray-500 mt-1"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Email
                      </p>

                      <p className="font-semibold break-all">
                        {responder?.email || "-"}
                      </p>
                    </div>

                  </div>

                  {/* PHONE */}

                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">

                    <Phone
                      size={20}
                      className="text-gray-500 mt-1"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Phone
                      </p>

                      <p className="font-semibold">
                        {responder?.phone || "-"}
                      </p>
                    </div>

                  </div>

                  {/* PROFESSION */}

                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">

                    <Briefcase
                      size={20}
                      className="text-gray-500 mt-1"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Profession
                      </p>

                      <p className="font-semibold">
                        {responder?.profession || "-"}
                      </p>
                    </div>

                  </div>

                  {/* ORGANIZATION */}

                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">

                    <Building2
                      size={20}
                      className="text-gray-500 mt-1"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Organization
                      </p>

                      <p className="font-semibold">
                        {responder?.organization || "-"}
                      </p>
                    </div>

                  </div>

                  {/* PROFESSIONAL ID */}

                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">

                    <CreditCard
                      size={20}
                      className="text-gray-500 mt-1"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Professional ID
                      </p>

                      <p className="font-semibold">
                        {responder?.professionalId || "-"}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              {/* DOCUMENT */}

              <div className="px-6 pb-6">

                <h3 className="text-lg font-semibold mb-4">
                  Submitted Document
                </h3>

                <div className="border border-gray-200 rounded-xl p-5">

                  <div className="flex items-center justify-between gap-4 flex-wrap">

                    <div className="flex items-center gap-4">

                      <div className="p-3 bg-gray-100 rounded-xl">
                        <FileText
                          size={28}
                          className="text-gray-600"
                        />
                      </div>

                      <div>

                        <p className="font-semibold">
                          {document.fileName}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Type:{" "}
                          {document.documentType}
                        </p>

                      </div>

                    </div>

                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
                    >
                      <ExternalLink size={18} />
                      View Document
                    </a>

                  </div>

                </div>

              </div>

              {/* REJECTION FORM */}

              {isRejecting && (
                <div className="px-6 pb-6">

                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">

                    <h3 className="font-semibold text-red-800">
                      Rejection Reason
                    </h3>

                    <textarea
                      value={rejectionReason}
                      onChange={(e) =>
                        setRejectionReason(
                          e.target.value
                        )
                      }
                      placeholder="Explain why this document is being rejected..."
                      rows={4}
                      className="w-full mt-3 border border-red-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-400"
                    />

                    <div className="flex gap-3 mt-4">

                      <button
                        onClick={() =>
                          handleReject(document._id)
                        }
                        disabled={isReviewing}
                        className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                      >

                        {isReviewing && (
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                        )}

                        Confirm Rejection

                      </button>

                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectionReason("");
                        }}
                        disabled={isReviewing}
                        className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                </div>
              )}

              {/* ACTIONS */}

              {!isRejecting && (
                <div className="px-6 pb-6 flex gap-4">

                  <button
                    onClick={() =>
                      handleApprove(document._id)
                    }
                    disabled={isReviewing}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >

                    {isReviewing && (
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />
                    )}

                    {!isReviewing && (
                      <CheckCircle size={20} />
                    )}

                    Approve

                  </button>

                  <button
                    onClick={() => {
                      setRejectingId(document._id);
                      setRejectionReason("");
                    }}
                    disabled={isReviewing}
                    className="flex-1 border border-red-500 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Reject
                  </button>

                </div>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default AdminVerificationPage;