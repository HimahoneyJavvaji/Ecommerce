// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://backend:8081/api/auth/login", form);
      const token = res.data.token;
      if (!token) throw new Error("No token received");

      // Save token
      localStorage.setItem("token", token);

      // Decode payload (safe-ish, assumes JWT has 3 parts)
      try {
        const payload = JSON.parse(atob(token.split(".")[1] || ""));
        const role = payload.role?.trim().toUpperCase(); // "USER" or "ADMIN"
        const userId = payload.userId ?? payload.userId === 0 ? payload.userId : null;

        // Save userId so App.jsx can read it
        if (userId !== null) {
          localStorage.setItem("userId", String(userId));
        }

        // Redirect based on role
        if (role === "ADMIN") navigate("/admin");
        else navigate("/home");
      } catch {
        // If decode fails, still navigate to home
        navigate("/home");
      }

      window.dispatchEvent(new Event("login")); // update navbar
    } catch (err) {
      setError(err.response?.data || err.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="bottom-link">
          No account? <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
}
