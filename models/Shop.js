const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const schema = mongoose.Schema({
  name: String,
  address: {
    type: ObjectId,
    ref: "Address",
  },
  thumb: String,
  img: String,
  orders: [{ type: ObjectId, ref: "Order" }],
  items: [{ type: ObjectId, ref: "Item" }],
});

mongoose.model("Shop", schema);
