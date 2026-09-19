import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Users,
  QrCode,
  Building2,
  ShieldCheck,
} from "lucide-react";

import Container from "../ui/Container";

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const end = value;
    const totalMs = duration * 1000;
    let startTime = null;
    let animationFrameId;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / totalMs, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              animationFrameId = requestAnimationFrame(step);
            }
          };
          animationFrameId = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const stats = [
  {
    title: "Registered Citizens",
    value: 5000,
    suffix: "+",
    icon: Users,
    color: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  },
  {
    title: "Emergency QRs Active",
    value: 3200,
    suffix: "+",
    icon: QrCode,
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  },
  {
    title: "Partner Hospitals",
    value: 150,
    suffix: "+",
    icon: Building2,
    color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
  },
  {
    title: "Data Encryption",
    value: 100,
    suffix: "%",
    icon: ShieldCheck,
    color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  },
];

const Stats = () => {
  return (
    <section className="py-20 bg-slate-950 border-y border-slate-800/80 relative">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-7 text-center hover:border-slate-700 transition duration-300">
                  <div className={`w-14 h-14 mx-auto rounded-2xl border flex items-center justify-center ${item.color}`}>
                    <Icon size={28} />
                  </div>

                  <h2 className="text-4xl font-black text-white mt-5 tracking-tight">
                    <Counter value={item.value} duration={2} />
                    <span className="text-blue-500">{item.suffix}</span>
                  </h2>

                  <p className="text-slate-400 text-sm font-medium mt-2">
                    {item.title}
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

export default Stats;