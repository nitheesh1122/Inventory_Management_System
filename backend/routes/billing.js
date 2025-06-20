const express = require("express");
const router = express.Router();
const Sales = require("../models/Sales");

// 🟢 Add a new sale
router.post("/", async (req, res) => {
    try {
        const { productName, category, quantity, price, customerName } = req.body;
        const totalAmount = quantity * price;

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

// 🟢 Get all sales
router.get("/", async (req, res) => {
    try {
        const sales = await Sales.find().sort({ date: -1 });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: "Error fetching sales" });
    }
});

// 🟢 Get a specific sale by ID
router.get("/:id", async (req, res) => {
    try {
        const sale = await Sales.findById(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: "Sale not found" });
        }
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ error: "Error fetching sale" });
    }
});

// 🟢 Delete a sale
router.delete("/:id", async (req, res) => {
    try {
        const sale = await Sales.findByIdAndDelete(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: "Sale not found" });
        }
        res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting sale" });
    }
});

module.exports = router;
