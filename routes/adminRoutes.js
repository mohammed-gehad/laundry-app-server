const mongoose = require("mongoose");
const router = require("express").Router();
const orderController = require("../controllers/orderControllers");
const auth = require("../middleware/auth");

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
