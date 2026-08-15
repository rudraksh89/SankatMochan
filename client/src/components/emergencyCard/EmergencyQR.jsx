import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import api from "../../api/axios";

const EmergencyQR = () => {

  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQR();
  }, []);

  const fetchQR = async () => {
    try {

      const res = await api.get("/qr");

      console.log("CARD QR API RESPONSE:", res.data);

      setQrUrl(res.data.emergencyUrl);

    } catch (error) {

      console.error(
        "Failed to generate QR:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  if (loading) {
    return (
      <div className="bg-white p-5 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">
          Loading QR...
        </p>
      </div>
    );
  }


  if (!qrUrl) {
    return (
      <div className="bg-white p-5 rounded-xl">
        <p className="text-red-500">
          Unable to generate QR code.
        </p>
      </div>
    );
  }


  return (
    <div className="bg-white p-5 rounded-xl">

      <QRCode
        value={qrUrl}
        size={170}
      />

    </div>
  );
};

export default EmergencyQR;