import {
  Download,
  Printer,
  Share2,
} from "lucide-react";

import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const EmergencyActions = () => {

  // =========================
  // DOWNLOAD PDF
  // =========================
  const handleDownload = async () => {
    try {
      const element = document.getElementById("emergency-card");

      if (!element) {
        alert("Emergency card not found");
        return;
      }

      console.log("Starting PDF generation...");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      console.log("Canvas created successfully");

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;

      const imgWidth = pageWidth - margin * 2;

      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // First page
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight - margin * 2;

      // Additional pages if required
      while (heightLeft > 0) {

        position =
          heightLeft - imgHeight + margin;

        pdf.addPage();

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save(
        "Sankat-Mochan-Emergency-Card.pdf"
      );

      console.log("PDF downloaded successfully");

    } catch (error) {

      console.error(
        "PDF DOWNLOAD ERROR:",
        error
      );

      alert(
        "Unable to download PDF. Check console."
      );
    }
  };


  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {
    window.print();
  };


  // =========================
  // SHARE
  // =========================
  const handleShare = async () => {

    try {

      if (navigator.share) {

        await navigator.share({
          title: "Sankat Mochan Emergency Card",
          text: "Emergency Medical Card",
          url: window.location.href,
        });

      } else {

        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Emergency card link copied!");

      }

    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }

  };


  return (
    <div className="flex gap-5 flex-wrap">

      {/* DOWNLOAD PDF */}
      <button
        onClick={handleDownload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
      >
        <Download size={22} />

        Download PDF
      </button>


      {/* PRINT */}
      <button
        onClick={handlePrint}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
      >
        <Printer size={22} />

        Print
      </button>


      {/* SHARE */}
      <button
        onClick={handleShare}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
      >
        <Share2 size={22} />

        Share
      </button>

    </div>
  );
};

export default EmergencyActions;