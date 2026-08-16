import { toPng } from "html-to-image";

const QRActions = ({ qrUrl }) => {

  const downloadQR = async () => {
    try {
      const qrElement = document.getElementById("emergency-qr");

      if (!qrElement) {
        alert("QR code not found");
        return;
      }

      const dataUrl = await toPng(qrElement, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });

      const link = document.createElement("a");

      link.download = "sankat-mochan-emergency-qr.png";
      link.href = dataUrl;

      link.click();

    } catch (error) {
      console.error(error);
      alert("Failed to download QR");
    }
  };

  const printQR = () => {

    const qrElement = document.getElementById("emergency-qr");

    if (!qrElement) {
      alert("QR code not found");
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=600,height=700"
    );

    if (!printWindow) {
      alert("Please allow popups to print the QR");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Sankat Mochan Emergency QR</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
              color: #111827;
            }

            h1 {
              margin-bottom: 10px;
            }

            p {
              color: #555;
            }

            .qr {
              margin-top: 30px;
            }
          </style>

        </head>

        <body>

          <h1>Sankat Mochan</h1>

          <p>Emergency Medical QR</p>

          <div class="qr">
            ${qrElement.outerHTML}
          </div>

          <p>
            Scan this QR code to access emergency information.
          </p>

        </body>

      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const shareQR = async () => {

    if (!qrUrl) {
      alert("QR URL not available");
      return;
    }

    try {

      if (navigator.share) {

        await navigator.share({
          title: "My Sankat Mochan Emergency QR",
          text: "Scan this link to access my emergency information.",
          url: qrUrl,
        });

      } else {

        await navigator.clipboard.writeText(qrUrl);

        alert("Emergency link copied to clipboard");
      }

    } catch (error) {

      if (error.name !== "AbortError") {
        console.error(error);
        alert("Unable to share QR");
      }

    }
  };

  return (
    <div className="bg-white text-gray-900 rounded-2xl shadow-md p-8">

      <h2 className="text-2xl font-bold mb-6">
        QR Actions
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <button
          onClick={downloadQR}
          className="bg-blue-600 text-white py-3 px-5 rounded-xl hover:bg-blue-700 transition"
        >
          Download QR
        </button>

        <button
          onClick={printQR}
          className="bg-gray-800 text-white py-3 px-5 rounded-xl hover:bg-gray-900 transition"
        >
          Print QR
        </button>

        <button
          onClick={shareQR}
          className="bg-green-600 text-white py-3 px-5 rounded-xl hover:bg-green-700 transition"
        >
          Share QR
        </button>

      </div>

    </div>
  );
};

export default QRActions;