// routes/purchaseRoutes.js
const express = require("express");
const router = express.Router();
const Purchase = require("./purchaseSchema");

// ✅ POST: Save multiple purchase entries
router.post("/data", async (req, res) => {
  try {
    const purchaseRows = req.body;

    if (!Array.isArray(purchaseRows)) {
      return res.status(400).json({ message: "Expected an array of purchase entries." });
    }

    for (const item of purchaseRows) {
      if (!item.ItemName || !item.Quantity) {
        return res.status(400).json({ message: "Missing ItemName or Quantity in some items." });
      }
    }

    const inserted = await Purchase.insertMany(purchaseRows);
    res.status(201).json({ message: "✅ Purchase data saved successfully", data: inserted });
  } catch (error) {
    console.error("❌ Error inserting purchase data:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ GET: Fetch all purchase data
router.get("/display", async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ EntryDate: -1 });
    if (!purchases.length) {
      return res.status(404).json({ message: "No purchase entries found." });
    }

    res.status(200).json({
      message: "✅ Purchases fetched successfully",
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    console.error("❌ Error fetching purchase data:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ DELETE: Remove a single purchase entry by ID
router.delete("/data/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Purchase.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "❌ Purchase entry not found" });
    }

    res.status(200).json({ message: "✅ Purchase entry deleted successfully", data: deleted });
  } catch (error) {
    console.error("❌ Error deleting purchase entry:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ PUT: Update a single purchase entry and unset 'source' if present
router.put("/data/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateQuery = { $set: updateData };

    // ✅ Unset 'source' if previously present and removed from request
    if (!("source" in updateData)) {
      updateQuery["$unset"] = { source: "" };
    }

    const updated = await Purchase.findByIdAndUpdate(id, updateQuery, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "❌ Purchase entry not found" });
    }

    res.status(200).json({ message: "✅ Purchase entry updated successfully", data: updated });
  } catch (error) {
    console.error("❌ Error updating purchase entry:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
