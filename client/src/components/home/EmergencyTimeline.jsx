import { motion } from "framer-motion";
import {
  UserPlus,
  FileText,
  QrCode,
  Watch,
  TriangleAlert,
  ScanLine,
  Brain,
  Hospital,
  HeartPulse,
} from "lucide-react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const steps = [
  {
    title: "Register Yourself",
    desc: "Create your secure Sankat Mochan account.",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    title: "Complete Medical Profile",
    desc: "Add blood group, allergies, diseases and emergency contacts.",
    icon: FileText,
    color: "bg-green-500",
  },
  {
    title: "Generate QR + NFC",
    desc: "Generate your secure emergency identity.",
    icon: QrCode,
    color: "bg-purple-500",
  },
  {
    title: "Wear QR Band / NFC Card",
    desc: "Carry your medical identity wherever you go.",
    icon: Watch,
    color: "bg-orange-500",
  },
  {
    title: "Emergency Happens",
    desc: "The user becomes unconscious after an accident.",
    icon: TriangleAlert,
    color: "bg-red-500",
  },
  {
    title: "Responder Scans QR",
    desc: "Anyone can instantly scan the QR code.",
    icon: ScanLine,
    color: "bg-cyan-500",
  },
  {
    title: "AI Creates Summary",
    desc: "Critical medical information is summarized instantly.",
    icon: Brain,
    color: "bg-pink-500",
  },
  {
    title: "Hospital Gets Information",
    desc: "Doctors receive patient details before arrival.",
    icon: Hospital,
    color: "bg-indigo-500",
  },
  {
    title: "Treatment Begins",
    desc: "Faster decisions. Better chances of saving lives.",
    icon: HeartPulse,
    color: "bg-rose-500",
  },
];

const EmergencyTimeline = () => {
  return (
    <section className="bg-white py-28">
      <Container>

        <SectionTitle
          title="A Life Can Be Saved in Under 60 Seconds"
          subtitle="Here's how Sankat Mochan helps first responders and hospitals during emergencies."
        />

        <div className="relative">

          {/* Vertical Line */}
          <div className="absolute left-6 top-0 h-full w-1 bg-blue-200"></div>

          <div className="space-y-12">

            {steps.map((step, index) => {

              const Icon = step.icon;

              return (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-6"
                >

                  {/* Circle */}

                  <div
                    className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white z-10 shadow-lg`}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Card */}

                  <div className="bg-slate-50 rounded-2xl p-6 shadow-lg border hover:shadow-2xl transition w-full">

                    <h3 className="text-2xl font-bold text-slate-900">
                      {step.title}
                    </h3>

                    <p className="text-slate-600 mt-2 leading-7">
                      {step.desc}
                    </p>

                  </div>

                </motion.div>

              );

            })}

          </div>

        </div>

      </Container>
    </section>
  );
};

export default EmergencyTimeline;