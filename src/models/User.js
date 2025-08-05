const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  phone: String,
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
module.exports = mongoose.model("User", schema);