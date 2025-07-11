import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [totalItems, setTotalItems] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5000/api/inventory')
            .then(response => {
                setTotalItems(response.data.length);
                setTotalQuantity(response.data.reduce((acc, item) => acc + item.quantity, 0));
            })
            .catch(error => console.error('Error fetching inventory:', error));
    }, []);

    return (
        <div className="dashboard">
            <h1>Inventory Management System</h1>
            <p>Welcome to the Dashboard!</p>
            <h3>Inventory Summary</h3>
            <p>Total Items: {totalItems}</p>
            <p>Total Quantity: {totalQuantity}</p>
        </div>
    );
};

export default Dashboard;
