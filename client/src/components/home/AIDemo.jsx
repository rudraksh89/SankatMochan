import { motion } from "framer-motion";
import {
  ScanLine,
  Brain,
  PhoneCall,
  Hospital,
  ArrowDown,
} from "lucide-react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

const steps = [
  {
    icon: ScanLine,
    title: "QR Code Scanned",
    desc: "A passerby scans the patient's emergency QR.",
  },
  {
    icon: Brain,
    title: "AI Analyzes Data",
    desc: "AI summarizes blood group, allergies and diseases.",
  },
  {
    icon: PhoneCall,
    title: "Emergency Contact",
    desc: "Family members are notified immediately.",
  },
  {
    icon: Hospital,
    title: "Hospital Prepared",
    desc: "Doctors receive medical information before arrival.",
  },
];

const AIDemo = () => {
  return (
    <section className="py-28 bg-white">
      <Container>

        <SectionTitle
          title="AI Emergency Response"
          subtitle="See how Sankat Mochan uses AI to reduce response time during emergencies."
        />

        <div className="grid lg:grid-cols-4 gap-8">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (

              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
              >

                <Card className="p-8 h-full text-center">

                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">

                    <Icon size={30} />

                  </div>

                  <h3 className="text-2xl font-bold mt-6 text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-slate-600">
                    {step.desc}
                  </p>

                </Card>

                {index !== steps.length - 1 && (
                  <div className="hidden lg:flex justify-center mt-6">
                    <ArrowDown className="text-blue-500" />
                  </div>
                )}

              </motion.div>

            );

          })}

        </div>

      </Container>
    </section>
  );
};

export default AIDemo;