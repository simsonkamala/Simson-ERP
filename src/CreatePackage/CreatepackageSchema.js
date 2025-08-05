// const mongoose = require("mongoose");

// const packageGroupSchema = new mongoose.Schema({
//   Class: { type: String, required: true },
//   Syllabus: { type: String, required: true },
//   items: [
//     {
//       ItemName: { type: String, required: true },
//       Rate: { type: Number, required: true },
//     }
//   ],
// }, { timestamps: true });

// // 📦 Indexes for fast filtering/sorting
// packageGroupSchema.index({ Class: 1 });
// packageGroupSchema.index({ Syllabus: 1 });
// packageGroupSchema.index({ createdAt: -1 });

// module.exports = mongoose.model("PackageGroup", packageGroupSchema);



const mongoose = require("mongoose");

const packageGroupSchema = new mongoose.Schema({
  Class: { type: String, required: true },
  Syllabus: { type: String, required: true },
  items: [
    {
      ItemName: { type: String, required: true },
      SaleRate: { type: Number, required: true },
      Size: { type: String, required: false },
      HSNCode: { type: String, required: false },
    }
  ],
}, { timestamps: true });

// 📦 Add indexes for optimized queries
packageGroupSchema.index({ Class: 1 });
packageGroupSchema.index({ Syllabus: 1 });
packageGroupSchema.index({ createdAt: -1 });

module.exports = mongoose.model("PackageGroup", packageGroupSchema);

