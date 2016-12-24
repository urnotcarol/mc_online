var express = require("express");
var cart = require("../controllers/cart.js");
var router = express.Router();

router.get("/", cart.displayPage);
router.get("/getCart", cart.getCart);
// router.post("/addItem", cart.getCart);
// router.post("/updateItemQuatity", cart.updateItemQuatity);
// router.post("/deleteItem", cart.deleteItem);
// router.post("/checkOut", cart.checkOut);

module.exports = router;
