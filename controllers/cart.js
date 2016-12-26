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
	var queryItemSQL = "SELECT item_id FROM cart WHERE user_id = ? and item_id = ?;";
	var updateItemSQL = "UPDATE cart SET item_quatity =  item_quatity + ? WHERE user_id = ? and item_id = ?;";
	var addItemSQL = "INSERT INTO cart (user_id, item_id, item_quatity) VALUES (?, ?, ?);";

  //这个函数写的不对, 查询语句应该是 select * from cart where user_id = userId and item_id = itemId;
	db.query(queryItemSQL, [userId, itemId], function(err, rows){
		if(err){
			throw err;
		}
		else if(rows.length === 1){
			//购物车里已有该商品，修改数量
			db.query(updateItemSQL, [quatity, userId, itemId], function(err, rows){
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
			db.query(addItemSQL, [userId, itemId, quatity], function(err, rows){
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

var updateStockAndSale = function(items, res){
	var updateSQL = "UPDATE item set stock = stock - ?, sales = sales + ? WHERE id = ?;";
	var len = items.length;
	var t = 0;
	for(var i = 0; i < len; i++){
		var id = items[i].itemId;
		var quatity = items[i].itemQuatity;
		db.query(updateSQL, [quatity, quatity, id], function(err, rows){
			if(err){
				throw err;
			}
			else{
				if(t++ === len - 1){
					res.send({status:3200});
				}
			}
		});
	}
}

var insertIntoOrder = function(userId, amount, items, res) {
	// var queryItemSQL = "SELECT cart.item_id, cart.item_quatity FROM cart WHERE cart.user_id = ?;";
	var insertOrderSQL = "INSERT INTO orders (user_id, amount) VALUES(?, ?);";
	var insertOrderItemSQL = "INSERT INTO order_item (order_id, item_id, item_quatity, item_price) VALUES(?, ?, ?, ?);";
	// db.query(queryItemSQL, [userId], function(err, items){
		// if(err){
			// throw err;
		// }
		// else{
			// var items = req.body.items;
			//至此，查询出商品和数量，存在items之中
      //
			// db.query("SELECT @@order_id;", function(err, rows){
			// 	if(err){
			// 		throw err;
			// 	}
			// 	else{
					//var orderId = rows[0].order_id;
					//下面向order表中插入
					db.query(insertOrderSQL, [userId, amount], function(err, rows){
						if(err){
							throw err;
						}
						else{
							//向order表中插入完成
							//下面向order_item表中插入
              console.log(rows.insertId);
              var orderId = rows.insertId;
							var len = items.length;
							var t = 0;
							for(var i = 0; i < len; i++){
								db.query(insertOrderItemSQL, [orderId, items[i].itemId, items[i].itemQuatity, items[i].itemPrice], function(err, rows){
									if(err){
										throw err;
									}
									else{
										if(t++ === len - 1){
                      console.log("order_item");
											updateStockAndSale(items, res);
										}
									}
								});
							}
						}
					});
			// 	}
			// });

		// }
	// });
}

//结账
exports.checkOut = function(req, res){
  console.log(req.body);
	var userId = req.body.userId;
  var amount = req.body.amount;
  var items = req.body.items;
	// var queryAmountSQL = "SELECT SUM(price * quatity) as amount FROM cart HAVING user_id = ?;";
	var queryBalanceSQL = "SELECT balance FROM users WHERE id = ?;";
	//var insertOrderSQL = "INSERT INTO orders (user_id, amount) VALUES();";
	// db.query(queryAmountSQL , [userId], function(err, rows){
	// 	if(err){
	// 		res.send({status:3201});
	// 		throw err;
	// 	}
	// 	else{
			// var amount = rows[0].amount;
			db.query(queryBalanceSQL, [userId], function(err, rows){
				if(err){
					throw err;
				}
				else{
					if(amount < rows[0].balance){
						//可以支付，添加进订单
            db.query("UPDATE users SET balance = balance - ? WHERE id = ?;", [amount, userId], function(err, rows){
              if(err){
                throw err;
              }
              else{
                insertIntoOrder(userId, amount, items, res);
              }
            });
					}
					else{
						//结账失败：余额不足
						res.send({status:3201});
					}
				}
			});
		// }
	// });
}
