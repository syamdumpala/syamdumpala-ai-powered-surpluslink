import { Routes, Route, Navigate } from "react-router-dom";
import { useMemo } from "react";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";

// Dashboards
import RestaurantDashboard from "../pages/restaurant/RestaurantDashboard";
import VolunteerDashboard from "../pages/volunteer/VolunteerDashboard";
import NGODashboard from "../pages/ngo/NGODashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  // 🔥 Centralized auth state
  const auth = useMemo(() => {
    return {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
    };
  }, []);

  // 🔥 Role-based redirect
  const getDashboardRoute = () => {
    if (!auth.token) return "/login";

    const routes: Record<string, string> = {
      restaurant: "/restaurant",
      volunteer: "/volunteer",
      ngo: "/ngo",
      admin: "/admin",
    };

    return routes[auth.role || ""] || "/";
  };

  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          auth.token ? <Navigate to={getDashboardRoute()} replace /> : <Login />
        }
      />

      {/* ================= SMART REDIRECT ================= */}
      <Route
        path="/dashboard"
        element={<Navigate to={getDashboardRoute()} replace />}
      />

      {/* ================= PROTECTED ================= */}

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

      {/* ================= LOGOUT ================= */}
      <Route path="/logout" element={<Logout />} />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

//
// 🔥 LOGOUT COMPONENT (clean way)
//
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" replace />;
}

//
// 🔥 404 PAGE (better UX)
//
function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
      <h1 className="text-5xl font-bold text-gray-700 dark:text-white mb-4">
        404 🚫
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Page not found
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-green-500 text-white rounded-xl"
      >
        Go Home
      </a>
    </div>
  );
}