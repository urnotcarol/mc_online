$(function() {
  var getCartNums = function() {
    $.ajax({
      type: "GET",
      url: "/cart/getCart",
      data: {
        userId: Cookies.get("id")
      },
      success: function(cartItems) {
        var totalQuatity = 0;
        cartItems.forEach(function(cartItem) {
          totalQuatity += cartItem.item_quatity;
        })
        $(".cartnum-text").html(totalQuatity);
      }
    });
  }
  getCartNums();

  var showEmptyCart = function() {
    $(".empty-cart").show();
    $(".box-head, .box-body, .box-foot").hide();
    getCartNums();
  }

  if(Cookies.get("id") === undefined || Cookies.get("password") === undefined) {
    location.href = "/";
  }

  $(".userid-text").html(Cookies.get("id"));
  $("#logout").on("click", function() {
    Cookies.remove("id");
    Cookies.remove("password");
    location.href = "/";
  })

  $.ajax({
    type: "GET",
    url: "/cart/getCart",
    data: {
      userId: Cookies.get("id")
    },
    success: function(cartItems) {
      if(cartItems.length === 0) {
        showEmptyCart();
      }
      else {
        cartItems.forEach(function(cartItem) {
          $("#sample").children().attr("cartItemId", cartItem.item_id);
          $("#sample").children("label .checkbox").attr("for", "checkbox-item" + cartItem.item_id);
          $("#sample :checkbox").attr("id", "checkbox-item" + cartItem.item_id);
          $("#sample :checkbox").attr("checked", true);
          $(".box-body").append($("#sample").html());
          $("[cartItemId=" + cartItem.item_id + "]").find(".quatity-input").val(cartItem.item_quatity);
          $("[cartItemId=" + cartItem.item_id + "]").find(".quatity-input").attr("max", cartItem.stock);
          $("[cartItemId=" + cartItem.item_id + "]").find(".name-text").html(cartItem.name);
          $("[cartItemId=" + cartItem.item_id + "]").find(".price-text").html("￥" + cartItem.price + ".0/份");
          $("[cartItemId=" + cartItem.item_id + "]").find(".price-text").attr("price", cartItem.price);
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

        var tempCache;
        $(".quatity-input").focus(function() {
          tempCache = $(this).val();
        });
        $(".quatity-input").blur(function() {
          if($(this).val() == "" || Number($(this).val()) < 0) {
            $(this).val(tempCache);
          }
        })

        $(".quatity-input").bind("input propertychange", function() {
          if(!$(this).val() == "" && Number($(this).val()) > 0) {
            var cartItem = $(this).parent().parent();
            var quatity = $(this).val();
            var maxQuatity = $(this).attr("max");
            var minQuatity = $(this).attr("min");

            if(Number($(this).val()) > Number($(this).attr("max"))) {
              $(".overflow-hint").show();
              setTimeout(function(){$(".overflow-hint").fadeOut()}, 2000);
              $(this).val($(this).attr("max"));

              $.ajax({
                type: "POST",
                url: "/cart/updateItemQuatity",
                data: {
                  userId: Cookies.get("id"),
                  itemId: cartItem.attr("cartItemId"),
                  quatity: maxQuatity
                },
                success: function(result) {
                  if(result.status === 3000) {
                    //修改subtotal
                    cartItem.find(".subtotal-text").html("￥" + cartItem.find(".price-text").attr("price") * maxQuatity + ".0");
                    cartItem.find(".subtotal-text").attr("subtotal", cartItem.find(".price-text").attr("price") * maxQuatity);
                    getCartNums();
                    getTotal();
                  }
                }
              })
            } else {
              $.ajax({
                type: "POST",
                url: "/cart/updateItemQuatity",
                data: {
                  userId: Cookies.get("id"),
                  itemId: cartItem.attr("cartItemId"),
                  quatity: $(this).val()
                },
                success: function(result) {
                  if(result.status === 3000) {
                    //修改subtotal
                    cartItem.find(".subtotal-text").html("￥" + cartItem.find(".price-text").attr("price") * quatity + ".0");
                    cartItem.find(".subtotal-text").attr("subtotal", cartItem.find(".price-text").attr("price") * quatity);
                    getCartNums();
                    getTotal();
                  }
                }
              })
            }
          }
        });

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
          var cartItem = $(this).parent().parent();
          console.log(cartItem);
          $.ajax({
            type: "DELETE",
            url: "cart/deleteCartItem",
            data: {
              userId: Cookies.get("id"),
              itemId: cartItem.attr("cartItemId"),
            },
            success: function(result) {
              if(result.status === 3100) {
                cartItem.fadeOut("normal", function() {
                  cartItem.remove();
                  getTotal();
                  getCartNums();
                });
                if($(".box-body").children().length === 1) {
                  showEmptyCart();
                  getCartNums();
                }
              }
            }
          })
        });
      }
    }
  });
})
