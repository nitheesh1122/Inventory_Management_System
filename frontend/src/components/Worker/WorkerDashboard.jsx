import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerDashboard.css";

const WorkerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "worker") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="worker-dashboard">
      <h1>Worker Dashboard</h1>
      <p>You have limited access to inventory insights.</p>
      <div className="summary-cards">
        <div className="card">📊 Sales Overview</div>
        <div className="card">📦 Inventory Status</div>
        <div className="card">📉 Recent Activity</div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
