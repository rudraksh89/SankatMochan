import QRCode from "react-qr-code";

const EmergencyQR = () => {
  return (
    <div className="bg-white p-5 rounded-xl">

      <QRCode
        value="https://sankatmochan.com/user/123"
        size={170}
      />

    </div>
  );
};

export default EmergencyQR;