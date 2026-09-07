import { motion } from "framer-motion";
import {
  Atom,
  Database,
  Server,
  ShieldCheck,
  QrCode,
  Smartphone,
  Brain,
  MapPinned,
  Lock,
} from "lucide-react";

import SectionTitle from "../ui/SectionTitle";
import Container from "../ui/Container";

const technologies = [
  {
    title: "React 19",
    desc: "Ultra Fast UI Framework",
    icon: Atom,
    color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
  },
  {
    title: "Node.js & Express",
    desc: "Scalable REST Backend",
    icon: Server,
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  },
  {
    title: "MongoDB",
    desc: "Encrypted Cloud Data",
    icon: Database,
    color: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
  },
  {
    title: "Dynamic QR Engine",
    desc: "Offline Medical Payload",
    icon: QrCode,
    color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  },
  {
    title: "NFC Integration",
    desc: "Contactless Wearable ID",
    icon: Smartphone,
    color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  },
  {
    title: "AI Triage Advisor",
    desc: "Gemini Medical Analysis",
    icon: Brain,
    color: "text-pink-400 border-pink-500/20 bg-pink-500/10",
  },
  {
    title: "Live GPS Routing",
    desc: "Hospital Dispatch & SOS",
    icon: MapPinned,
    color: "text-rose-400 border-rose-500/20 bg-rose-500/10",
  },
  {
    title: "JWT Security",
    desc: "Token Auth Architecture",
    icon: ShieldCheck,
    color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  },
  {
    title: "AES 256 Encryption",
    desc: "Zero Trust Protection",
    icon: Lock,
    color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
  },
];

const BuiltUsing = () => {
  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />

      <Container>
        <SectionTitle
          badge="High Performance Tech Stack"
          title="Built With Modern Technologies"
          subtitle="Sankat Mochan combines secure cloud databases, offline NFC/QR payloads, and AI to deliver instant emergency medical summaries."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;

            return (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                viewport={{ once: true }}
              >
                <div className="h-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-7 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-300 group hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl border flex items-center justify-center ${tech.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold text-white mt-5 tracking-tight">
                    {tech.title}
                  </h3>

                  <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                    {tech.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default BuiltUsing;