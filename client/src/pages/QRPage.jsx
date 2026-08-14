import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import QRGenerator from "../components/qr/QRGenerator";
import QRPreview from "../components/qr/QRPreview";
import QRInstructions from "../components/qr/QRInstructions";
import QRActions from "../components/qr/QRActions";
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

      const [
        profileRes,
        emergencyRes
      ] = await Promise.all([
        api.get("/profile"),
        api.get("/emergency")
      ]);


      // =========================
      // PROFILE
      // =========================

      console.log(
        "PROFILE RESPONSE:",
        profileRes.data
      );

      setUser(profileRes.data.user);

      setMedicalProfile(
        profileRes.data.profile
      );


      // =========================
      // EMERGENCY CONTACT
      // =========================

      console.log(
        "EMERGENCY RESPONSE:",
        emergencyRes.data
      );


      const contacts =
        emergencyRes.data.contacts || [];


      console.log(
        "CONTACTS ARRAY:",
        contacts
      );


      const contact =
        contacts.length > 0
          ? contacts[0]
          : null;


      console.log(
        "FINAL EMERGENCY CONTACT:",
        contact
      );


      setEmergencyContact(contact);

    } catch (error) {

      console.error(
        "Failed to load emergency data:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <DashboardLayout>

      <div className="space-y-8">

        <QRGenerator
          onQRReady={setQrUrl}
        />


        <QRPreview />


        <QRActions
          qrUrl={qrUrl}
        />


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