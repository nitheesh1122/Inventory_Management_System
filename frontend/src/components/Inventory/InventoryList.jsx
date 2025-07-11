import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit, Search, Filter, PlusCircle } from 'lucide-react';
import "./InventoryList.css";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch inventory data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5009/api/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setError("Failed to fetch inventory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5009/api/inventory/${id}`);
      fetchInventory();  // Refresh inventory after deletion
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item. Please try again.");
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map(id => axios.delete(`http://localhost:5009/api/inventory/${id}`))
      );
      fetchInventory();
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting items:", error);
      setError("Failed to delete selected items. Please try again.");
    }
  };

  // Toggle item selection
  const toggleItemSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // Select all items
  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredInventory.length 
        ? [] 
        : filteredInventory.map(item => item._id)
    );
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sorted and filtered inventory
  const filteredInventory = inventory
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <div className="inventory-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-button">
            <PlusCircle size={20} />
            Add New Item
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {selectedItems.length > 0 && (
            <div className="bulk-actions">
              <span>{selectedItems.length} items selected</span>
              <button 
                onClick={handleBulkDelete} 
                className="bulk-delete-button"
              >
                <Trash2 size={16} /> Delete Selected
              </button>
            </div>
          )}

          <table className="inventory-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox"
                    checked={selectedItems.length === filteredInventory.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('name')}>
                  Name {sortConfig.key === 'name' && (
                    <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('category')}>
                  Category {sortConfig.key === 'category' && (
                    <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('quantity')}>
                  Quantity {sortConfig.key === 'quantity' && (
                    <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('price')}>
                  Price {sortConfig.key === 'price' && (
                    <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('supplier')}>
                  Supplier {sortConfig.key === 'supplier' && (
                    <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-results">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item._id} 
                    className={selectedItems.includes(item._id) ? 'selected-row' : ''}
                  >
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleItemSelection(item._id)}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toLocaleString()}</td>
                    <td>{item.supplier}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-button">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="delete-button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="inventory-footer">
            <span>Total Items: {inventory.length}</span>
            <span>Showing {filteredInventory.length} of {inventory.length}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryList;