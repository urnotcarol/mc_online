var db = require("./databaseConnector.js");

exports.displayPage = function(req, res) {
  res.sendfile("views/cart.html");
}

//获取购物车
//修改: 去掉了amount, 自己在前台计算总额; 传回了stock,购物车里修改数量需要,不能超过库存
exports.getCart = function(req, res){
	var userId = req.query.userId;
	var querySQL = "SELECT cart.item_id, cart.item_quatity, item.name, item.price, item.detail, item.stock, item.pic_path FROM cart, item WHERE cart.item_id = item.id AND cart.user_id = ?;";
	db.query(querySQL, [userId], function(err,items){
		if(err){
			throw err;
		}
		else{
			res.send(items);
		}
	});
}


//添加商品进购物车
//修改: 修改了函数名为addCartItem
exports.addCartItem = function(req, res){
	var userId = req.body.userId;
	var itemId = req.body.itemId;
	var quatity = req.body.quatity;
	var queryItemSQL = "SELECT itemId FROM cart WHERE user_id = ?;";
	var updateItemSQL = "UPDATE cart SET item_quatity = (SELECT quatity FROM cart WHERE user_id = ?) + ? WHERE user_id = ?;";
	var addItemSQL = "INSERT INTO cart (user_id, item_id, item_quatity) VALUES (?, ?, ?);";
	db.query(queryItemSQL, [userId], function(err, rows){
		if(err){
			throw err;
		}
		else if(rows.lendth === 1){
			//购物车里已有该商品，修改数量
			db.query(updateItemSQL, [userId, quatity, userId], function(err, rows){
				if(err){
					res.send({status:2001});
					throw err;
				}
				else{
					res.send({status:2000});
				}
			});
		}
		else{
			//购物车里没有该商品
			db.query(addItemSQL, [user_id, itemId, quatity], function(err, rows){
				if(err){
					throw err;
				}
				else{
					res.send({status:2000});
				}
			});
		}
	});
}

//改变购物车商品数量
exports.updateItemQuatity = function(req, res){
	var userId = req.body.userId;
	var itemId = req.body.itemId;
	var quatity = req.body.quatity;
	var updateSQL = "UPDATE cart SET item_quatity = ? WHERE user_id = ? AND item_id = ?;";
	db.query(updateSQL, [quatity, userId, itemId], function(err, rows){
		if(err){
			res.send({status:3001});
			throw err;
		}
		else{
			res.send({status:3000});
		}
	});
}

//购物车删除商品
//修改:函数名改为deleteCartItem
exports.deleteCartItem = function(req,res){
	var userId = req.body.userId;
	var itemId = req.body.itemId;
	var deleteSQL = "DELETE FROM cart WHERE user_id = ? AND item_id = ?;";
	db.query(deleteSQL, [userId, itemId], function(err, rows){
		if(err){
			res.send({status:3101});
			throw err;
		}
		else{
			res.send({status:3100});
		}
	});
}

//结账
exports.checkOut = function(req, res){
	var userId = req.body.userId;
	var queryAmountSQL = "SELECT SUM(price * quatity) as amount FROM cart HAVING user_id = ?;";
	var queryBalanceSQL = "SELECT balance FROM users WHERE id = ?;";
	//var insertOrderSQL = "INSERT INTO orders (user_id, amount) VALUES();";
	db.query(queryAmountSQL , [userId], function(err, rows){
		if(err){
			res.send({status:3201});
			throw err;
		}
		else{
			var amount = rows[0].amount;
			db.query(queryBalanceSQL, [userId], function(err, rows){
				if(err){
					throw err;
				}
				else{
					if(amount < rows[0].balance){
						//可以支付，添加进订单
						insertIntoOrder(userId, amount);
						//res.send({status:3200});
					}
					else{
						//结账失败：余额不足
						res.send({status:3201});
					}
				}
			});
		}
	});
}

var insertIntoOrder = function(userId, amount){
	// var queryItemSQL = "SELECT cart.item_id, cart.item_quatity FROM cart WHERE cart.user_id = ?;";
	var insertOrderSQL = "INSERT INTO orders (user_id, amount) VALUES(?, ?);";
	var insertOrderItemSQL = "INSERT INTO order_item (order_id, item_id, item_quatity) VALUES(?, ?);";
	// db.query(queryItemSQL, [userId], function(err, items){
		// if(err){
			// throw err;
		// }
		// else{
			var items = req.body.items;
			//至此，查询出商品和数量，存在items之中

			db.query("SELECT @@order_id;", function(err, rows){
				if(err){
					throw err;
				}
				else{
					var orderId = rows[0].order_id;
					//下面向order表中插入
					db.query(insertOrderSQL, [userId, amount], function(err, rows){
						if(err){
							throw err;
						}
						else{
							//向order表中插入完成
							//下面向order_item表中插入
							var len = items.length;
							var t = 0;
							for(var i = 0; i < len; i++){
								db.query(insertOrderItemSQL, [orderId, items[i].item_id, items[i].item_quatity], function(err, rows){
									if(err){
										throw err;
									}
									else{
										if(t++ === len - 1){
											updateStockAndSale(items);
										}
									}
								});
							}
						}
					});
				}
			});

		// }
	// });
}

var updateStockAndSale = function(items){
	var updateSQL = "UPDATE item set stock = (SELECT stock FROM item WHERE id = ?) - ? WHERE id = ?; UPDATE item set sales = (SELECT sales FROM item WHERE id = ?) + ? WHERE id = ?";
	var len = items.length;
	var t = 0;
	for(var i = 0; i< len; i++){
		var id = items[i].item_id;
		var quatity = items[i].item_quatity;
		db.query(updateSQL, [id, quatity, id, id, quatity, id], function(err, rows){
			if(err){
				throw err;
			}
			else{
				t++;
				if(t === len - 1){
					res.send({status:3200});
				}
			}
		});
	}
}
