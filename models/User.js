const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ObjectId = mongoose.Types.ObjectId;

const schema = mongoose.Schema({
  username: String,
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  orders: [{ type: ObjectId, ref: "Order" }],
  addresses: { type: ObjectId, ref: "Address" },
  role: {
    type: String,
    default: "customer",
  },
});

schema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, "jwtSecret");
  return token;
};
mongoose.model("User", schema);
