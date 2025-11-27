import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = () => {
    const token = localStorage.getItem("token");

    axios.put(
      "http://backend:8081/api/user/change-password",
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        alert("Password changed successfully!");
        window.location.href = "/profile";
      })
      .catch(() => alert("Password update failed"));
  };

  return (
    <div className="profile-container">
      <h2>Change Password</h2>

      <div className="profile-card">
        <label>Current Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="profile-btn" onClick={handleChangePassword}>
          Update Password
        </button>
      </div>
    </div>
  );
}
