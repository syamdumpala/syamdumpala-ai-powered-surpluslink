import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import VolunteerDashboard from "../pages/volunteer/VolunteerDashboard";
import NGODashboard from "../pages/ngo/NGODashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

const dashboardRoutes = {
  restaurant: "/restaurant",
  volunteer: "/volunteer",
  ngo: "/ngo",
  admin: "/admin",
};

export default function AppRoutes() {
  const { isAuthenticated, role, logout } = useAuth();

  const getDashboardRoute = () => {
    if (!isAuthenticated || !role) return "/login";
    return dashboardRoutes[role];
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Login />
        }
      />
      <Route path="/dashboard" element={<Navigate to={getDashboardRoute()} replace />} />
      <Route
        path="/restaurant"
        element={
          <ProtectedRoute allowedRole="restaurant">
            <RestaurantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute allowedRole="volunteer">
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo"
        element={
          <ProtectedRoute allowedRole="ngo">
            <NGODashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logout"
        element={
          <Logout
            onLogout={() => {
              logout();
            }}
          />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function Logout({ onLogout }: { onLogout: () => void }) {
  onLogout();
  return <Navigate to="/login" replace />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-900 dark:bg-slate-950 dark:text-white">
      <h1 className="mb-3 text-5xl font-bold">404</h1>
      <p className="mb-6 text-slate-500 dark:text-slate-400">Page not found</p>
      <a className="rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white" href="/">
        Go home
      </a>
    </div>
  );
}
