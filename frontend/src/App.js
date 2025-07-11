import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Inventory from "./components/Inventory/InventoryList";
import Account from "./components/Account/AccountManagement";
import Tools from "./components/Tools/Tools";
import Billing from "./components/Billing/Billing";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Sidebar should only be included once */}
        <Sidebar />
        <div style={{ flex: 1, padding: "20px", overflowX: "hidden" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/tools" element={<Tools />} />  
            <Route path="/billing" element={<Billing />} />  
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
