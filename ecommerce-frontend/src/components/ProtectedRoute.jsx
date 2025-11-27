import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role?.trim().toUpperCase();

    // If requiredRole is a STRING
    if (typeof requiredRole === "string") {
      if (userRole !== requiredRole.toUpperCase()) {
        return <NavigateToRole userRole={userRole} />;
      }
    }

    // If requiredRole is an ARRAY (ex: ["ROLE_USER", "ROLE_ADMIN"])
    if (Array.isArray(requiredRole)) {
      const allowed = requiredRole.map(r => r.toUpperCase());
      if (!allowed.includes(userRole)) {
        return <NavigateToRole userRole={userRole} />;
      }
    }

    // No requiredRole means allow everything
    return children;

  } catch (err) {
    console.error("JWT parsing error:", err);
    return <Navigate to="/login" replace />;
  }
}

// Helper: redirect based on role
function NavigateToRole({ userRole }) {
  if (userRole === "ROLE_ADMIN") return <Navigate to="/admin" replace />;
  if (userRole === "ROLE_USER") return <Navigate to="/home" replace />;
  return <Navigate to="/login" replace />;
}
