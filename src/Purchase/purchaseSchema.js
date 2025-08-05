// models/purchaseSchema.js
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  ItemName: String,
  AuthorBrand: String,
  Class: String,
  Syllabus: String,
  Size: String,
  HSNCode: String,
  Vendor: String,
  SaleRate: String,
  MRPRate: Number,
  LandingPrice: Number,
  Quantity: Number,
  BillDate: String,
  EntryDate: String,
  
  // ✅ Optional field to track custom rows (used for red highlight)
  source: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Purchase", purchaseSchema);
