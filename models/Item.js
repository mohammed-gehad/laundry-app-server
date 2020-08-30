const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const schema = mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
});

mongoose.model("Item", schema);
