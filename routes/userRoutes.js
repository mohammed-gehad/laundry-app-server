const express = require("express");
const route = express.Router();
route.use(express.json());
const mongoose = require("mongoose");
const UserModel = mongoose.model("User");
const bcrypt = require("bcrypt");
//auth is a middleware for verifying the token
const auth = require("../middleware/auth");

//registering a new user
route.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new UserModel({ username, email, password: hashedPassword });
    await user.save();
    res.header("token", user.generateToken()).send(user);
  } catch (e) {
    res.send(e._message);
  }
});
//

//login a user
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.send("email or password are required");
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) throw { message: "invalid email", username: "" };
    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      res.header("token", user.generateToken()).send(user);
    } else throw { message: "invalid password", username: user.username };
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

//return users info
route.get("/me", auth.isUser, async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.user._id });
    res.header("token", user.generateToken()).send(user);
  } catch (e) {
    res.send(e);
  }
});

module.exports = route;
