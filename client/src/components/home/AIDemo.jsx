import { motion } from "framer-motion";
import {
  ScanLine,
  Brain,
  PhoneCall,
  Hospital,
  Sparkles
} from "lucide-react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";

const steps = [
  {
    icon: ScanLine,
    title: "1. QR Code Scanned",
    desc: "First responder or bystander scans victim's wearable QR tag.",
    badge: "Instant Trigger",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Brain,
    title: "2. AI Analyzes Vitals",
    desc: "AI synthesizes blood group, severe allergies, and drug interactions.",
    badge: "AI Synthesis",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: PhoneCall,
    title: "3. Auto Emergency Dispatch",
    desc: "Family & emergency ICE contacts receive live GPS alert SMS.",
    badge: "GPS Alert",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Hospital,
    title: "4. Hospital Triage Alerted",
    desc: "Paramedics and ICU staff get instant medical summary before arrival.",
    badge: "Pre-Hospital Care",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
];

const AIDemo = () => {
  return (
    <section id="aidemo" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        <SectionTitle
          badge="Autonomous Triage Pipeline"
          title="AI Emergency Response Protocol"
          subtitle="See how Sankat Mochan uses intelligent automated analysis to eliminate critical delays in medical emergencies."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="h-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${step.color} shadow-lg`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-slate-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs text-blue-400 font-semibold gap-1 group-hover:text-cyan-300">
                    <span>Protocol Phase {index + 1}</span>
                    <Sparkles size={12} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default AIDemo;