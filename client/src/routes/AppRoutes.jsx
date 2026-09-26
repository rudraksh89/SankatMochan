import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";

// Eager load core entry pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Lazy load feature pages for code splitting & optimal bundle size
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const VerifyOTP = lazy(() => import("../pages/VerifyOTP"));
const CitizenDashboard = lazy(() => import("../pages/CitizenDashboard"));
const MedicalProfile = lazy(() => import("../pages/MedicalProfile"));
const QRPage = lazy(() => import("../pages/QRPage"));
const EmergencyCardPage = lazy(() => import("../pages/EmergencyCardPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const EmergencyPage = lazy(() => import("../pages/EmergencyPage"));
const VerificationPage = lazy(() => import("../pages/VerificationPage"));
const AdminVerificationPage = lazy(() => import("../pages/AdminVerificationPage"));
const ResponderEmergencyPage = lazy(() => import("../pages/ResponderEmergencyPage"));
const SOSRadarPage = lazy(() => import("../pages/SOSRadarPage"));
const QRHistoryPage = lazy(() => import("../pages/QRHistoryPage"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-400">Loading Sankat Mochan...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/dashboard/profile" element={<MedicalProfile />} />
        <Route path="/dashboard/qr" element={<QRPage />} />
        <Route path="/dashboard/qr-history" element={<QRHistoryPage />} />
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
    </Suspense>
  );
};

export default AppRoutes;