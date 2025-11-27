import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

export default function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://backend:8081/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
    })
    .catch(() => alert("Failed to load profile"));
  }, []);

  const handleSave = () => {
    const token = localStorage.getItem("token");

    axios.put("http://backend:8081/api/user/update",  
      { username, email },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      alert("Profile updated!");
      window.location.href = "/profile";
    })
    .catch(() => alert("Update failed"));
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>

      <div className="profile-card">
        <label>Username</label>
        <input 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Email</label>
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="profile-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
