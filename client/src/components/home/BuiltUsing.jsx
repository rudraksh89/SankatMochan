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
import Card from "../ui/Card";
import Container from "../ui/Container";

const technologies = [
  {
    title: "React",
    desc: "Modern Frontend",
    icon: Atom,
    color: "text-cyan-400",
  },
  {
    title: "Node.js",
    desc: "Backend Runtime",
    icon: Server,
    color: "text-green-500",
  },
  {
    title: "MongoDB",
    desc: "Database",
    icon: Database,
    color: "text-green-400",
  },
  {
    title: "QR Code",
    desc: "Medical Identity",
    icon: QrCode,
    color: "text-blue-500",
  },
  {
    title: "NFC",
    desc: "Wearable Support",
    icon: Smartphone,
    color: "text-purple-500",
  },
  {
    title: "AI",
    desc: "Emergency Summary",
    icon: Brain,
    color: "text-pink-500",
  },
  {
    title: "Maps",
    desc: "Nearby Hospitals",
    icon: MapPinned,
    color: "text-red-500",
  },
  {
    title: "JWT",
    desc: "Authentication",
    icon: ShieldCheck,
    color: "text-yellow-500",
  },
  {
    title: "Encryption",
    desc: "Secure Medical Data",
    icon: Lock,
    color: "text-orange-500",
  },
];

const BuiltUsing = () => {
  return (
    <section className="py-28 bg-slate-950">
      <Container>

        <SectionTitle
          title="Built With Modern Technologies"
          subtitle="Sankat Mochan combines secure technologies with AI to deliver instant emergency medical information."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {technologies.map((tech, index) => {

            const Icon = tech.icon;

            return (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full hover:scale-105 transition-all duration-300 hover:border-blue-500">

                  <Icon
                    className={`w-14 h-14 ${tech.color}`}
                  />

                  <h3 className="text-2xl font-bold text-white mt-6">
                    {tech.title}
                  </h3>

                  <p className="text-slate-300 mt-3">
                    {tech.desc}
                  </p>

                </Card>
              </motion.div>
            );

          })}

        </div>

      </Container>
    </section>
  );
};

export default BuiltUsing;