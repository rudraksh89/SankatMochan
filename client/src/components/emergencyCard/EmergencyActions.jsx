import { Download, Printer, Share2, Check } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const EmergencyActions = () => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const element = document.getElementById("emergency-card");
      if (!element) {
        alert("Emergency card element not found");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#090d16",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, Math.min(imgHeight, pageHeight - margin * 2));
      pdf.save("Sankat-Mochan-Emergency-Pass.pdf");
    } catch (error) {
      console.error("PDF DOWNLOAD ERROR:", error);
      alert("Unable to export PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Sankat Mochan Emergency Pass",
          text: "My Emergency Medical Identity Card",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (error) {
      console.log("Share notice:", error);
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap pt-2">
      {/* DOWNLOAD PDF */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="
          px-6 py-3.5 rounded-xl
          bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600
          hover:from-blue-500 hover:to-cyan-500
          text-white font-bold text-sm
          shadow-lg shadow-blue-600/30
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2.5
        "
      >
        <Download size={18} />
        <span>{downloading ? "Generating PDF..." : "Export Official PDF"}</span>
      </button>

      {/* PRINT */}
      <button
        onClick={handlePrint}
        className="
          px-6 py-3.5 rounded-xl
          bg-slate-900 hover:bg-slate-800
          border border-slate-800 hover:border-slate-700
          text-slate-200 font-semibold text-sm
          transition duration-200
          flex items-center gap-2.5
        "
      >
        <Printer size={18} className="text-cyan-400" />
        <span>Print Card</span>
      </button>

      {/* SHARE */}
      <button
        onClick={handleShare}
        className="
          px-6 py-3.5 rounded-xl
          bg-slate-900 hover:bg-slate-800
          border border-slate-800 hover:border-slate-700
          text-slate-200 font-semibold text-sm
          transition duration-200
          flex items-center gap-2.5
        "
      >
        {copied ? <Check size={18} className="text-emerald-400" /> : <Share2 size={18} className="text-purple-400" />}
        <span>{copied ? "Link Copied!" : "Share Emergency Link"}</span>
      </button>
    </div>
  );
};

export default EmergencyActions;