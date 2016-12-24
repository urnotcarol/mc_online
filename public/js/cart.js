$(function() {
  //
  // var testItemNames = ["鹌鹑蛋", "白萝卜", "菠菜", "大白菜", "冻豆腐", "冬瓜", "腐竹", "海带"];
  // var testItemPaths = ["anchundan", "bailuobo", "bocai", "dabaicai", "dongdoufu", "donggua", "fuzhu", "haidai"];
  //
  // var testItems = testItemNames.map(function(elem, i) {
  //   return {
  //     "id": i,
  //     "name": elem,
  //     "path": "/imgs/" + testItemPaths[i] + ".png",
  //     "price": Math.floor(Math.random()*10) + 1,
  //     "sales": Math.floor(Math.random()*100) + 1,
  //     "stock": Math.floor(Math.random()*200) + 1,
  //     "classification": "vegetable"
  //   }
  // });
  //
  //
  // var showEmptyCart = function() {
  //   $(".empty-cart").show();
  //   $(".box-head, .box-body, .box-foot").hide();
  // }
  //
  // var testCart = [
  //   {"userId": "testUser", "itemId": 1, "itemQuatity": 2},
  //   {"userId": "testUser", "itemId": 4, "itemQuatity": 3},
  //   {"userId": "testUser", "itemId": 3, "itemQuatity": 3},
  //   {"userId": "testUser", "itemId": 7, "itemQuatity": 3},
  //   {"userId": "testUser", "itemId": 5, "itemQuatity": 3},
  //   {"userId": "testUser", "itemId": 2, "itemQuatity": 1}];
  // // var testCart = [];
  //
  // if(testCart.length === 0) {
  //   showEmptyCart();
  // }
  // //
  // testCart.forEach(function(cartItem) {
  //   $("#sample").children().attr("cartItemId", cartItem.itemId);
  //   $("#sample").children("label .checkbox").attr("for", "checkbox-item" + cartItem.itemId);
  //   $("#sample :checkbox").attr("id", "checkbox-item" + cartItem.itemId);
  //   $("#sample :checkbox").attr("checked", true);
  //   $(".box-body").append($("#sample").html());
  //   $("[cartItemId=" + cartItem.itemId + "]").find(".quatity-text").html(cartItem.itemQuatity);
  //   $("[cartItemId=" + cartItem.itemId + "]").find(".name-text").html(cartItem.name);
  //   $("[cartItemId=" + cartItem.itemId + "]").find(".price-text").html("￥" + cartItem.price + ".0/份");
  //   $("[cartItemId=" + cartItem.itemId + "]").find(".subtotal-text").html("￥" + cartItem.price*cartItem.itemQuatity + ".0");
  //   $("[cartItemId=" + cartItem.itemId + "]").find(".subtotal-text").attr("subtotal", cartItem.price*cartItem.itemQuatity);
  //   $("[cartItemId=" + cartItem.itemId + "]").find("img").attr("src", cartItem.pic_path);
  //   });

  // console.log("CookieId: ", Cookies.get("id"));
  $.ajax({
    type: "GET",
    url: "/cart/getCart",
    data: {
      userId: Cookies.get("id")
    },
    success: function(cartItems) {
      cartItems.forEach(function(cartItem) {
        $("#sample").children().attr("cartItemId", cartItem.item_id);
        $("#sample").children("label .checkbox").attr("for", "checkbox-item" + cartItem.item_id);
        $("#sample :checkbox").attr("id", "checkbox-item" + cartItem.item_id);
        $("#sample :checkbox").attr("checked", true);
        $(".box-body").append($("#sample").html());
        $("[cartItemId=" + cartItem.item_id + "]").find(".quatity-text").html(cartItem.item_quatity);
        $("[cartItemId=" + cartItem.item_id + "]").find(".name-text").html(cartItem.name);
        $("[cartItemId=" + cartItem.item_id + "]").find(".price-text").html("￥" + cartItem.price + ".0/份");
        $("[cartItemId=" + cartItem.item_id + "]").find(".subtotal-text").html("￥" + cartItem.price*cartItem.item_quatity + ".0");
        $("[cartItemId=" + cartItem.item_id + "]").find(".subtotal-text").attr("subtotal", cartItem.price*cartItem.item_quatity);
        $("[cartItemId=" + cartItem.item_id + "]").find("img").attr("src", cartItem.pic_path);
      });

      var getTotal = function() {
        var total = 0;
        $(".box-body :checkbox").each(function() {
          if($(this).prop("checked")) {
            total += Number($(this).parent().parent().siblings().find(".subtotal-text").attr("subtotal"));
          }
        })
        $(".total-text").html("￥" + total + ".0");
      }

      $(':checkbox').radiocheck();

      getTotal();

      $("#sample").children("label .checkbox").attr("for", "checkbox-sample");
      $("#sample :checkbox").attr("id", "checkbox-sample");

      $("#checkbox-all").on("click", function() {
        if($(this).is(":checked")) {
          $(".box-body :checkbox").radiocheck('check');
        } else {
          $(".box-body :checkbox").radiocheck('uncheck');
        }
        getTotal();
      });

      $(".box-body :checkbox").on("click", function() {
        getTotal();

        if(!$(this).is(":checked")) {
          $("#checkbox-all").radiocheck('uncheck');
        }
        else if($(".box-body :checkbox").is(":checked")) {
          $("#checkbox-all").radiocheck('check');
        }
      })

      $(".del-btn").on("click", function() {
        // $.ajax({})success后:
        $(this).parent().parent().fadeOut("normal", function() {
          $(this).remove();
          getTotal();
        });

        if($(".box-body").children().length === 1) {
          showEmptyCart();
        }
      });
    }
  });
})
