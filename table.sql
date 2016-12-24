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
("脆皮肠", "每份约6个", "/imgs/cuipichang.png", 8, "meat"),
("毛肚", "每份约20g", "/imgs/maodu.png", 8, "meat"),
("午餐肉", "每份6个", "/imgs/wucanrou.png", 8, "meat"),
("蟹肉棒", "每份6个", "/imgs/xieroubang.png", 8, "meat"),
("血旺", "每份6个", "/imgs/xuewang.png", 8, "meat"),
("鸭肠", "每份6个", "/imgs/yachang.png", 8, "meat"),
("鸭舌", "每份6个", "/imgs/yashe.png", 8, "meat"),
("鱿鱼须", "每份6个", "/imgs/youyuxu.png", 8, "meat"),
("鹌鹑蛋", "每份6个", "/imgs/anchundan.png", 6, "vegetable"),
("白萝卜", "每份6个", "/imgs/bailuobo.png", 6, "vegetable"),
("菠菜", "每份6个", "/imgs/bocai.png", 6, "vegetable"),
("大白菜", "每份6个", "/imgs/dabaicai.png", 6, "vegetable"),
("冻豆腐", "每份6个", "/imgs/dongdoufu.png", 6, "vegetable"),
("冬瓜", "每份6个", "/imgs/donggua.png", 6, "vegetable"),
("腐竹", "每份6个", "/imgs/fuzhu.png", 6, "vegetable"),
("海带", "每份6个", "/imgs/haidai.png", 6, "vegetable"),
("红薯", "每份6个", "/imgs/hongshu.png", 6, "vegetable"),
("红薯粉", "每份6个", "/imgs/hongshufen.png", 6, "vegetable"),
("黄喉", "每份6个", "/imgs/huanghou.png", 8, "meat"),
("金针菇", "每份6个", "/imgs/jinzhengu.png", 6, "vegetable"),
("菌类拼盘", "每份6个", "/imgs/junleipinpan.png", 6, "vegetable"),
("木耳", "每份6个", "/imgs/muer.png", 6, "vegetable"),
("藕片", "每份6个", "/imgs/oupian.png", 6, "vegetable"),
("平菇", "每份6个", "/imgs/pinggu.png", 6, "vegetable"),
("青笋", "每份6个", "/imgs/qingsun.png", 6, "vegetable"),
("山药", "每份6个", "/imgs/shanyao.png", 6, "vegetable"),
("笋片", "每份6个", "/imgs/sunpian.png", 6, "vegetable"),
("茼蒿", "每份6个", "/imgs/tonghao.png", 6, "vegetable"),
("土豆", "每份6个", "/imgs/tudou.png", 6, "vegetable"),
("娃娃菜", "每份6个", "/imgs/wawacai.png", 6, "vegetable"),
("香菇", "每份6个", "/imgs/xianggu.png", 6, "vegetable"),
("油豆皮", "每份6个", "/imgs/youdoupi.png", 6, "vegetable"),
("油麦菜", "每份6个", "/imgs/youmaicai.png", 6, "vegetable"),
("鱼豆腐", "每份6个", "/imgs/yudoufu.png", 6, "vegetable"),
("玉米", "每份6个", "/imgs/yumi.png", 6, "vegetable")
;

insert into cart values 
  ("testid0", 1, 2),
  ("testid0", 2, 4),
  ("testid0", 3, 1);
