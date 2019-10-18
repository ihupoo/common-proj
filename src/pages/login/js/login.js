/**
 * 工具
 * 
 * */
let Login = {
	min_height: 143, //页面最小高度
	//min_widht:960,//页面最小宽度
	init: function () {
		this.regEvent();
		this.initPage();
		this.initAccount();
	},
	setBetwweenWraperAndContentHeight: function () {
		var minHeight;
		if ($(".verifyCode_input_holder").hasClass("hidden")) {
			minHeight = 143;
		} else {
			minHeight = 99;
		}
		$(".betwweenWraperAndContent").css("height", minHeight);
		var ww = $(window).width();
		var wh = $(window).height();
		var wrapH = $("#wrap").outerHeight(true);
		var contentH = $(".enterprise_introduce_content.clearfix").outerHeight(true);
		var hh = wh - wrapH - contentH;
		if (hh > minHeight) {
			$(".betwweenWraperAndContent").css("height", hh);
		} else {
			$(".betwweenWraperAndContent").css("height", minHeight);
		}
	},
	initPage: function () {
		var that = this;
		that.setBetwweenWraperAndContentHeight();
	},
	initVerifyCode: function () {
		var that = this;
		if (!!showVerifyCode && showVerifyCode == '1') {
			$(".verifyCode_input_holder").removeClass("hidden");
			$("#verifyImage").click();
		}
		that.setBetwweenWraperAndContentHeight();
	},
	regEvent: function () {

		var that = this;

		var t;
		$(window).resize(function () {
			clearTimeout(t);
			t = setTimeout(function () {
				that.initPage();
			}, 50);
		});

		if ($("#email").val() != "") {
			var dom = $("#email");
			var pDom = dom.parent(".login_input_wrapper");
			$(".tip_label", pDom).hide();
		}

		$("#email").on("focus", function () {
			var dom = $(this);
			var pDom = dom.parent(".login_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function () {
			var dom = $(this);
			var val = dom.val();
			if (null == val || "" == val) {
				var pDom = dom.parent(".login_input_wrapper");
				$(".tip_label", pDom).show();
			}
		});

		$("#password").on("focus", function () {
			var dom = $(this);
			var pDom = dom.parent(".login_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function () {
			var dom = $(this);
			var val = dom.val();
			if (null == val || "" == val) {
				var pDom = dom.parent(".login_input_wrapper");
				$(".tip_label", pDom).show();
			}
		}).on("keydown", function (e) {
			if (13 == e.keyCode) {
				$("#login-submit").click();
			}
		});
		$("#verifyCode").on("focus", function () {
			var dom = $(this);
			var pDom = dom.parent(".login_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function () {
			var dom = $(this);
			var val = dom.val();
			if (null == val || "" == val) {
				var pDom = dom.parent(".login_input_wrapper");
				$(".tip_label", pDom).show();
			}
		}).on("keydown", function (e) {
			if (13 == e.keyCode) {
				$("#login-submit").click();
			}
		});

		$("#reg-email").on("focus", function () {
			var dom = $(this);
			var pDom = dom.parent(".login_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function () {
			var dom = $(this);
			var val = dom.val();
			if (null == val || "" == val) {
				var pDom = dom.parent(".login_input_wrapper");
				$(".tip_label", pDom).show();
			}
		});

		$(".login_input_wrapper .tip_label").on("click", function () {
			var dom = $(this);
			var inputDom = dom.prev("input");
			inputDom.focus();
		});

		var remember = false;
		//记住密码复选框
		$('input:checkbox').on("click", function () {
			if ($("input[name='keepLogin']").is(':checked')) {
				remember = true;
			} else {
				remember = false;
			}
		}).on("keydown", function (e) {
			if (13 == e.keyCode) {
				$("#login-submit").click();
			}
		});

		$("#login-submit").on("click", function () {

			var url = Utils.getSystemUrl('slogin');
			if (Throttle.isLock(url)) {
				return false;
			}
			Throttle.lock(url);

			var email = $.trim($("#email").val());
			var password = $.trim($("#password").val());
			var isChecked = 0;
			var verifyCode = $.trim($("#verifyCode").val());
			//var remember=false;

			if ($(".verifyCode_input_holder").hasClass("hidden")) {
				isChecked = 0;
			} else {
				isChecked = 1;
			}

			if (null == email || "" == email) {
				$("#login_form .error_msg").text('用户名不能为空!').show();
				Throttle.unLock(url);
				return false;
			}

			if (null == password || "" == password) {
				$("#login_form .error_msg").text('密码不能为空!').show();
				Throttle.unLock(url);
				return false;
			}
			if ((isChecked == 1) && (verifyCode == null || verifyCode == "")) {
				$("#login_form .error_msg").text("请输入验证码!").show();
				Throttle.unLock(url);
				return false;
			}
			$("#login_form .error_msg").text('');

			DigestAuth.username = email;
			var timestamp = new Date().getTime();

			var a = '?source=web&timestamp=' + timestamp;
			if (remember) {
				a += '&_spring_security_remember_me=true';
			}
			var cdata = {};
			///////标记ajax：用户名///////////
			$.post(Utils.getSystemUrl('systemSecurity'), {
				username: email
			}, function (t) {
				if (t.success) {
					systemSecurity = t.data;
					if ('1' != systemSecurity) {
						DigestAuth.password = hex_md5(password);
						DigestAuth.realm = realmName;
						cdata = DigestAuth.makePassword(DigestAuth.password, password);
					} else {
						DigestAuth.password = password;
					}
					cdata['isChecked'] = isChecked;
					cdata['verifyCode'] = verifyCode;
					cdata['remember'] = remember;
					//////标记ajax：digest/////////
					DigestAuth.ajax({
						headers: DigestAuth.makeHeader('POST', url, 'auth', realmName, nonceValue, 'SM3'),
						type: 'POST',
						url: url + a,
						data: cdata,
						dataType: 'json',
						success: function (t) {
							DigestAuth.password = "";
							if (t.success) {
								if (t.data[0]) {
									var homeUrl = Utils.getSystemUrl('home');
									location.href = homeUrl;
								} else {
									alert("跳转至用户所在平台域", function () {
										location.href = t.data[1];
									});
								}
							} else {
								if (!!t && !!t.errorCode && ('100004' == t.errorCode || '100005' == t.errorCode || '100006' == t.errorCode)) {
									location.href = Mo.Config.appUrl + "/modifypassword/force/" + encodeURI(email) + "/" + t.errorCode;
								} else {
									if (!!t && !!t.errorCode) {
										try {
											if ('100003' == t.errorCode || '100007' == t.errorCode) {
												var exp = (!!t.data) ? JSON.parse(t.data) : {};
												var lockTime = exp.lock_time || 5;
												var limit = Math.ceil(lockTime - ((exp.locked_time || 0) / 60));
												if (limit > 0) {
													t.description = '账号被锁定，请在' + limit + '分钟后尝试！';
												} else {
													t.description = '账号被锁定，请稍后尝试！';
												}
											} else if ('100002' == t.errorCode) {
												if (!!t.data && "密码错误" != t.data) {
													var exp = (!!t.data) ? JSON.parse(t.data) : {};
													if (!!exp.account_lock && !!exp.current_error_count && !!exp.error_count && exp.current_error_count > 1) {
														if ((exp.error_count - exp.current_error_count) > 0) {
															t.description = '用户名或密码错误，还可以输入' + (exp.error_count - exp.current_error_count) + '次';
														} else if ((exp.error_count - exp.current_error_count) == 0) {
															t.description = '用户名或密码错误，账号被锁定！';
														}
													}
												}

											}
										} catch (e) { }
									}
									if (!!t && !!t.description) {
										$("#login_form .error_msg").text(t.description).show();
									} else {
										$("#login_form .error_msg").text('用户名或密码错误！').show();
									}
									$(".verifyCode_input_holder").removeClass("hidden");
									that.setBetwweenWraperAndContentHeight();
									$("#verifyImage").click();
								}
							}
							Throttle.unLock(url);
						},
						error: function (e) {
							var t = e.responseJSON;
							if (!!t && !!t.errorCode && ('100004' == t.errorCode || '100005' == t.errorCode || '100006' == t.errorCode)) {
								location.href = Mo.Config.appUrl + "/modifypassword/force/" + encodeURI(email) + "/" + t.errorCode;
							} else {
								if (!!t && !!t.errorCode) {
									try {
										if ('100003' == t.errorCode || '100007' == t.errorCode) {
											var exp = (!!t.data) ? JSON.parse(t.data) : {};
											var lockTime = exp.lock_time || 5;
											var limit = Math.ceil(lockTime - ((exp.locked_time || 0) / 60));
											if (limit > 0) {
												t.description = '账号被锁定，请在' + limit + '分钟后尝试！';
											} else {
												t.description = '账号被锁定，请稍后尝试！';
											}
										} else if ('100002' == t.errorCode) {
											if (!!t.data && "密码错误" != t.data) {
												var exp = (!!t.data) ? JSON.parse(t.data) : {};
												if (!!exp.account_lock && !!exp.current_error_count && !!exp.error_count && exp.current_error_count > 1) {
													if ((exp.error_count - exp.current_error_count) > 0) {
														t.description = '用户名或密码错误，还可以输入' + (exp.error_count - exp.current_error_count) + '次';
													} else if ((exp.error_count - exp.current_error_count) == 0) {
														t.description = '用户名或密码错误，账号被锁定！';
													}
												}
											}

										}
									} catch (e) { }
								}
								if (!!t && !!t.description) {
									$("#login_form .error_msg").text(t.description).show();
								} else {
									$("#login_form .error_msg").text('用户名或密码错误！').show();
								}
								$(".verifyCode_input_holder").removeClass("hidden");
								that.setBetwweenWraperAndContentHeight();
								$("#verifyImage").click();
							}
							Throttle.unLock(url);
						}
					});

				} else {
					$("#login_form .error_msg").text('系统异常,请与管理员联系！').show();
					$(".verifyCode_input_holder").removeClass("hidden");
					that.setBetwweenWraperAndContentHeight();
					$("#verifyImage").click();
					Throttle.unLock(url);
				}
			}, 'json').error(function () {
				$("#login_form .error_msg").text('系统异常,请与管理员联系！').show();
				$(".verifyCode_input_holder").removeClass("hidden");
				that.setBetwweenWraperAndContentHeight();
				$("#verifyImage").click();
				Throttle.unLock(url);
			});
		});

		$("#verifyImage").on("click", function () {
			document.getElementById("verifyImage").src = BP.config.SYSTEM_URL + "/verifyImage?random=" + new Date().getTime();
		});

		$("a.password_forget").on("click", function () {
			$("#login_form").children().hide();
			$("#forgotPassword-wrapper").show();
			Login.setBetwweenWraperAndContentHeight();

		});
		//找回密码->返回按钮
		$("#cancel_email").on("click", function () {
			$("#login_form").children().show();
			$("#forgotPassword-wrapper").hide();
			$("#reg-email").val("");
			$("#forgotPassword-wrapper .error_msg").text("");
			$("#reg-email").siblings().show();
			Login.setBetwweenWraperAndContentHeight();
		});
		$(".W_close").on("click", function () {
			$("#login_form").children().show();
			$("#forgotPassword-wrapper").hide();
			$("#reg-email").val("");
			$("#forgotPassword-wrapper .error_msg").text("");
			$("#reg-email").siblings().show();
		});

		$("#send_email").on("click", function () {
			var url = Utils.getSystemUrl('forgetpassword/sendemail');
			if (Throttle.isLock(url)) {
				return false;
			}
			Throttle.lock(url);
			$("#forgotPassword-wrapper .error_msg").text("");

			var email = $.trim($("#reg-email").val());
			if (email == '' || email == null) {
				$(".error_msg", "#forgotPassword-wrapper").text("请输入您的注册邮箱！").show();
				$("#reg-email").focus();
				Throttle.unLock(url);
				return false;
			}
			if (email && !SSO.verify.email(email)) {
				$(".error_msg", "#forgotPassword-wrapper").text("请输入正确的邮箱").show();
				$("#reg-email").focus();
				Throttle.unLock(url);
				return false;
			}
			///////////标记ajax：邮箱找回密码////////////////
			$.post(url, {
				email: email
			}, function (t) {
				if (t.success) {

				}
				$("#forgotPassword-wrapper .error_msg").text(t.description).show();
				Throttle.unLock(url);
			}, 'json');
		});
	},
	getQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},

	initAccount: function () {
		var account = this.getQueryString("account");
		if (!account) {
			return;
		}
		$("#email").focus().val(unescape(account));
		$("#password").focus();
	}
};

export default Login;
