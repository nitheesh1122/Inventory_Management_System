import React, { useState } from 'react';
import axios from 'axios';
import './AddItem.css';

const AddItem = () => {
  const [item, setItem] = useState({
    name: '',
    quantity: '',
    price: '',
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Correct URL: /api/inventories
      const res = await axios.post('http://localhost:5000/api/inventories', item);
      alert('✅ Item added successfully!');
      setItem({ name: '', quantity: '', price: '' });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('❌ Failed to add item.');
    }
  };

  return (
    <div className="add-item-container">
      <h2>➕ Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={item.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={item.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={item.price}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
