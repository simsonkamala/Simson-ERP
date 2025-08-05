const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Get all users (admin only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

// ✅ Update user
// router.put("/:id", async (req, res) => {
//   try {
//     const { name, phone, role } = req.body;
//     const updated = await User.findByIdAndUpdate(
//       req.params.id,
//       { name, phone, role },
//       { new: true }
//     );
//     res.json(updated);
//   } catch {
//     res.status(500).json({ msg: "Failed to update user" });
//   }
// });
const bcrypt = require("bcryptjs");

router.put("/:id", async (req, res) => {
  try {
    const { name, phone, role, newPassword } = req.body;

    const update = { name, phone, role };

    // If admin provided a new password, hash and include it
    if (newPassword && newPassword.trim() !== "") {
      const hashed = await bcrypt.hash(newPassword, 10);
      update.password = hashed;
    }

    const updated = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("User update failed:", err);
    res.status(500).json({ msg: "Failed to update user" });
  }
});

// ✅ Delete user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch {
    res.status(500).json({ msg: "Failed to delete user" });
  }
});

module.exports = router;
