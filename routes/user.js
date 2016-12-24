var express = require("express");
var user = require("../controllers/user.js");
// var order = require("../controllers/order.js");
var router = express.Router();

router.get("/", user.displayPage);
router.post("/login", user.login);
router.post("/logup", user.logup);
// router.post("/changePassword", user.changePassword);
// router.post("/getBalance", user.getBalance);
// router.post("/deposit", user.deposit);
// router.post("/getDepositLog", user.getDepositLog);
// router.post("/getOrder", user.getOrder);

module.exports = router;
