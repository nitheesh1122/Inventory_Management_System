import React from "react";
import { 
  FaPlus, 
  FaTrash, 
  FaEdit, 
  FaSyncAlt, 
  FaShoppingCart
} from "react-icons/fa";
import "./Tools.css";

function ToolCard({ icon: Icon, title, description }) {
  return (
    <div className="tool-card">
      <div className="tool-icon">
        <Icon />
      </div>
      <div className="tool-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Tools() {
  const tools = [
    {
      icon: FaPlus,
      title: "Add Product",
      description: "Create new product entries"
    },
    {
      icon: FaTrash,
      title: "Delete Product",
      description: "Remove existing products"
    },
    {
      icon: FaEdit,
      title: "Edit Item",
      description: "Modify product information"
    },
    {
      icon: FaSyncAlt,
      title: "Update Stock",
      description: "Refresh inventory counts"
    },
    {
      icon: FaShoppingCart,
      title: "Order Stocks",
      description: "Purchase additional inventory"
    }
  ];

  return (
    <div className="tools-container">
      <header className="tools-header">
        <h1 className="tools-title">Tools Dashboard</h1>
        <p className="tools-subtitle">Manage your inventory efficiently</p>
      </header>
      
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <ToolCard 
            key={index}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Tools;