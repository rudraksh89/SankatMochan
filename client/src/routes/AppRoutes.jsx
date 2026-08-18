import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import CitizenDashboard from "../pages/CitizenDashboard";
import MedicalProfile from "../pages/MedicalProfile";
import QRPage from "../pages/QRPage";
import EmergencyCardPage from "../pages/EmergencyCardPage";
import SettingsPage from "../pages/SettingsPage";
import Register from "../pages/Register";
import EmergencyPage from "../pages/EmergencyPage";
import VerificationPage from "../pages/VerificationPage";
import AdminVerification from "../pages/AdminVerification";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<CitizenDashboard />}/>
      <Route path="/dashboard/profile" element={<MedicalProfile />}/>
      <Route path="/dashboard/qr" element={<QRPage/>}/>
      <Route path="/dashboard/card" element={<EmergencyCardPage/>}/>
      <Route path="/dashboard/settings" element={<SettingsPage/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/emergency/:userId" element={<EmergencyPage />}/>
      <Route path="/verification"  element={<VerificationPage />}/>
      <Route path="/admin/verification" element={<AdminVerification />}/>

    </Routes>
  );
};

export default AppRoutes;