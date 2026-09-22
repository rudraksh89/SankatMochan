import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOTP from "../pages/VerifyOTP";
import CitizenDashboard from "../pages/CitizenDashboard";
import MedicalProfile from "../pages/MedicalProfile";
import QRPage from "../pages/QRPage";
import EmergencyCardPage from "../pages/EmergencyCardPage";
import SettingsPage from "../pages/SettingsPage";
import Register from "../pages/Register";
import EmergencyPage from "../pages/EmergencyPage";
import VerificationPage from "../pages/VerificationPage";
import AdminVerificationPage from "../pages/AdminVerificationPage";
import AdminRoute from "./AdminRoute";
import ResponderEmergencyPage from "../pages/ResponderEmergencyPage";
import SOSRadarPage from "../pages/SOSRadarPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/dashboard" element={<CitizenDashboard />} />
      <Route path="/dashboard/profile" element={<MedicalProfile />} />
      <Route path="/dashboard/qr" element={<QRPage />} />
      <Route path="/dashboard/card" element={<EmergencyCardPage />} />
      <Route path="/dashboard/settings" element={<SettingsPage />} />
      <Route path="/dashboard/sos-radar" element={<SOSRadarPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/emergency/:userId" element={<EmergencyPage />} />
      <Route path="/dashboard/verification" element={<VerificationPage />} />
      <Route path="/dashboard/admin/verifications" element={
        <AdminRoute>
          <AdminVerificationPage />
        </AdminRoute>
      } />
      <Route path="/dashboard/responder/emergency/:userId" element={<ResponderEmergencyPage />} />
    </Routes>
  );
};

export default AppRoutes;