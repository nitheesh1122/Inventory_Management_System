const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const inventoryRoutes = require("./routes/inventory");
const billingRoutes = require("./routes/billing");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/inventory", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Adjusted API route paths
app.use("/api/inventory", inventoryRoutes);
app.use("/api/billing", billingRoutes);

const PORT = 5009;  // Ensure the correct port is used
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
