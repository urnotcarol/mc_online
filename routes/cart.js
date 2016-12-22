var express = require("express");
var cart = require("../controllers/cart.js");
var router = express.Router();

router.get("/", cart.showPage);

module.exports = router;
