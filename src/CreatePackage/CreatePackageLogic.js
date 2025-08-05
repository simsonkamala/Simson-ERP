// const express = require("express");
// const router = express.Router();
// const PackageGroup = require("./CreatepackageSchema");

// // 🔄 POST route to create a package group
// router.post("/packages", async (req, res) => {
//   try {
//     const { Class, Syllabus, items } = req.body;

//     // ✅ Validation
//     if (!Class || !Syllabus || !Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Class, Syllabus & items are required" });
//     }

//     const newPackageGroup = await PackageGroup.create({ Class, Syllabus, items });

//     res.status(201).json({
//       message: "✅ Package group saved successfully",
//       data: newPackageGroup,
//     });
//   } catch (err) {
//     console.error("❌ Error saving package group:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // (Optional) GET route to fetch all package groups
// router.get("/packagesget", async (req, res) => {
//   try {
//     const packages = await PackageGroup.find().sort({ createdAt: -1 });
//     res.json({ packages });
//   } catch (err) {
//     res.status(500).json({ message: "❌ Error fetching packages", error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const PackageGroup = require("./CreatepackageSchema");

// 🔄 POST route to create a package group
router.post("/packages", async (req, res) => {
  try {
    const { Class, Syllabus, items } = req.body;

    if (!Class || !Syllabus || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Class, Syllabus & items are required" });
    }

    // ✅ Validate only required item fields
    const invalidItem = items.find(item =>
      !item.ItemName || typeof item.SaleRate !== "number"
    );

    if (invalidItem) {
      return res.status(400).json({
        message: "Each item must include ItemName and numeric Rate"
      });
    }

    const newPackageGroup = await PackageGroup.create({ Class, Syllabus, items });

    res.status(201).json({
      message: "✅ Package group saved successfully",
      data: newPackageGroup,
    });
  } catch (err) {
    console.error("❌ Error saving package group:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📦 GET all package groups
router.get("/packagesget", async (req, res) => {
  try {
    const packages = await PackageGroup.find().sort({ createdAt: -1 });
    res.json({ packages });
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching packages", error: err.message });
  }
});

module.exports = router;



