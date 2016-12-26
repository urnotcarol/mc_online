var express = require("express");
var user = require("../controllers/user.js");
var order = require("../controllers/order.js");
var router = express.Router();

router.get("/", user.displayProfilePage);
router.post("/changePassword", user.changePassword);
router.post("/getBalance", user.getBalance);
router.post("/deposit", user.deposit);
// router.post("/getDepositLog", user.getDepositLog);
router.post("/getOrders", order.getOrders);

module.exports = router;
