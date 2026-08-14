import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import BuiltUsing from "../components/home/BuiltUsing";
import Stats from "../components/home/Stats";
import EmergencyTimeline from "../components/home/EmergencyTimeline";
import DashboardPreview from "../components/home/DashboardPreview";
import AIDemo from "../components/home/AIDemo";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BuiltUsing />
      <Stats />
      <EmergencyTimeline />
      <DashboardPreview />
      <AIDemo />
    </>
  );
}

export default Home;