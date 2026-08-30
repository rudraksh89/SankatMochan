import QRCode from "qrcode";

export const generateQRCodeDataURL = async (text) => {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.92,
      margin: 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    });
    return dataUrl;
  } catch (err) {
    console.error("QR Code Generation Error:", err);
    throw err;
  }
};

export default generateQRCodeDataURL;
