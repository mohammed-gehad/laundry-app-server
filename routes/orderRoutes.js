const mongoose = require("mongoose");
const router = require("express").Router();
const orderController = require("../controllers/orderControllers");
const auth = require("../middleware/auth");

router.get("/", auth.isUser, orderController.getCustomersCurrentOrders);
router.post("/", auth.isUser, orderController.addOrder);
router.delete("/:id", auth.isUser, orderController.cancelOrder);
module.exports = router;
