import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaTools, FaFileInvoiceDollar } from "react-icons/fa"; // Added Billing Icon
import { AiOutlineHome } from "react-icons/ai";
import { IoPersonCircleOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Sidebar.css";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      {/* Sidebar Toggle Button */}
      <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
        <GiHamburgerMenu size={22} />
      </button>

      {/* Sidebar Menu */}
      <ul className="menu">
        <li className="menu-item">
          <Link to="/dashboard">
            <AiOutlineHome size={24} />
            {isExpanded && <span>Dashboard</span>}
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/inventory">
            <FaBoxOpen size={24} />
            {isExpanded && <span>Inventory</span>}
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/tools">
            <FaTools size={24} />
            {isExpanded && <span>Tools</span>}
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/billing"> {/* ✅ Added Billing Page Link */}
            <FaFileInvoiceDollar size={24} />
            {isExpanded && <span>Billing</span>}
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/account">
            <IoPersonCircleOutline size={24} />
            {isExpanded && <span>Account</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
