import React from "react";
import "./WorkerTools.css";

const WorkerTools = () => {
  return (
    <div className="worker-tools">
      <h1>Worker Tools</h1>
      <p>You can only view inventory details.</p>
      <ul>
        <li>✅ View Stock Levels</li>
        <li>✅ View Orders</li>
        <li>❌ Cannot Add/Edit/Delete Products</li>
      </ul>
    </div>
  );
};

export default WorkerTools;
