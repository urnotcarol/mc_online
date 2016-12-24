var db = require("./databaseConnector.js");

exports.displayPage = function(req, res) {
  res.sendfile("views/home.html")
}

exports.showItems = function(req, res){
	var showItemSQL = "SELECT id, name, detail, pic_path, price, stock, classification, sales FROM item;";
	db.query(showItemSQL, function(err, rows){
		if(err){
			//查表失败
			throw err;
		}
		else{
			res.send(rows);
		}
	});
}
