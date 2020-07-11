const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Shop = mongoose.model("Shop");

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const shop = new Shop({ name });
    const result = await shop.save();
    res.send(result);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
