import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  Users,
  QrCode,
  Building2,
  ShieldCheck,
} from "lucide-react";

import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import Container from "../ui/Container";

const stats = [
  {
    title: "Users Registered",
    value: 5000,
    suffix: "+",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "QR Codes Generated",
    value: 3200,
    suffix: "+",
    icon: QrCode,
    color: "text-green-500",
  },
  {
    title: "Hospitals Connected",
    value: 150,
    suffix: "+",
    icon: Building2,
    color: "text-red-500",
  },
  {
    title: "Secure Data",
    value: 100,
    suffix: "%",
    icon: ShieldCheck,
    color: "text-yellow-500",
  },
];

const Stats = () => {
  return (
    <section className="py-28 bg-slate-900">
      <Container>
        <SectionTitle
          title="Platform Statistics"
          subtitle="Designed for speed, security, and emergency response."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center hover:scale-105 transition duration-300">

                  <Icon
                    className={`mx-auto w-14 h-14 ${item.color}`}
                  />

                  <h2 className="text-5xl font-bold text-white mt-6">
                    {item.value}
                    {item.suffix}
                  </h2>

                  <p className="text-slate-300 mt-3">
                    {item.title}
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

export default Stats;