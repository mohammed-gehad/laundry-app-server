const mongoose = require("mongoose");
const router = require("express").Router();
const orderController = require("../controllers/orderControllers");
const auth = require("../middleware/auth");

router.get("/items", auth.isUser, orderController.getAllItems);
router.post("/items", auth.isUser, auth.isAdmin, orderController.addItem);
router.delete(
  "/items/:id",
  auth.isUser,
  auth.isAdmin,
  orderController.deleteItem
);
router.put("/items/:id", auth.isUser, auth.isAdmin, orderController.updateItem);

router.get("/orders", auth.isUser, auth.isAdmin, orderController.getAllOrders);
router.put(
  "/orders/update",
  auth.isUser,
  auth.isAdmin,
  orderController.updateOrder
);
router.put(
  "/orders/orderInProgress/:id",
  auth.isUser,
  auth.isAdmin,
  orderController.orderInProgress
);
router.delete(
  "/orders/delivered/:id",
  auth.isUser,
  auth.isAdmin,
  orderController.orderDelivered
);
router.delete(
  "/orders/canceled/:id",
  auth.isUser,
  auth.isAdmin,
  orderController.cancelOrder
);

module.exports = router;
