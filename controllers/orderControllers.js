const mongoose = require("mongoose");

const Order = mongoose.model("Order");
const User = mongoose.model("User");
const Address = mongoose.model("Address");
const Shop = mongoose.model("Shop");

const orderStatus = require("../models/orderStatuses");

exports.addOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { timeScheduled, address, instruction } = req.body;
    const order = new Order({
      customer: userId,
      timeScheduled,
      address,
      instruction,
    });

    const user = await User.findById(userId);
    user.orders.unshift(order._id);

    //only one shop for now
    const shop = await Shop.findOne();
    shop.orders.unshift(order._id);

    await order.save();
    await user.save();
    await shop.save();

    res.send(order);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const _getAllOrders = async () => {
  const shop = await Shop.findOne().select("orders -_id");

  await shop.populate("orders").execPopulate();

  if (shop.orders.length) {
    await shop
      .populate({
        path: "orders",
        populate: "customer",
      })
      .execPopulate();
  }

  return shop;
};

//admin permission
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await _getAllOrders();
    res.send(orders);
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
};

exports.updateOrder = async (req, res) => {
  const orderId = req.params.id;
  const { total, isPaid } = req.body;
  await Order.findByIdAndUpdate(orderId, { total, isPaid });
  const orders = await _getAllOrders();
  res.send(orders);
};

exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findOneAndUpdate({ _id: orderId }, orderStatus.CANCELED);
    const orders = await _getAllOrders();
    res.send(orders);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

exports.orderDelivered = async (req, res) => {
  try {
    const orderId = req.params.id;
    await Order.findOneAndUpdate({ _id: orderId }, orderStatus.DELIVERED);
    const orders = await _getAllOrders();
    console.log("orders", orders);
    res.send(orders);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

exports.orderInProgress = async (req, res) => {
  const orderId = req.params.id;
  try {
    await Order.findOneAndUpdate({ _id: orderId }, orderStatus.IN_PROGRESS);
    const orders = await _getAllOrders();
    res.send(orders);
  } catch (e) {
    console.log(e);
    res.send(e.message);
  }
};
///

exports.getCustomersCurrentOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.send("user id is required");
    const user = await User.findById(userId)
      .populate("orders")
      .select("orders -_id");
    res.send(user);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

//helper functions
