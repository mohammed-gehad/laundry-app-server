const mongoose = require("mongoose");

const Order = mongoose.model("Order");
const User = mongoose.model("User");
const Address = mongoose.model("Address");
const Shop = mongoose.model("Shop");
const Item = mongoose.model("Item");

const orderStatus = require("../models/orderStatuses");

exports.getAllItems = async (req, res) => {
  const shop = await Shop.findOne().select("items -_id").populate("items");

  res.send(shop.items);
};
exports.addItem = async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    const item = new Item({
      name,
      price,
      image,
      description,
    });

    //only one shop for now
    const shop = await Shop.findOne();
    shop.items.unshift(item._id);

    await item.save();
    await shop.save();

    await shop.populate("items").execPopulate();

    res.send(shop.items);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.findOneAndRemove({ _id: itemId });
    const shop = await Shop.findOne();
    shop.items = shop.items.filter((item) => item._id != itemId);
    await shop.save();
    await shop.populate("items").execPopulate();

    res.send(shop.items);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};
exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findOne({ _id: itemId });

    await Item.save();

    await item.save();

    const shop = await Shop.findOne().select("items -_id");
    await shop.populate("items").execPopulate();

    res.send(shop);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

const refreshTotalPrice = async (cart) => {
  const { items } = await Shop.findOne().select("items -_id").populate("items");

  const Price = (id) => {
    let index = -1;
    items && (index = items.findIndex((item) => item._id == id));
    if (index != -1) {
      return items[index].price;
    }
    return 0;
  };

  let price = 0;
  cart.map((item) => {
    price = price + Price(item.id) * item.quantity;
  });

  return price;
};

exports.addOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, instruction, cart } = req.body;

    const order = new Order({
      customer: userId,
      address,
      instruction,
      cart,
      price: await refreshTotalPrice(cart),
    });

    const user = await User.findById(userId);
    user.orders.unshift(order._id);

    //only one shop for now
    const shop = await Shop.findOne();
    shop.orders.unshift(order._id);

    await order.save();
    await user.save();
    await shop.save();
    const { orders } = await user.populate("orders").execPopulate();
    res.send(orders);
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
      .populate({
        path: "orders",
        populate: { path: "cart", populate: { path: "id" } },
      })
      .select("orders -_id");

    res.send(user);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
};

//helper functions
