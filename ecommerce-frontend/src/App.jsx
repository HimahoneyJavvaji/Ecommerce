import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import UserCategoriesPage from "./pages/UserCategoriesPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import PaymentsPage from "./pages/PaymentsPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId");

  return (
    <>
      <Navbar cart={cart} />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <CategoriesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route
          path="/home"
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <UserDashboard cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <UserCategoriesPage cart={cart} setCart={setCart} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <CartPage cart={cart} setCart={setCart} userId={userId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <PaymentsPage cart={cart} setCart={setCart} userId={userId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute requiredRole="ROLE_USER">
              <UserOrdersPage userId={userId} />
            </ProtectedRoute>
          }
        />

        {/* ===== PROFILE ROUTES (for both USER & ADMIN) ===== */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole={["ROLE_USER", "ROLE_ADMIN"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute requiredRole={["ROLE_USER", "ROLE_ADMIN"]}>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/change-password"
          element={
            <ProtectedRoute requiredRole={["ROLE_USER", "ROLE_ADMIN"]}>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
