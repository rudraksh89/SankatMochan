import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../../api/axios";

const QRGenerator = ({ onQRReady }) => {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/qr");

      console.log("QR API Response:", res.data);

      // Backend returns emergencyUrl
      const url = res.data.emergencyUrl;

      if (!url) {
        throw new Error("QR URL not received from server");
      }

      console.log("Final QR URL:", url);

      setQrUrl(url);

      if (onQRReady) {
        onQRReady(url);
      }

    } catch (err) {
      console.error("QR generation error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to generate QR code"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center">
        <p className="text-gray-500">
          Generating your emergency QR...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-8">
        <p className="text-red-500">
          {error}
        </p>

        <button
          onClick={generateQR}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold">
        Emergency QR Code
      </h2>

      <p className="text-gray-500 mt-2">
        Scan this QR code to access your emergency information.
      </p>

      <div className="flex justify-center mt-8">

        <div
          id="emergency-qr"
          className="bg-white p-5 rounded-2xl border shadow-sm"
        >
          <QRCodeSVG
            value={qrUrl}
            size={250}
            level="H"
            includeMargin={true}
          />
        </div>

      </div>

      <div className="mt-8">

        <p className="text-sm font-medium text-gray-600 mb-2">
          Emergency URL
        </p>

        <div className="bg-gray-100 rounded-xl p-4 break-all text-sm">
          {qrUrl}
        </div>

      </div>

    </div>
  );
};

export default QRGenerator;