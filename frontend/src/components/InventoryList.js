import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InventoryList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/inventory')
            .then(response => {
                setItems(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching inventory:', error);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/inventory/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className="inventory-list">
            <h2>Inventory List</h2>
            {loading ? <p>Loading...</p> : items.length === 0 ? <p>No items available</p> : (
                <ul>
                    {items.map(item => (
                        <li key={item._id}>
                            {item.name} - {item.quantity}
                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InventoryList;
