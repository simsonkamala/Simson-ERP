// routes/invoiceNumber.js
const express = require("express");
const router = express.Router();
const InvoiceCounter = require("./InvoiceCounter");
const getFiscalYear = require("./GetFiscalYear");

// ✅ GET /generate-invoice-no
router.get("/generate-invoice-no", async (req, res) => {
  try {
    const fiscalYear = getFiscalYear();
    const counter = await InvoiceCounter.findOneAndUpdate(
      { fiscalYear },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const padded = String(counter.seq).padStart(3, "0");
    const invoiceNumber = `${fiscalYear}-${padded}`;
    res.json({ invoiceNumber });
  } catch (err) {
    console.error("❌ Invoice number error:", err);
    res.status(500).json({ error: "Failed to generate invoice number" });
  }
});

module.exports = router;
