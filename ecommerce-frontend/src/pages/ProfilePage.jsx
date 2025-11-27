import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://backend:8081/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.log("Profile Fetch Error", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This cannot be undone!"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete("http://backend:8081/api/user/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete account");
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const res = await axios.put(
        "http://backend:8081/api/user/update",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Save new token
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Update failed");
    }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-card">
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}
        </p>

        {user.updatedAt && (
          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(user.updatedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="profile-actions">
        <button
          className="btn-edit"
          onClick={() =>
            handleProfileUpdate({
              username: prompt("Enter new username:", user.username),
              email: prompt("Enter new email:", user.email),
            })
          }
        >
          Edit Profile
        </button>

        <button
          className="btn-password"
          onClick={() => navigate("/profile/change-password")}
        >
          Change Password
        </button>

        <button className="btn-delete" onClick={handleDeleteAccount}>
          Delete Account
        </button>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
