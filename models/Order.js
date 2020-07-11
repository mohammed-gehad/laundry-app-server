const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const orderStatus = require("./orderStatuses");
const schema = mongoose.Schema({
  customer: { type: ObjectId, ref: "User" },
  status: {
    type: String,
    default: orderStatus.PICK_UP_SCHEDULED,
  },
  timePlaced: {
    type: Date,
    default: Date.now,
  },
  timeScheduled: Date,
  timeDelivered: Date,
  total: Number,
  isPaid: {
    type: Boolean,
    default: false,
  },
  address: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  instruction: String,
});

mongoose.model("Order", schema);
