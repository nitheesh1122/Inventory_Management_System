import React, { useState } from 'react';
import axios from 'axios';

const AddItem = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (quantity <= 0) {
            setError('Quantity must be greater than 0');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/inventory', { name, quantity });
            alert('Item added successfully!');
            setName('');
            setQuantity('');
        } catch (error) {
            setError('Failed to add item');
            console.error('Error adding item:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-item">
            <h2>Add New Item</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Item'}
                </button>
            </form>
        </div>
    );
};

export default AddItem;
