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
    title: "1. Register Yourself",
    desc: "Create your encrypted Sankat Mochan account in seconds.",
    icon: UserPlus,
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    glowColor: "shadow-blue-500/20",
  },
  {
    title: "2. Complete Medical Profile",
    desc: "Add blood group, allergies, chronic conditions, and emergency contacts.",
    icon: FileText,
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    glowColor: "shadow-emerald-500/20",
  },
  {
    title: "3. Generate QR & Smart NFC",
    desc: "Instant creation of offline emergency medical credentials.",
    icon: QrCode,
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    glowColor: "shadow-cyan-500/20",
  },
  {
    title: "4. Wear QR Band / NFC Card",
    desc: "Keep your medical identity accessible on your wrist or wallet.",
    icon: Watch,
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    glowColor: "shadow-indigo-500/20",
  },
  {
    title: "5. Emergency Triggers",
    desc: "In an accident, every second counts when victim cannot speak.",
    icon: TriangleAlert,
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    glowColor: "shadow-rose-500/20",
  },
  {
    title: "6. First Responder Scans QR",
    desc: "Bystanders or paramedics scan with any smartphone camera.",
    icon: ScanLine,
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    glowColor: "shadow-purple-500/20",
  },
  {
    title: "7. AI Creates Instant Triage",
    desc: "AI synthesizes vital warnings, severe drug allergies, and key contacts.",
    icon: Brain,
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    glowColor: "shadow-pink-500/20",
  },
  {
    title: "8. Automated SOS & Location",
    desc: "GPS coordinates and emergency SMS dispatched automatically.",
    icon: Hospital,
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    glowColor: "shadow-amber-500/20",
  },
  {
    title: "9. Informed Lifesaving Care",
    desc: "Fast, accurate medical decisions without guesswork.",
    icon: HeartPulse,
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    glowColor: "shadow-red-500/20",
  },
];

const EmergencyTimeline = () => {
  return (
    <section id="how" className="bg-slate-950 py-24 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        <SectionTitle
          badge="Lifesaving Workflow"
          title="A Life Can Be Saved in Under 60 Seconds"
          subtitle="Here's how Sankat Mochan bridges the critical gap between emergency occurrences and hospital treatment."
        />

        <div className="relative max-w-4xl mx-auto mt-12">
          {/* Vertical Glow Line */}
          <div className="absolute left-6 sm:left-8 top-3 h-[calc(100%-48px)] w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-rose-500 opacity-60" />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-4 sm:gap-6 group"
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border backdrop-blur-xl ${step.badgeColor} ${step.glowColor} z-10 shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0`}
                  >
                    <Icon size={24} className="sm:text-2xl" />
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-800/80 shadow-xl hover:border-slate-700/80 hover:bg-slate-900/80 transition-all duration-300">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 mt-1.5 text-sm sm:text-base leading-relaxed">
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