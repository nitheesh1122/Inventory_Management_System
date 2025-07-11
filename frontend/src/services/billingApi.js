const API_URL = "http://localhost:5000/api"; // Base API URL

// Fetch all sales
export const getSales = async () => {
    try {
        const response = await fetch(`${API_URL}/sales`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching sales:", error);
        return [];
    }
};

// Add a sale
export const addSale = async (saleData) => {
    try {
        const response = await fetch(`${API_URL}/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(saleData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding sale:", error);
        return null;
    }
};

// Delete a sale
export const deleteSale = async (id) => {
    try {
        const response = await fetch(`${API_URL}/sales/${id}`, {
            method: "DELETE",
        });
        return await response.json();
    } catch (error) {
        console.error("Error deleting sale:", error);
        return null;
    }
};

// Fetch inventory data
export const getInventory = async () => {
    try {
        const response = await fetch(`${API_URL}/inventory`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return [];
    }
};

// Update inventory stock (positive = add, negative = reduce)
export const updateStock = async (productName, change) => {
    try {
        const response = await fetch(`${API_URL}/inventory/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productName, change }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating stock:", error);
        return null;
    }
};
