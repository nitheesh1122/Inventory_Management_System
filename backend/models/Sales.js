const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");
const Inventory = require("../models/Inventory"); // ✅ Import Inventory model

// 🟢 Add a new sale (with stock validation)
router.post("/", async (req, res) => {
    try {
        const { productName, category, quantity, price, customerName } = req.body;
        const totalAmount = quantity * price;

        // ✅ Check if the product exists in inventory
        const inventoryItem = await Inventory.findOne({ productName });

        if (!inventoryItem) {
            return res.status(404).json({ error: "Product not found in inventory" });
        }

        // ✅ Check if stock is sufficient
        if (inventoryItem.stock < quantity) {
            return res.status(400).json({ error: "Insufficient stock!" });
        }

        // ✅ Reduce stock in inventory
        inventoryItem.stock -= quantity;
        await inventoryItem.save();

        // ✅ Record the sale
        const newSale = new Sales({
            productName,
            category,
            quantity,
            price,
            totalAmount,
            customerName
        });

        await newSale.save();
        res.status(201).json({ message: "Sale recorded successfully", sale: newSale });

    } catch (error) {
        res.status(500).json({ error: "Error recording sale" });
    }
});

module.exports = router;
