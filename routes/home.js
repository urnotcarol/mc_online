var express = require("express");
var home = require("../controllers/home.js");
var router = express.Router();

router.get("/", home.showPage);

module.exports = router;
