const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  hsn: String,
  qty: Number,
  rate: Number,
});

const InvoiceSchema = new mongoose.Schema({
  name: String,
  FatherName: String,
  address: String,
  phone: String,
  studentClass: String,
  syllabus: String,
  transactionId: String,
  paymentMode: String,
  date: String,
  invoiceNumber: String,
  items: [ItemSchema],
  totalAmount: Number,
});

module.exports = mongoose.model("Invoice", InvoiceSchema);