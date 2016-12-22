$(function() {

  //得到所有菜品
  // $.ajax({
  //   type: "GET",
  //   url: "/getItems",
  //   success: function(items) {
  //
  //   }
  // })

  var userid = "testId";
  var cartItemNums = 0;
  $("#cart-nums").html(cartItemNums);
  $("#cart-nums").show();

  var testItemNames = ["鹌鹑蛋", "白萝卜", "菠菜", "大白菜", "冻豆腐", "冬瓜", "腐竹", "海带"];
  var testItemPaths = ["anchundan", "bailuobo", "bocai", "dabaicai", "dongdoufu", "donggua", "fuzhu", "haidai"];

  var testItems = testItemNames.map(function(elem, i) {
    return {
      "id": i,
      "name": elem,
      "path": "/imgs/" + testItemPaths[i] + ".png",
      "price": Math.floor(Math.random()*10) + 1,
      "sales": Math.floor(Math.random()*100) + 1,
      "stock": Math.floor(Math.random()*200) + 1,
      "classification": "vegetable"
    }
  });

  testItems.forEach(function(item) {
    $("#sample").children().attr("itemId", item.id);
    item.classification === "vegetable" ? $("#items-vegetable").append($("#sample").html()) : $("#items-meat").append($("#sample").html());
    $("#items-vege").append($("#sample").html());
    $("[itemId=" + item.id + "]").find(".price-text").html("￥" + item.price + "/份");
    $("[itemId=" + item.id + "]").find(".name-text").html(item.name);
    $("[itemId=" + item.id + "]").find(".stock-text").html(item.stock);
    $("[itemId=" + item.id + "]").find(".sales-text").html(item.sales);
    $("[itemId=" + item.id + "]").find("img").attr("src", item.path);
    $("[itemId=" + item.id + "]").find(".quatity-input").attr("max", item.stock);
  })

  $(".quatity-input").blur(function() {
    if($(this).val() > $(this).attr("max")) {
      $(this).val($(this).attr("max"));
    }
  })
});
