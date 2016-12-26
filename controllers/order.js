var db = connection = require("./databaseConnector.js");

exports.getOrders = function(req, res){
	var userId = req.body.userId;
	var queryOrderSQL = "SELECT id, create_time, amount FROM orders WHERE user_id = ? order by create_time desc;";
	var queryOrderItemSQL = "SELECT item.name, item.detail, item.pic_path, order_item.item_price, order_item.item_quatity, order_item.item_id FROM item, order_item, orders WHERE order_item.order_id = orders.id AND order_item.item_id = item.id AND orders.id = ?;";
	db.query(queryOrderSQL, [userId], function(err, orders){
		if(err){
			throw err;
		}
		else{
			var len = orders.length;
			var t = 0;
      if(len > 0) {
        for(var i = 0; i < len; i++){
          db.query(queryOrderItemSQL, [orders[i].id], function(err, rows){
            if(err){
              throw err;
            }
            else{
              //喵喵喵？
              orders[t].items = [];
              var itemLength = rows.length;
              for(var j = 0; j < itemLength; j++){
                orders[t].items[j] = {};
                orders[t].items[j].itemId = rows[j].item_id;
                orders[t].items[j].itemPrice = rows[j].item_price;
                orders[t].items[j].itemName = rows[j].name;
                orders[t].items[j].picPath = rows[j].pic_path;
                orders[t].items[j].quatity = rows[j].item_quatity;
              }
              if(t++ === len - 1){
                res.send(orders);
              }
            }
          });
        }
      } else {
        //没有订单
        res.send({status: 4100})
      }

		}
	});
}
