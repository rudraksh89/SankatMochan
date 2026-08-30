import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import QRGenerator from "../components/qr/QRGenerator";
import QRPreview from "../components/qr/QRPreview";
import QRInstructions from "../components/qr/QRInstructions";
import QRActions from "../components/qr/QRActions";
import NFCManager from "../components/qr/NFCManager";
import EmergencyCardPreview from "../components/qr/EmergencyCardPreview";

import api from "../api/axios";

const QRPage = () => {
  const [qrUrl, setQrUrl] = useState("");
  const [user, setUser] = useState(null);
  const [medicalProfile, setMedicalProfile] = useState(null);
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyData();
  }, []);

  const fetchEmergencyData = async () => {
    try {
      setLoading(true);

      const [profileRes, emergencyRes] = await Promise.all([
        api.get("/profile"),
        api.get("/emergency"),
      ]);

      setUser(profileRes.data.user);
      setMedicalProfile(profileRes.data.profile);

      const contacts = emergencyRes.data.contacts || [];
      const contact = contacts.length > 0 ? contacts[0] : null;
      setEmergencyContact(contact);
    } catch (error) {
      console.error("Failed to load emergency data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {loading && (
          <div className="bg-slate-800 text-slate-300 p-4 rounded-xl text-center text-sm animate-pulse">
            Syncing emergency profile details...
          </div>
        )}

        <QRGenerator onQRReady={setQrUrl} />

        <QRPreview />

        <QRActions qrUrl={qrUrl} />

        <NFCManager qrUrl={qrUrl} />

        <EmergencyCardPreview
          user={user}
          medicalProfile={medicalProfile}
          emergencyContact={emergencyContact}
        />

        <QRInstructions />
      </div>
    </DashboardLayout>
  );
};

export default QRPage;