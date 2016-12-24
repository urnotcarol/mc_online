$(function() {
  if(Cookies.get("id") !== undefined && Cookies.get("password") !== undefined) {
    location.href = "/";
  }

  var showLoginDiv = function() {
    $("#nav-login").attr("class", "active");
    $("#nav-logup").attr("class", "");
    $("#div-login").show();
    $("#div-logup").hide();
  }

  var showLogupDiv = function() {
    $("#div-login").hide();
    $("#div-logup").show();
    $("#nav-login").attr("class", "");
    $("#nav-logup").attr("class", "active");
  }

  if(location.hash === "#login") {
    showLoginDiv();
  } else if(location.hash === "#logup") {
    showLogupDiv();
  }

  $("#nav-login").on("click", function() {
    showLoginDiv();
  });
  $("#nav-logup").on("click", function() {
    showLogupDiv();
  });

  var primaryColor = "#1ABC9C";  //green
  var warningColor = "#f1c40f";  //yellow

  var idHint = "请输入6-20位由字母或数字组成的ID";
  var invalidId = "ID输入有误，请重新输入";
  var passwordHint = "请输入6-20位密码";
  var invalidPassword = "密码输入有误，请重新输入";

  var validLoginId = false;
  var validLoginPassword = false;
  var validLogupId = false;
  var validLogupPassword = false;
  var validConfirm = false;


  $("#login-id, #logup-id").focus(function() {
    $(this).parent().next().html(idHint);
    $(this).parent().next().css("color", primaryColor);
  });

  var hintInvalidId = function(that, info) {
    that.parent().next().html(info);
    that.parent().next().css("color", warningColor);
    that.parent().addClass("has-warning");
  }

  var hintInvalidPassword = function(that) {
    that.parent().next().html(invalidPassword);
    that.parent().next().css("color", warningColor);
    that.parent().addClass("has-warning");
  }

  var hintConfirm = function(that) {
    that.parent().next().html("两次输入密码不一致，请确认您的密码");
    that.parent().next().css("color", warningColor);
    that.parent().addClass("has-warning");
  }

  $("#login-id, #logup-id").blur(function() {
    var id = $(this).val();
    if(id.length < 6 || id.length > 20 || id.replace(/\w/g, "").length > 0) {
      hintInvalidId($(this), invalidId);
    } else {
      $(this).parent().next().empty();
      $(this).parent().removeClass("has-warning");
      $(this).attr("id") === "login-id" ? validLoginId = true : validLogupId = true;
    }
  });

  $("#login-password, #logup-password").focus(function() {
    $(this).parent().next().html(passwordHint);
    $(this).parent().next().css("color", primaryColor);
  })

  $("#login-password, #logup-password").blur(function() {
    var password = $(this).val();
    if(password.length < 6 || password.length > 20) {
      hintInvalidPassword($(this));
    } else {
      $(this).parent().next().empty();
      $(this).parent().removeClass("has-warning");
      $(this).attr("id") === "login-password" ? validLoginPassword = true : validLogupPassword = true;
    }
  });

  $("#logup-confirm-password").focus(function() {
    $(this).parent().next().html("请再输一遍您的密码");
    $(this).parent().next().css("color", primaryColor);
  });

  $("#logup-confirm-password").blur(function() {
  if($("#logup-password").val() !== $(this).val()) {
    hintConfirm($(this));
  } else {
    $(this).parent().next().empty();
    $(this).parent().removeClass("has-warning");
    validConfirm = true;
    }
  });

  $("#submit-login").on("click", function() {
    if(validLoginId && validLoginPassword) {
      $.ajax({
        type: "POST",
        url: "user/login",
        data: {
          userId: $("#login-id").val(),
          password: $("#login-password").val()
        },
        success: function(result) {
          if (result.status === 1000) {
            Cookies.set("id", $("#login-id").val(), {expires: 1, path: "/"});
            Cookies.set("password", $("#login-password").val() , {expires: 1, path: "/"});
            location.href = "/";
          } else if (result.status === 1001) {
            $("#login-password").focus();
            hintInvalidPassword($("#login-password"));
          }
        }
      });
    } else if(!validLoginId) {
      $("#login-id").focus();
      hintInvalidId($("#login-id"), invalidId);
    } else if(!validLoginPassword) {
      $("#login-password").focus();
      hintInvalidPassword($("#login-password"));
    } else{
      console.log("unknown");
    }
  });

  $("#submit-logup").on("click", function() {
    if(validLogupId && validLogupPassword && validConfirm) {
      $.ajax({
        type: "POST",
        url: "user/logup",
        data: {
          userId: $("#logup-id").val(),
          password: $("#logup-password").val()
        },
        success: function(result) {
          console.log(result);
          if (result.status === 1100) {
            Cookies.set("id", $("#logup-id").val(), {expires: 1, path: "/"});
            Cookies.set("password", $("#logup-password").val(), {expires: 1, path: "/"});
            location.href = "/";
          } else if(result.status === 1102) {
            $("#logup-id").focus();
            hintInvalidId($("#logup-id"), "该ID已被注册，重新想一个吧^ ^");
          }
        }
      })
    } else if(!validLogupId) {
      $("#logup-id").focus();
      hintInvalidId($("#logup-id"), invalidId);
    } else if(!validLogupPassword) {
      $("#logup-password").focus();
      hintInvalidPassword($("#logup-password"));
    } else if(!validConfirm) {
      $("#logup-confirm-password").focus();
      hintConfirm($("#logup-confirm-password"));
    }
  })


})
