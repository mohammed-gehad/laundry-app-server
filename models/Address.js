const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const schema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
  address: String,
});

mongoose.model("Address", schema);
