const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.isUser = function (req, res, next) {
  const token = req.header("token");
  const decoded = jwt.decode(token, "jwtSecret");
  if (!decoded) res.send("invalid token");
  else {
    req.user = decoded;
    next();
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const _id = req.user._id;
    if (!_id) return res.send("id not found");
    const user = await User.findById(_id);
    if (user.role === "admin") return next();
    res.send("not allowed");
  } catch (e) {
    res.send(e.message);
  }
};
