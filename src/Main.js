require("dotenv").config();
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose")
const app = express()
const port = 5050

// ✅ Use CORS once
// app.use(cors());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ✅ MongoDB connection
const DB_URL = process.env.atlas_URL
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on("error", () => console.log("Database Connection Fails"));
db.on("open", () => console.log("Database Connection Success"));

// ✅ App logic
const purchase = require("./Purchase/PurchaseLogic");
app.use("/purchase", purchase);

// ✅ CreatePackage
const createpackage = require("./CreatePackage/CreatePackageLogic");
app.use("/create", createpackage) 

//✅ Ivoice Number
const invoicenumber = require("./Invoice/InvoiceNumberGen");
app.use("/invoice", invoicenumber)

// ✅ Save Invoice
const invoiceSave = require("./Invoice/InvoiceStore/InvoiceStoreLogic");
app.use("/save", invoiceSave)

// ✅ Auth Router
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ controlauth
const controlauth = require("./routes/controlauth")
app.use("/control-dashboard",controlauth);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running.. http://localhost:${port}`);
});
