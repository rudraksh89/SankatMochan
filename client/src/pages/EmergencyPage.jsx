import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const EmergencyPage = () => {
  const { userId } = useParams();

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    try {
      const res = await api.get(`/public/${userId}`);
      setCard(res.data.emergencyCard);
    } catch (err) {
      console.log(err);
      alert("Unable to load emergency card");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Emergency card not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 flex justify-center items-center p-6">

      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-red-600 text-center">
          🚑 Emergency Medical Card
        </h1>

        <div className="mt-8 space-y-4">

          <div>
            <span className="font-semibold">Name:</span>{" "}
            {card.fullName}
          </div>

          <div>
            <span className="font-semibold">Blood Group:</span>{" "}
            {card.bloodGroup || "Not Available"}
          </div>

          <div>
            <span className="font-semibold">Allergies:</span>{" "}
            {card.allergies || "None"}
          </div>

          <div>
            <span className="font-semibold">Medical Conditions:</span>{" "}
            {card.medicalConditions || "None"}
          </div>

          <div>
            <span className="font-semibold">Medications:</span>{" "}
            {card.medications || "None"}
          </div>

        </div>

        <hr className="my-8" />

        <h2 className="text-xl font-bold mb-4">
          Emergency Contact
        </h2>

        {card.emergencyContact ? (
          <div className="space-y-3">

            <p>
              <strong>Name:</strong>{" "}
              {card.emergencyContact.contactName}
            </p>

            <p>
              <strong>Relationship:</strong>{" "}
              {card.emergencyContact.relationship}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {card.emergencyContact.phone}
            </p>

            <a
              href={`tel:${card.emergencyContact.phone}`}
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700"
            >
              📞 Call Now
            </a>

          </div>
        ) : (
          <p>No emergency contact available.</p>
        )}

      </div>

    </div>
  );
};

export default EmergencyPage;