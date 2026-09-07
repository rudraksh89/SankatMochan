import { motion } from "framer-motion";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import {
  User,
  Ambulance,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Activity,
  QrCode
} from "lucide-react";
import { Link } from "react-router-dom";

const dashboards = [
  {
    title: "Citizen Dashboard",
    role: "Public / Victim",
    icon: User,
    color: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    features: [
      "Encrypted Medical Profile Manager",
      "Dynamic QR & Smart NFC Identity Generator",
      "ICE Emergency Contacts & SMS Alerts",
      "Digital Wallet Emergency Pass Export",
    ],
    previewMock: (
      <div className="p-4 space-y-3 font-sans">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs">SM</div>
            <div>
              <p className="text-xs font-bold text-white">Rahul Sharma</p>
              <p className="text-[10px] text-slate-400">Citizen ID #SM-84920</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">VERIFIED</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500 block text-[9px]">BLOOD GROUP</span>
            <span className="font-extrabold text-red-400 text-sm">O Positive</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500 block text-[9px]">ALLERGIES</span>
            <span className="font-extrabold text-amber-400 text-sm">Aspirin, Nuts</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Responder Hub",
    role: "Paramedic / First Aid",
    icon: Ambulance,
    color: "from-cyan-600 to-teal-600",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    features: [
      "Instant Camera QR Scanner",
      "AI Medical Triage Summary Engine",
      "Nearby Hospital GPS Locator",
      "1-Tap Emergency Call Dispatch",
    ],
    previewMock: (
      <div className="p-4 space-y-3 font-sans">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="text-rose-500 animate-pulse" size={16} />
            <span className="text-xs font-bold text-white">ACTIVE INCIDENT #9112</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">PRIORITY 1</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <p className="text-[10px] text-slate-400 mb-1 font-semibold">AI TRIAGE ADVICE</p>
          <p className="text-slate-200 text-[11px] leading-relaxed">Avoid Beta Blockers. Patient has severe asthmatic history.</p>
        </div>
      </div>
    )
  },
  {
    title: "Hospital Command",
    role: "Doctors & ICU Staff",
    icon: Building2,
    color: "from-purple-600 to-indigo-600",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    features: [
      "Incoming Victim Live Stream",
      "Pre-Arrival Vitals Telemetry",
      "Emergency Contact Log Access",
      "Hospital Bed Availability Sync",
    ],
    previewMock: (
      <div className="p-4 space-y-3 font-sans">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-purple-400" size={16} />
            <span className="text-xs font-bold text-white">ICU PREP READY</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">ETA 4 MIN</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-400">TRAUMA BAY 02</p>
            <p className="text-xs font-bold text-white">Pre-admission Complete</p>
          </div>
          <CheckCircle2 className="text-emerald-400" size={18} />
        </div>
      </div>
    )
  },
];

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-slate-950 border-t border-slate-800/80 relative">
      <Container>
        <SectionTitle
          badge="Role-Based Dashboards"
          title="Tailored Interfaces For Every User"
          subtitle="Whether you are a citizen storing profile data, a paramedic on scene, or an ICU doctor preparing treatment."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {dashboards.map((dashboard, index) => {
            const Icon = dashboard.icon;

            return (
              <motion.div
                key={dashboard.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <div className="h-full bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-7 flex flex-col justify-between hover:border-slate-700 transition duration-300 group">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-2xl bg-gradient-to-tr ${dashboard.color} text-white shadow-lg`}>
                        <Icon size={24} />
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${dashboard.badgeColor}`}>
                        {dashboard.role}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {dashboard.title}
                    </h3>

                    {/* Interactive UI Mock Card */}
                    <div className="mt-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden shadow-inner group-hover:border-slate-700 transition duration-300">
                      {dashboard.previewMock}
                    </div>

                    {/* Feature List */}
                    <ul className="mt-6 space-y-2.5">
                      {dashboard.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-slate-300 text-sm flex items-center gap-2.5"
                        >
                          <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/register"
                    className="mt-8 w-full py-3.5 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border border-slate-700 hover:border-blue-500 shadow-md group-hover:shadow-blue-500/20"
                  >
                    <span>Explore Interface</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default DashboardPreview;