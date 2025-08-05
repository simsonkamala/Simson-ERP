const express = require("express");
const router = express.Router();
const Invoice = require("./InvoiceStoreSchema");

router.post("/save-invoice", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(200).json({ success: true, message: "Invoice saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Saving failed" });
  }
});

// ✅ GET: Fetch all invoices
router.get("/invoice", async (req, res) => {
  try{
    const invoice = await Invoice.find({});
    res.status(200).json( invoice )
  }catch(error){
    console.error("Failed to fetch invoices:", error)
    res.status(500).json({ message : "Fetching failed" })
  }
})

// ✅ Delete : the perticular row 
router.delete("/invoice/:id", async(req, res) => {
  try{
    const {id} = req.params;
    await Invoice.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Invoice deleted" })

  }catch(error){
    console.error("Deletion failed:", error),
    res.status(500).json({ success: false, message: "Failed to delete invoice" })
  }
})
module.exports = router;