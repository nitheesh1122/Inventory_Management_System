import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line, Pie } from 'react-chartjs-2';
import Sidebar from '../Sidebar/Sidebar'; // Import Sidebar
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Sample Data
  const totalSales = '₹ 5,00,000';
  const bestProduct = 'Wireless Mouse';
  const worstProduct = 'USB Hub';

  const lowStockItems = [
    { name: 'Keyboard', stock: 3 },
    { name: 'Laptop Charger', stock: 2 },
    { name: 'HDMI Cable', stock: 5 }
  ];

  const recentOrders = [
    { id: 'ORD123', customer: 'Rahul', amount: '₹ 3,500' },
    { id: 'ORD124', customer: 'Meera', amount: '₹ 2,000' },
    { id: 'ORD125', customer: 'Vikram', amount: '₹ 1,200' }
  ];

  const topCustomers = [
    { name: 'Anil Kumar', totalSpent: '₹ 50,000' },
    { name: 'Priya Sharma', totalSpent: '₹ 45,000' },
    { name: 'Rajesh Gupta', totalSpent: '₹ 40,000' }
  ];

  // Charts Data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Monthly Sales (₹)', data: [50000, 70000, 65000, 80000, 90000, 100000], backgroundColor: '#1E3A8A' }]
  };

  const dailySalesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ label: 'Daily Sales (₹)', data: [5000, 7000, 8000, 7500, 9000, 12000, 11000], borderColor: '#1E3A8A', fill: false }]
  };

  const categorySalesData = {
    labels: ['Electronics', 'Furniture', 'Accessories', 'Clothing'],
    datasets: [{ label: 'Sales by Category', data: [300000, 120000, 50000, 30000], backgroundColor: ['#1E3A8A', '#22C55E', '#EF4444', '#EAB308'] }]
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Component */}

      {/* Main Dashboard Content */}
      <div className={darkMode ? "dashboard-container dark-mode" : "dashboard-container"}>
        <div className="dashboard-header">
          <h2>📊 Inventory Dashboard</h2>
          <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className="summary-cards">
          <motion.div className="card total-sales" whileHover={{ scale: 1.05 }}>
            <h3>Total Sales</h3>
            <p>{totalSales}</p>
          </motion.div>

          <motion.div className="card best-product" whileHover={{ scale: 1.05 }}>
            <h3>Best Product</h3>
            <p>{bestProduct}</p>
          </motion.div>

          <motion.div className="card worst-product" whileHover={{ scale: 1.05 }}>
            <h3>Worst Product</h3>
            <p>{worstProduct}</p>
          </motion.div>
        </div>

        <div className="dashboard-section">
          <div className="chart-container">
            <h3>📈 Sales Performance (Monthly)</h3>
            <Bar key="sales-chart" data={salesData} />
          </div>

          <div className="chart-container">
            <h3>📊 Category-wise Sales</h3>
            <Pie key="category-chart" data={categorySalesData} />
          </div>
        </div>

        <div className="dashboard-section">
          <div className="chart-container">
            <h3>📉 Daily Sales Trend</h3>
            <Line key="daily-sales-chart" data={dailySalesData} />
          </div>

          <div className="low-stock">
            <h3>⚠️ Low Stock Alerts</h3>
            <ul>
              {lowStockItems.map(item => (
                <li key={item.name}>{item.name} - Only {item.stock} left!</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="recent-orders">
            <h3>🛒 Recent Orders</h3>
            <ul>
              {recentOrders.map(order => (
                <li key={order.id}>{order.id} - {order.customer} - {order.amount}</li>
              ))}
            </ul>
          </div>

          <div className="top-customers">
            <h3>🏆 Top Customers</h3>
            <ul>
              {topCustomers.map(customer => (
                <li key={customer.name}>{customer.name} - {customer.totalSpent}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
