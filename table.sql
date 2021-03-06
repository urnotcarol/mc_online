create database mc_online CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
use mc_online;

CREATE TABLE users(
	id varchar(20) primary key not null,
	password varchar(20) not null,
	balance float not null
);

CREATE TABLE item(
	id int auto_increment primary key not null,
	name varchar(50) not null,
	detail varchar(500),
	pic_path varchar(100),
	price float not null,
	stock int not null default 100,
	classification varchar(10) not null,
	sales int not null default 0
);

CREATE TABLE orders(
	id int auto_increment primary key not null,
	user_id varchar(20),
	create_time timestamp not null default current_timestamp,
	amount float not null,

	foreign key (user_id) references users(id)
);

CREATE TABLE order_item(
	order_id int not null,
	item_id int not null,
	item_quatity int not null,
  item_price float not null,

	primary key (order_id, item_id),
	foreign key (order_id) references orders(id),
	foreign key (item_id) references item(id)
);

CREATE TABLE cart(
	user_id varchar(20) not null,
	item_id int not null,
	item_quatity int not null,

	primary key (user_id, item_id),
	foreign key (user_id) references users(id),
	foreign key (item_id) references item(id)
);

CREATE TABLE deposit_log(
	deposit_time timestamp not null default current_timestamp,
	user_id varchar(20) not null,
	money float not null,

	primary key (deposit_time, user_id),
	foreign key (user_id) references users(id)
);

INSERT INTO item (name, detail, pic_path, price, classification) VALUES
("脆皮肠", "每份约6个", "/imgs/cuipichang.png", 5, "meat"),
("毛肚", "每份约20g", "/imgs/maodu.png", 5, "meat"),
("午餐肉", "每份约20g", "/imgs/wucanrou.png", 5, "meat"),
("蟹肉棒", "每份约20g", "/imgs/xieroubang.png", 5, "meat"),
("血旺", "每份约20g", "/imgs/xuewang.png", 5, "meat"),
("鸭肠", "每份约20g", "/imgs/yachang.png", 5, "meat"),
("鸭舌", "每份约20g", "/imgs/yashe.png", 5, "meat"),
("鱿鱼须", "每份约20g", "/imgs/youyuxu.png", 5, "meat"),
("鹌鹑蛋", "每份6个", "/imgs/anchundan.png", 3, "vegetable"),
("白萝卜", "每份约20g", "/imgs/bailuobo.png", 3, "vegetable"),
("菠菜", "每份约20g", "/imgs/bocai.png", 3, "vegetable"),
("大白菜", "每份约20g", "/imgs/dabaicai.png", 3, "vegetable"),
("冻豆腐", "每份约20g", "/imgs/dongdoufu.png", 3, "vegetable"),
("冬瓜", "每份约20g", "/imgs/donggua.png", 3, "vegetable"),
("腐竹", "每份约20g", "/imgs/fuzhu.png", 3, "vegetable"),
("海带", "每份约20g", "/imgs/haidai.png", 3, "vegetable"),
("红薯", "每份约20g", "/imgs/hongshu.png", 3, "vegetable"),
("红薯粉", "每份约20g", "/imgs/hongshufen.png", 3, "vegetable"),
("黄喉", "每份约20g", "/imgs/huanghou.png", 5, "meat"),
("金针菇", "每份约20g", "/imgs/jinzhengu.png", 3, "vegetable"),
("菌类拼盘", "每份约20g", "/imgs/junleipinpan.png", 3, "vegetable"),
("木耳", "每份约20g", "/imgs/muer.png", 3, "vegetable"),
("藕片", "每份约20g", "/imgs/oupian.png", 3, "vegetable"),
("平菇", "每份约20g", "/imgs/pinggu.png", 3, "vegetable"),
("青笋", "每份约20g", "/imgs/qingsun.png", 3, "vegetable"),
("山药", "每份约20g", "/imgs/shanyao.png", 3, "vegetable"),
("笋片", "每份约20g", "/imgs/sunpian.png", 3, "vegetable"),
("茼蒿", "每份约20g", "/imgs/tonghao.png", 3, "vegetable"),
("土豆", "每份约20g", "/imgs/tudou.png", 3, "vegetable"),
("娃娃菜", "每份约20g", "/imgs/wawacai.png", 3, "vegetable"),
("香菇", "每份约20g", "/imgs/xianggu.png", 3, "vegetable"),
("油豆皮", "每份约20g", "/imgs/youdoupi.png", 3, "vegetable"),
("油麦菜", "每份约20g", "/imgs/youmaicai.png", 3, "vegetable"),
("鱼豆腐", "每份约20g", "/imgs/yudoufu.png", 3, "vegetable"),
("玉米", "每份约20g", "/imgs/yumi.png", 3, "vegetable")
;

insert into cart values
  ("testid0", 1, 2),
  ("testid0", 2, 4),
  ("testid0", 5, 1),
  ("testid0", 3, 1);
