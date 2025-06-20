const express = require("express");
const router = express.Router();
const {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
  updateInventoryQuantity,
} = require("../controllers/inventoryController");

// Existing routes
router.get("/", getInventory);
router.post("/", addInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

// New: Reduce quantity route
router.put("/:id/reduce", (req, res) => {
  const { quantityChange } = req.body;
  updateInventoryQuantity(req, res, quantityChange);
});

module.exports = router;
