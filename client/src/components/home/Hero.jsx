import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaPlayCircle,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaRobot,
} from "react-icons/fa";
import { MdQrCode2 } from "react-icons/md";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-red-500/20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full">
            🚑 AI Powered Emergency Platform
          </span>

          <h1 className="text-6xl font-extrabold text-white mt-8 leading-tight">
            Every Second
            <br />
            <span className="text-blue-500">
              Matters.
            </span>
          </h1>

          <p className="text-slate-300 text-lg mt-8 leading-8">
            Sankat Mochan securely stores your medical information
            inside a QR Code and NFC Card so that hospitals and
            first responders can instantly access life-saving
            information during emergencies.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-5 mt-10">

            <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl text-white font-semibold">

              Get Started

              <FaArrowRight />

            </button>

            <button className="flex items-center gap-3 border border-slate-500 hover:border-blue-500 px-8 py-4 rounded-xl text-white">

              <FaPlayCircle />

              Watch Demo

            </button>

          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-5 mt-12 text-white">

            <div className="flex items-center gap-3">
              <MdQrCode2 className="text-blue-500 text-2xl" />
              Secure QR
            </div>

            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-green-500" />
              Encrypted Data
            </div>

            <div className="flex items-center gap-3">
              <FaRobot className="text-purple-500" />
              AI Summary
            </div>

            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-red-500" />
              Live Location
            </div>

          </div>

        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >

          {/* Phone */}
          <div className="bg-white rounded-[35px] shadow-2xl w-80 p-5 z-20">

            <div className="bg-slate-900 rounded-3xl p-6">

              <h2 className="text-white text-xl font-bold">
                Medical Profile
              </h2>

              <div className="mt-5 space-y-4">

                <div className="bg-red-500 text-white rounded-xl p-3">
                  ❤️ Blood Group : O+
                </div>

                <div className="bg-green-500 text-white rounded-xl p-3">
                  💊 No Drug Allergy
                </div>

                <div className="bg-blue-500 text-white rounded-xl p-3">
                  📞 Emergency Contact
                </div>

                <div className="bg-yellow-400 rounded-xl p-6 flex justify-center">

                  <MdQrCode2 className="text-8xl text-black"/>

                </div>

              </div>

            </div>

          </div>

          {/* Floating QR */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="absolute -left-10 top-10 bg-white rounded-2xl shadow-xl p-5"
          >

            <MdQrCode2 className="text-7xl text-blue-600"/>

          </motion.div>

          {/* Floating Medical Card */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
            className="absolute -right-10 bottom-10 bg-slate-800 text-white rounded-2xl p-5 shadow-xl"
          >

            ❤️ Emergency ID

          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};

export default Hero;