// CreatePackage/InvoiceCounter.js
const mongoose = require("mongoose");

const invoiceCounterSchema = new mongoose.Schema({
  fiscalYear: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

invoiceCounterSchema.index({ fiscalYear: 1 }, { unique: true });

module.exports = mongoose.model("InvoiceCounter", invoiceCounterSchema);
