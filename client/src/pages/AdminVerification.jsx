import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminVerification = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/verification/pending"
      );

      setDocuments(
        response.data.documents || []
      );

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to load verification requests"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(
        `/verification/${id}/approve`,
        {
          remark: "Documents verified successfully",
        }
      );

      alert("Responder approved");

      fetchDocuments();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Approval failed"
      );
    }
  };

  const reject = async (id) => {
    const remark = window.prompt(
      "Enter rejection reason:"
    );

    if (remark === null) {
      return;
    }

    try {
      await api.put(
        `/verification/${id}/reject`,
        {
          remark,
        }
      );

      alert("Verification rejected");

      fetchDocuments();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Rejection failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Loading verification requests...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Responder Verification
        </h1>

        <p className="text-gray-500 mt-1">
          Review and verify professional credentials.
        </p>

      </div>


      {documents.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-8 text-center">

          <p className="text-gray-500">
            No pending verification requests.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {documents.map((document) => {

            const user = document.user;

            return (
              <div
                key={document._id}
                className="bg-white rounded-2xl shadow-md p-6"
              >

                <div className="grid md:grid-cols-2 gap-6">

                  {/* User Information */}

                  <div>

                    <h2 className="text-xl font-bold">
                      {user?.fullName}
                    </h2>

                    <div className="mt-4 space-y-2">

                      <p>
                        <strong>Email:</strong>{" "}
                        {user?.email}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {user?.phone}
                      </p>

                      <p>
                        <strong>Profession:</strong>{" "}
                        {user?.profession}
                      </p>

                      <p>
                        <strong>Organization:</strong>{" "}
                        {user?.organization}
                      </p>

                      <p>
                        <strong>Professional ID:</strong>{" "}
                        {user?.professionalId}
                      </p>

                    </div>

                  </div>


                  {/* Document */}

                  <div>

                    <h3 className="font-semibold">
                      Verification Document
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {document.documentType}
                    </p>

                    <p className="text-sm mt-3">
                      {document.fileName}
                    </p>

                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                      View Document
                    </a>

                  </div>

                </div>


                {/* Actions */}

                <div className="flex gap-4 mt-8">

                  <button
                    onClick={() =>
                      approve(document._id)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      reject(document._id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
                  >
                    Reject
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default AdminVerification;