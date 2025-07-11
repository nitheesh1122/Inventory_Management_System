import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar"; // Import Sidebar
import "./AccountManagement.css";

const AccountManagement = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "enabled");
  const [username, setUsername] = useState(localStorage.getItem("username") || "User");
  const [role, setRole] = useState(localStorage.getItem("role") || "Unknown");
  const [lastLogin, setLastLogin] = useState(localStorage.getItem("lastLogin") || "N/A");

  useEffect(() => {
    if (!localStorage.getItem("lastLogin")) {
      const currentTime = new Date().toLocaleString();
      localStorage.setItem("lastLogin", currentTime);
      setLastLogin(currentTime);
    }
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode ? "enabled" : "disabled");
    document.body.classList.toggle("dark-mode", newMode);
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <h2>👤 Account Management</h2>

        {/* Profile Overview */}
        <div className="profile-card">
          <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${username}`} alt="Profile Avatar" />
          <h3>{username}</h3>
          <p>Role: <strong>{role}</strong></p>
          <p>Last Login: {lastLogin}</p>
        </div>

        {/* Theme and Dark Mode Settings */}
        <div className="settings-section">
          <h3>🎨 Theme Settings</h3>
          <button onClick={toggleDarkMode}>{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</button>
        </div>

        {/* Change Password Section (Frontend Only) */}
        <div className="settings-section">
          <h3>🔒 Change Password</h3>
          <input type="password" placeholder="Enter New Password" />
          <button>Update Password</button>
        </div>

        {/* Logout Button */}
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
