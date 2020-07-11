const mongoose = require("mongoose");
const router = require("express").Router();
const geocodeNominatim = require("../utilities/geocodeNominatim");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    console.log(req.body);
    const add = await geocodeNominatim.getAddress(latitude, longitude);
    console.log(add);
    res.send(add);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
