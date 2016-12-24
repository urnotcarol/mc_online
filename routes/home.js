var express = require("express");
var home = require("../controllers/home.js");
var cart = require("../controllers/cart.js");
var router = express.Router();

router.get("/", home.displayPage);
router.get("/showItems", home.showItems)
// router.post("/addItem", cart.addItem);

module.exports = router;
