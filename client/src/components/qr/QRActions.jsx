import { toPng } from "html-to-image";
import { Download, Printer, Share2, Check } from "lucide-react";
import { useState } from "react";

const QRActions = ({ qrUrl }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const downloadQR = async () => {
    try {
      setDownloading(true);
      const qrElement = document.getElementById("emergency-qr");

      if (!qrElement) {
        alert("QR code element not found");
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
      console.error("Download QR error:", error);
      alert("Failed to download QR image");
    } finally {
      setDownloading(false);
    }
  };

  const printQR = () => {
    const qrElement = document.getElementById("emergency-qr");
    if (!qrElement) {
      alert("QR code element not found");
      return;
    }

    const printWindow = window.open("", "_blank", "width=600,height=700");
    if (!printWindow) {
      alert("Please allow popups to print the QR code");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Sankat Mochan Emergency QR</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; color: #0f172a; }
            h1 { margin-bottom: 5px; font-weight: 900; }
            p { color: #64748b; font-size: 14px; }
            .qr { margin: 30px auto; display: inline-block; padding: 20px; border: 2px solid #0f172a; border-radius: 20px; }
          </style>
        </head>
        <body>
          <h1>SANKAT MOCHAN</h1>
          <p>Official Emergency Medical Identity QR</p>
          <div class="qr">${qrElement.outerHTML}</div>
          <p>Keep this QR code in your wallet or vehicle for emergency responders.</p>
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
      alert("QR URL not ready");
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Sankat Mochan Emergency QR",
          text: "Scan this link to access my emergency medical information.",
          url: qrUrl,
        });
      } else {
        await navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
      <h2 className="text-xl font-bold text-white tracking-tight mb-5">
        Export & Share Actions
      </h2>

      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={downloadQR}
          disabled={downloading}
          className="
            py-3.5 px-5 rounded-xl
            bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600
            hover:from-blue-500 hover:to-cyan-500
            text-white font-bold text-sm
            shadow-lg shadow-blue-600/30
            transition-all duration-300
            disabled:opacity-50
            flex items-center justify-center gap-2
          "
        >
          <Download size={18} />
          <span>{downloading ? "Exporting..." : "Download High-Res PNG"}</span>
        </button>

        <button
          onClick={printQR}
          className="
            py-3.5 px-5 rounded-xl
            bg-slate-950 hover:bg-slate-900
            border border-slate-800 hover:border-slate-700
            text-slate-200 font-semibold text-sm
            transition duration-200
            flex items-center justify-center gap-2
          "
        >
          <Printer size={18} className="text-cyan-400" />
          <span>Print QR Pass</span>
        </button>

        <button
          onClick={shareQR}
          className="
            py-3.5 px-5 rounded-xl
            bg-slate-950 hover:bg-slate-900
            border border-slate-800 hover:border-slate-700
            text-slate-200 font-semibold text-sm
            transition duration-200
            flex items-center justify-center gap-2
          "
        >
          {copied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} className="text-purple-400" />}
          <span>{copied ? "Link Copied!" : "Share QR Link"}</span>
        </button>
      </div>
    </div>
  );
};

export default QRActions;