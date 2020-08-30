const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const orderStatus = require("./orderStatuses");
const schema = mongoose.Schema({
  customer: { type: ObjectId, ref: "User" },
  cart: [{ id: { type: ObjectId, ref: "Item" }, quantity: Number }],
  price: Number,
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
  address: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  instruction: String,
  chat: [
    {
      sender: String,
      message: String,
      data: Date,
    },
  ],
  unreadMessagesForAdmin: {
    type: Number,
    default: 0,
  },
  unreadMessagesForCustomer: {
    type: Number,
    default: 0,
  },
});

mongoose.model("Order", schema);
