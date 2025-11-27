// Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ cart }) {
  const [role, setRole] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const getRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role?.trim().toUpperCase();
      } catch {
        return null;
      }
    }
    return null;
  };

  React.useEffect(() => {
    const checkRole = () => setRole(getRoleFromToken());
    checkRole();
    window.addEventListener("login", checkRole);
    window.addEventListener("logout", checkRole);

    return () => {
      window.removeEventListener("login", checkRole);
      window.removeEventListener("logout", checkRole);
    };
  }, []);

  const handleLogout = () => {
    // Client-side logout
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setRole(null);
    setOpenDropdown(false);
    window.dispatchEvent(new Event("logout"));

    // Navigate to login page
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">ShopEase</Link>
      </div>

      {/* USER NAVBAR */}
      {role === "ROLE_USER" && (
        <>
          <ul className="navbar-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/my-orders">My Orders</Link></li>
          </ul>

          <div className="navbar-icons">
            <Link to="/wishlist">❤️</Link>
            <Link to="/cart">
              🛒 ({cart?.reduce((acc, i) => acc + i.quantity, 0) || 0})
            </Link>

            {/* Profile Dropdown */}
            <div className="profile-wrapper">
              <div className="profile-icon" onClick={toggleDropdown}>
                👤
              </div>

              {openDropdown && (
                <div className="profile-dropdown">
                  <Link to="/profile">My Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ADMIN NAVBAR */}
      {role === "ROLE_ADMIN" && (
        <>
          <ul className="navbar-links">
            <li><Link to="/admin/categories">Manage Products</Link></li>
            <li><Link to="/admin/orders">User Orders</Link></li>
          </ul>

          <div className="navbar-icons">
            <Link to="/admin/settings">⚙️ Settings</Link>

            {/* Profile Dropdown */}
            <div className="profile-wrapper">
              <div className="profile-icon" onClick={toggleDropdown}>
                👤
              </div>

              {openDropdown && (
                <div className="profile-dropdown">
                  <Link to="/profile">My Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* GUEST NAVBAR */}
      {!role && (
        <div className="navbar-icons">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
