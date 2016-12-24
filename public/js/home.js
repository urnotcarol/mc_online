$(function() {

  if(Cookies.get("id") !== undefined && Cookies.get("password") !== undefined) {
    $(".user-log").hide();
    $(".user-about").show();
    $(".userid-text").html(Cookies.get("id"));

    $.ajax({
      type: "GET",
      url: "/cart/getCart",
      data: {
        userId: Cookies.get("id")
      },
      success: function(cartItems) {
        $(".cartnum-text").html(cartItems.length);
      }
    });
  }

  $("#logout").on("click", function() {
    Cookies.remove("id");
    Cookies.remove("password");
    location.reload();
  })

  // 得到所有菜品
  $.ajax({
    type: "GET",
    url: "/showItems",
    success: function(items) {
      items.forEach(function(item) {
        $("#sample").children().attr("itemId", item.id);
        item.classification === "vegetable" ? $("#items-vegetable").append($("#sample").html()) : $("#items-meat").append($("#sample").html());
        $("[itemId=" + item.id + "]").find(".price-text").html("￥" + item.price + ".0/份");
        $("[itemId=" + item.id + "]").find(".name-text").html(item.name);
        $("[itemId=" + item.id + "]").find(".detail-text").html(item.detail);
        $("[itemId=" + item.id + "]").find(".stock-text").html(item.stock);
        $("[itemId=" + item.id + "]").find(".sales-text").html(item.sales);
        $("[itemId=" + item.id + "]").find("img").attr("src", item.pic_path);
        $("[itemId=" + item.id + "]").find(".quatity-input").attr("max", item.stock);
      });
      $(".quatity-input").blur(function() {
        if(Number($(this).val()) > Number($(this).attr("max"))) {
          $(this).val($(this).attr("max"));
        }
      });

      $(".add-to-cart").on("click", function() {
        if(!Cookies.get("id")) {
          location.href = "/user?#login";
        }

        $.ajax({
          type: "POST",
          url: "/cart/addCartItem",
          data: {
            userId: Cookies.get("id")
          }
        })


      });

    }
  });
});
