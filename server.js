const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
app.use(
  cors({
    exposedHeaders: ["token"],
  })
);

///models
require("./models/Address");
require("./models/Order");
require("./models/Shop");
require("./models/User");

///routes
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const adminRoutes = require("./routes/adminRoutes");
const addressRoutes = require("./routes/addressRoutes");

const url =
  "mongodb+srv://mohammedgehad:mohammedPassword@laundry-app-cluster-8vjxg.mongodb.net/laundry?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/order", orderRoutes);
app.use("/customer", userRoutes);
app.use("/shop", shopRoutes);
app.use("/admin", adminRoutes);
app.use("/address", addressRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening at ${port}`);
});

const ngrok = require("ngrok");
(async function () {
  const url = await ngrok.connect(port);
  console.log(url);
})();
