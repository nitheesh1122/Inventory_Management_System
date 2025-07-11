import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/inventory"; // Ensure this matches your backend API endpoint

// GET all inventory items
export const getInventory = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return [];
    }
};

// ADD a new inventory item
export const addInventory = async (item) => {
    try {
        await axios.post(API_BASE_URL, item);
    } catch (error) {
        console.error("Error adding inventory item:", error);
    }
};

// UPDATE an inventory item
export const updateInventory = async (id, updatedItem) => {
    try {
        await axios.put(`${API_BASE_URL}/${id}`, updatedItem);
    } catch (error) {
        console.error("Error updating inventory item:", error);
    }
};

// DELETE an inventory item
export const deleteInventory = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting inventory item:", error);
    }
};
