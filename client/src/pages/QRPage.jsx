import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import QRGenerator from "../components/qr/QRGenerator";
import QRPreview from "../components/qr/QRPreview";
import QRInstructions from "../components/qr/QRInstructions";
import QRActions from "../components/qr/QRActions";
import NFCManager from "../components/qr/NFCManager";
import EmergencyCardPreview from "../components/qr/EmergencyCardPreview";
import { History, ArrowRight } from "lucide-react";

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

        {/* SCAN HISTORY PROMO BANNER */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <History size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">QR Code Scan History & Access Logs</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track who scanned your Emergency QR code in real-time, view verified responder identities, and device logs.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/qr-history"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center gap-2 shrink-0 transition"
          >
            <span>View Scan History</span>
            <ArrowRight size={16} />
          </Link>
        </div>

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