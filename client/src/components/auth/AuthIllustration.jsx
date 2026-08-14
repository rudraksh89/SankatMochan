import { ShieldPlus, QrCode, Ambulance } from "lucide-react";

const AuthIllustration = () => {
  return (
    <div className="flex flex-col justify-center items-center text-white px-12">

      <ShieldPlus size={90} />

      <h1 className="text-5xl font-bold mt-8">
        Sankat Mochan
      </h1>

      <p className="text-xl mt-5 text-center leading-9">
        Smart Emergency Medical Identity Platform
      </p>

      <div className="flex gap-10 mt-12">

        <QrCode size={60} />

        <Ambulance size={60} />

      </div>

      <p className="mt-10 text-center opacity-90">
        Every second matters during an emergency.
        Keep your medical information accessible,
        secure and life-saving.
      </p>

    </div>
  );
};

export default AuthIllustration;