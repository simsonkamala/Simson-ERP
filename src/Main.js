require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

// ✅ Use Render's assigned port or default to 5050
const port = process.env.PORT || 5050;

// ✅ Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ✅ MongoDB connection
const DB_URL = process.env.atlas_URL; // ⬅️ fixed variable name
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", () => console.log("❌ Database Connection Fails"));
db.once("open", () => console.log("✅ Database Connection Success"));

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ Server is up and running on Render!");
});

app.use("/purchase", require("./Purchase/PurchaseLogic"));
app.use("/create", require("./CreatePackage/CreatePackageLogic"));
app.use("/invoice", require("./Invoice/InvoiceNumberGen"));
app.use("/save", require("./Invoice/InvoiceStore/InvoiceStoreLogic"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/control-dashboard", require("./routes/controlauth"));

// ✅ Start server — bind to 0.0.0.0
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});
