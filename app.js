var express = require("express");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("bower_components/"));
app.use(express.static("public/"));

// app.use("/", require("./routes/login.js"));
app.use("/", require("./routes/home.js"));
app.use("/cart", require("./routes/cart.js"));
app.use("/user", require("./routes/user.js"));


var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("蜀蜀的冒菜店开业啦: http://%s:%s", host, port);
});
