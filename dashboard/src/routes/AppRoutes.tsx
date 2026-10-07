import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import SeekerDashboard from "../pages/dashboard/SeekerDashboard";
import ProfessionalDashboard from "../pages/dashboard/ProfessionalDashboard";
import { useAuthContext } from "../context/AuthContext";

function RootRedirect() {
  const { user, loading } = useAuthContext();

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "seeker") return <Navigate to="/seeker" replace />;

  return <Navigate to="/professional" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ROOT ROUTE FIX */}
      <Route path="/" element={<RootRedirect />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/reset_password" element={<ResetPassword />} />

      {/* SEEKER */}
      <Route
        path="/seeker"
        element={
          <ProtectedRoute>
            <SeekerDashboard />
          </ProtectedRoute>
        }
      />

      {/* PROFESSIONAL */}
      <Route
        path="/professional"
        element={
          <ProtectedRoute>
            <ProfessionalDashboard />
          </ProtectedRoute>
        }
      />

      {/* CATCH-ALL (optional but good practice) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}