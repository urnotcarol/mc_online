var db = require("./databaseConnector.js");

exports.displayUserPage = function(req, res) {
  res.sendfile("views/user.html");
}

exports.displayProfilePage = function(req, res) {
  res.sendfile("views/profile.html");
}

//登录
exports.login = function(req, res) {
	var loginSQL = "SELECT * FROM users WHERE id = ? AND password = ?;";
	var userId = req.body.userId;
	var password = req.body.password;
	db.query(loginSQL, [userId, password], function(err, rows){
		if(err) {
			//登录失败：查表失败
			res.send({status: 1001});
			throw err;
		}
		else {
			if(rows.length === 1) {
				//登录成功
				res.send({status: 1000});
			}
			else {
				//登录失败：用户不存在或密码错误
				res.send({status: 1001});
			}
		}
	});
}

//注册
exports.logup = function(req, res) {
	var logupQuerySQL = "SELECT * FROM users WHERE id = ?;";
	var logupInsertSQL = "INSERT INTO users (id, password, balance)	VALUES (?,?, 0);";
	var userId = req.body.userId;
	var password = req.body.password;
	db.query(logupQuerySQL, [userId, password], function(err, rows) {
		if(err) {
			//注册失败：查表失败
			res.send({status: 1101});
			throw err;
		}
		else {
			if(rows.length === 1){
				//注册失败：用户已存在
				res.send({status: 1102});
			}
			else {
				db.query(logupInsertSQL, [userId, password], function(err, rows){
					if(err) {
						//注册失败：查表失败
						res.send({status: 1101});
						throw err;
					}
					else {
						//注册成功
						res.send({status: 1100});
					}
				});
			}
		}
	});
}

//修改密码
exports.changePassword = function(req, res){
	var userId = req.body.userId;
	var oldPassword = req.body.oldPassword;
	var newPassword = req.body.newPassword;
	var querySQL = "SELECT * FROM users WHERE id = ? AND password = ?;";
	var changeSQL = "UPDATE users set password = ? WHERE id = ?";
	//验证旧密码
	db.query(querySQL, [userId, oldPassword], function(err, rows){
		if(err) {
			//修改密码失败：查表失败
			res.send({status:1202});
			throw err;
		}
		else{
			if(rows.length === 1){
				//旧密码验证成功，开始改密码
				db.query(changeSQL, [newPassword, userId], function(err, rows){
					if(err){
						//修改密码失败：查表失败
						res.send({status:1202});
						throw err;
					}
					else{
						res.send({status:1200});
					}
				});
			}
			else{
				//修改密码失败：旧密码错误
				res.send({status:1201});
			}
		}
	});
}

//查询余额
exports.getBalance = function(req, res){
	var userId = req.body.userId;
	var querySQL = "SELECT balance FROM users WHERE id = ?;";
	db.query(querySQL, [userId], function(err, rows){
		if(err){
			res.send({status: 1401});
			throw err;
		}
		else{
			res.send({
				status:1400,
				balance:rows[0].balance
			});
		}
	});
}

//充值
exports.deposit = function(req, res){
	var userId = req.body.userId;
	var money = req.body.money;
	var depositSQL = "UPDATE users set balance = balance + ? WHERE id = ?;";
  var createLogSQL = "insert into deposit_log (user_id, money) values (?, ?);"
	db.query(depositSQL, [money, userId], function(err, rows){
		if(err){
			res.send({status:1301});
			throw err;
		}
		else{
      db.query(createLogSQL, [userId, money], function(err, rows) {
        if(err) {
          res.send({status: 1301})
          throw err;
        } else {
          res.send({status: 1300});
        }
      })
		}
	});
}

//获取充值记录
exports.getDepositLog = function(req, res){
	var userId = req.body.userId;
	var querySQL = "SELECT deposit_time, money FROM deposit_log WHERE user_id = ?";
	db.query(querySQL, [userId], function(err, rows){
		if(err){
			throw err;
		}
		else{
			res.send(rows);
		}
	});
}
