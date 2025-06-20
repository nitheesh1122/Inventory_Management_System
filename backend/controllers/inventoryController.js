const Inventory = require("../models/Inventory");

// Get all inventory items
const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new inventory item
const addInventory = async (req, res) => {
  const { name, category, quantity, price, supplier } = req.body;

  try {
    const newItem = new Inventory({ name, category, quantity, price, supplier });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an inventory item
const updateInventory = async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an inventory item
const deleteInventory = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inventory quantity only (increment/decrement)
const updateInventoryQuantity = async (req, res, quantityChange) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item.quantity += quantityChange;
    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
  updateInventoryQuantity,
};
