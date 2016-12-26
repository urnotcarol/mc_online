var express = require("express");
var cart = require("../controllers/cart.js");
var router = express.Router();

router.get("/", cart.displayPage);
router.get("/getCart", cart.getCart);
router.post("/addCartItem", cart.addCartItem);
router.post("/updateItemQuatity", cart.updateItemQuatity);
router.delete("/deleteCartItem", cart.deleteCartItem);
router.post("/checkOut", cart.checkOut);

module.exports = router;
