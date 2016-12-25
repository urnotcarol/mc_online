$(function() {
  if(Cookies.get("id") === undefined || Cookies.get("password") === undefined) {
    location.href = "/";
  }
  $(".userid-text").html(Cookies.get("id"));

  $("#logout").on("click", function() {
    Cookies.remove("id");
    Cookies.remove("password");
    location.reload();
  })

  var showChangePwDiv = function() {
    $("#text-changePw").show();
    $("#text-deposit").hide();
    $("#text-orders").hide();
    $("#div-changePw").show();
    $("#div-deposit").hide();
    $("#div-orders").hide();
  }

  var showDepositDiv = function() {
    $("#text-deposit").show();
    $("#text-changePw").hide();
    $("#text-orders").hide();
    $("#div-deposit").show();
    $("#div-changePw").hide();
    $("#div-orders").hide();
  }

  var showOrdersDiv = function() {
    $("#text-orders").show();
    $("#text-deposit").hide();
    $("#text-changePw").hide();
    $("#div-orders").show();
    $("#div-deposit").hide();
    $("#div-changePw").hide();
  }

  if(location.hash === "#changePassword") {
    showChangePwDiv();
  } else if(location.hash === "#deposit") {
    showDepositDiv();
  } else if(location.hash === "#orders") {
    showOrdersDiv();
  }

  $("#nav-changePw").on("click", function() {
    showChangePwDiv();
  });
  $("#nav-deposit").on("click", function() {
    showDepositDiv();
  });
  $("#nav-orders").on("click", function() {
    showOrdersDiv();
  });

  var primaryColor = "#1ABC9C";  //green
  var warningColor = "#f1c40f";  //yellow

  var oldPwHint = "请输入您的旧密码";
  var wrongOldPw = "旧密码输入错误，请重新输入";
  var newPwHint = "请输入请输入6-20位新密码";
  var confirmPwHint = "请再输一遍您的新密码";
  var invalidPassword = "密码输入有误，请重新输入";
  var differentPw = "两次输入密码不一致，请确认您的密码";
  var depositHint = "请输入0到1000的数字";
  var invalidDeposit = "您输入的金额有误，请输入0到1000的数字";

  var validOldPw = false;
  var validNewPw = false;
  var validConfirm = false;

  var hintInvalidInput = function(that, info) {
    that.parent().next().html(info);
    that.parent().next().css("color", warningColor);
    that.parent().addClass("has-warning");
  }

  $("#oldPw").focus(function() {
    $(this).parent().next().html(oldPwHint);
    $(this).parent().next().css("color", primaryColor);
  });

  $("#oldPw").blur(function() {
    var oldPw = $(this).val();
    if(oldPw.length < 6 || oldPw.length > 20) {
      hintInvalidInput($(this), wrongOldPw);
    } else {
      $(this).parent().next().empty();
      $(this).parent().removeClass("has-warning");
      // $(this).parent().next().html('<i class="fa fa-lg fa-check-circle"></i>');
      validOldPw = true;
    }
  });

  $("#newPw").focus(function() {
    $(this).parent().next().html(newPwHint);
    $(this).parent().next().css("color", primaryColor);
  })

  $("#newPw").blur(function() {
    var newPw = $(this).val();
    if(newPw.length < 6 || newPw.length > 20) {
      hintInvalidInput($(this), invalidPassword);
    } else {
      $(this).parent().removeClass("has-warning");
      $(this).parent().next().html('<i class="fa fa-lg fa-check-circle"></i>');
      validNewPw = true;
    }
  });

  $("#confirm-newPw").focus(function() {
    $(this).parent().next().html(confirmPwHint);
    $(this).parent().next().css("color", primaryColor);
  });

  $("#confirm-newPw").blur(function() {
    if($("#newPw").val() !== $(this).val()) {
      hintInvalidInput($(this), differentPw);
    } else {
      $(this).parent().removeClass("has-warning");
      $(this).parent().next().html('<i class="fa fa-lg fa-check-circle"></i>');
      validConfirm = true;
    }
  });

  $("#submit-changePw").on("click", function() {
    if(validOldPw && validNewPw && validConfirm) {
      $.ajax({
        type: "POST",
        url: "/profile/changePassword",
        data: {
          userId: Cookies.get("id"),
          oldPassword: $("#oldPw").val(),
          newPassword: $("#newPw").val()
        },
        success: function(result) {
          if(result.status === 1201) {
            $("#oldPw").focus();
            hintInvalidInput($("#oldPw"), wrongOldPw);
          } else if (result.status === 1200) {
            Cookies.set("password", $("#newPw").val());
            alert("修改密码成功 (=￣ω￣=)");
            location.reload();
          }
        }
      })
    }
  });

  $.ajax({
    type: "POST",
    url: "/profile/getBalance",
    data: {
      userId: Cookies.get("id")
    },
    success: function(result) {
      if(result.status === 1400) {
        if(Number(result.balance) > 0) {
          $(".balance-text").html("￥" + result.balance.toFixed(1));
        } else {
          $(".balance-text").html(result.balance);
        }
      }
    }
  });

  $("#input-deposit").focus(function() {
    $(this).parent().next().html(depositHint);
    $(this).parent().next().css("color", primaryColor);
  });

  $("#input-deposit").bind("input propertychange", function() {
    if(Number($("#input-deposit").val()) <= 0 || Number($("#input-deposit").val()) > 1000) {
      hintInvalidInput($("#input-deposit"), invalidDeposit);
    }
  });

  $("#input-deposit").blur(function() {
    if(Number($("#input-deposit").val()) > 0 && Number($("#input-deposit").val()) <= 1000) {
      $(this).parent().removeClass("has-warning");
      $(this).parent().next().html('<i class="fa fa-lg fa-check-circle"></i>');
    }
  });

  $("#submit-deposit").on("click", function() {
    if(Number($("#input-deposit").val()) <= 0 || Number($("#input-deposit").val()) > 1000) {
      hintInvalidInput($("#input-deposit"), invalidDeposit);
      $("#input-deposit").focus();
    } else {
      $.ajax({
        type: "POST",
        url: "/profile/deposit",
        data: {
          userId: Cookies.get("id"),
          money: $("#input-deposit").val()
        },
        success: function(result) {
          if(result.status === 1300) {
            alert("充值成功!(ΦωΦ)");
            location.reload();
          }
        }
      })
    }
  })







})
