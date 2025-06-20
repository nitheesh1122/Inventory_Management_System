const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

// ✅ GET all inventory items
router.get("/", async (req, res) => {
    try {
        const inventoryItems = await Inventory.find();
        res.json(inventoryItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inventory items" });
    }
});

// ✅ Add a new inventory item
router.post("/", async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Error adding inventory item" });
    }
});

// ✅ Update stock quantity
router.put("/update-stock", async (req, res) => {
    try {
        const { productName, quantityChange } = req.body;

        const product = await Inventory.findOne({ productName });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Ensure stock doesn't go negative
        if (product.stock + quantityChange < 0) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        product.stock += quantityChange;
        await product.save();

        res.json({ message: "Stock updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error updating stock" });
    }
});

module.exports = router;
