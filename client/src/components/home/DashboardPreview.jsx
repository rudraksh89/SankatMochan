import { motion } from "framer-motion";
import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import Button from "../ui/Button";
import {
  User,
  Ambulance,
  Building2,
} from "lucide-react";

const dashboards = [
  {
    title: "Citizen Dashboard",
    icon: User,
    features: [
      "Medical Profile",
      "QR Code",
      "Emergency Contacts",
      "Medical History",
    ],
  },
  {
    title: "Responder Dashboard",
    icon: Ambulance,
    features: [
      "Scan QR",
      "AI Summary",
      "Hospital Finder",
      "Emergency Actions",
    ],
  },
  {
    title: "Hospital Dashboard",
    icon: Building2,
    features: [
      "Incoming Patients",
      "Medical Records",
      "Treatment Notes",
      "Live Updates",
    ],
  },
];

const DashboardPreview = () => {
  return (
    <section className="py-28 bg-slate-950">
      <Container>

        <SectionTitle
          title="Dashboard Preview"
          subtitle="Different dashboards for every type of user."
        />

        <div className="grid lg:grid-cols-3 gap-8">

          {dashboards.map((dashboard, index) => {

            const Icon = dashboard.icon;

            return (

              <motion.div
                key={dashboard.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                viewport={{ once: true }}
              >

                <Card className="p-8 h-full">

                  <div className="flex items-center gap-4">

                    <Icon className="text-blue-500" size={34} />

                    <h3 className="text-2xl font-bold text-white">
                      {dashboard.title}
                    </h3>

                  </div>

                  <div className="mt-8 h-52 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">

                    Screenshot Coming Soon

                  </div>

                  <ul className="mt-6 space-y-3">

                    {dashboard.features.map((feature) => (

                      <li
                        key={feature}
                        className="text-slate-300"
                      >
                        ✓ {feature}
                      </li>

                    ))}

                  </ul>

                  <Button
                    className="mt-8 w-full"
                  >
                    View Demo
                  </Button>

                </Card>

              </motion.div>

            );

          })}

        </div>

      </Container>
    </section>
  );
};

export default DashboardPreview;