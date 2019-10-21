import Store from '@/store';
import { MoAlert } from '@/components/popup';
import { Throttle, Validation } from '@/utils/utils';
import { DigestAuth } from '@/utils/digestAuth';

const BASE_URL = Store.getState('BASE_URL');

function getQueryString(name){
	let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
    let r = location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

const Login = {
    remember: false,
	init: function () {
		this.regEvent();
        this.initAccount();
	},
	initAccount: function () {
		let account = getQueryString("account");
		if (!account) {
			return;
		}
		$("#email").focus().val(unescape(account));
		$("#password").focus();
    },
    _hideLabel(dom){
        $(dom).siblings('.tip_label').hide();
    },
    _showLabel(dom){
        let val = $(dom).val()
        if (!val) {
            $(dom).siblings('.tip_label').show();
        }
    },
	regEvent: function () {
        let that = this;
        
		if ($("#email").val() != "") {
            this._hideLabel("#email")
		}

        $("#email")
            .on("focus", function () {
                that._hideLabel(this)
            })
            .on("blur", function () {
                that._showLabel(this)
            });

        $("#password")
            .on("focus", function () {
                that._hideLabel(this)
                $(this).removeAttr("readonly");
            })
            .on("blur", function () {
                that._showLabel(this)
            })
            .on("keyup", function () {
                // 密码框抬起时，密码框内容为空则隐藏眼睛
                if ($(this).val()) {
                    $('.login_input_wrapper .pwdEye').show()
                } else {
                    $('.login_input_wrapper .pwdEye').hide()
                }
            })
            .on("keydown", function (e) {
                if (13 == e.keyCode) {
                    $("#login-submit").click();
                }
            });
        $("#verifyCode")
            .on("focus", function () {
                that._hideLabel(this)
            })
            .on("blur", function () {
                that._showLabel(this)
            })
            .on("keydown", function (e) {
                if (13 == e.keyCode) {
                    $("#login-submit").click();
                }
            });

        $("#reg-email")
            .on("focus", function () {
                that._hideLabel(this)
            })
            .on("blur", function () {
                that._showLabel(this)
            });

		$(".login_input_wrapper .tip_label").on("click", function () {
			$(this).prev("input").focus();
        });
        
        // 点击眼睛，切换眼睛图标的高亮状态 并 切换明文密码
        $(".login_input_wrapper .pwdEye").on("click", function () {
            $(this).toggleClass('active')
            if ($(this).hasClass('active')) {
                $(".login_input_wrapper #password").prop("type", 'text')
            } else {
                $(".login_input_wrapper #password").prop("type", 'password')
            }
        });

		//记住密码复选框
        this.remember = false
        $('input:checkbox')
            .on("click", function () {
                that.remember = $("input[name='keepLogin']").is(':checked')
            })
            .on("keydown", function (e) {
                if (13 == e.keyCode) {
                    $("#login-submit").click();
                }
            });

		$("#login-submit").on("click", function () {

			let url = `${BASE_URL}/slogin`;
			if (Throttle.isLock(url)) {
				return false;
			}

			let email = $.trim($("#email").val());
			let password = $.trim($("#password").val());
			let isChecked = $(".verifyCode_input_holder").hasClass("hidden")  ? 0 : 1;
			let verifyCode = $.trim($("#verifyCode").val());

			if (null == email || "" == email) {
				$("#login_form .error_msg").text('用户名不能为空!').show();
				return false;
			}

			if (null == password || "" == password) {
				$("#login_form .error_msg").text('密码不能为空!').show();
				return false;
			}
			if ((isChecked == 1) && (verifyCode == null || verifyCode == "")) {
				$("#login_form .error_msg").text("请输入验证码!").show();
				return false;
            }
            
			$("#login_form .error_msg").text('');


			DigestAuth.setValue('username',email);

			let suffix = `?source=web&timestamp=${new Date().getTime()}${that.remember ? '&_spring_security_remember_me=true': '' }`;
            let cdata = {};
            
			Throttle.lock(url);
			$.post(`${BASE_URL}/systemSecurity`, {
				username: email
			}, function (t) {
				if (t.success) {
                    let systemSecurity = t.data;
                    Store.dispatch({
                        type:'save',
                        payload:{
                            user:{
                                ...Store.getState('user'),
                                systemSecurity
                            }
                        }
                    })
					if (systemSecurity != '1') {
                        DigestAuth.setValue('password', hex_md5(password));
                        DigestAuth.setValue('realm', realmName);

						cdata = DigestAuth.makePassword(DigestAuth.password, password);
					} else {
                        DigestAuth.setValue('password', password);
					}
					cdata['isChecked'] = isChecked;
					cdata['verifyCode'] = verifyCode;
					cdata['remember'] = that.remember;
					//////标记ajax：digest/////////
					DigestAuth.ajax({
						headers: DigestAuth.makeHeader('POST', url, 'auth', realmName, DigestAuth.nonce, 'SM3'),
						type: 'POST',
						url: url + suffix,
						data: cdata,
						dataType: 'json',
						success: function (t) {
                            DigestAuth.setValue('password', '');
							if (t.success) {
								if (t.data[0]) {
									location.href = `${BASE_URL}/home`;
								} else {
									MoAlert("跳转至用户所在平台域", function () {
										location.href = t.data[1];
									});
								}
							} else {
								if (t && t.errorCode && ('100004' == t.errorCode || '100005' == t.errorCode || '100006' == t.errorCode)) {
									location.href = BASE_URL + "/modifypassword/force/" + encodeURI(email) + "/" + t.errorCode;
								} else {
									if (t && t.errorCode) {
										try {
											if ('100003' == t.errorCode || '100007' == t.errorCode) {
												let exp = (!!t.data) ? JSON.parse(t.data) : {};
												let lockTime = exp.lock_time || 5;
												let limit = Math.ceil(lockTime - ((exp.locked_time || 0) / 60));
												if (limit > 0) {
													t.description = `账号被锁定，请在${limit}分钟后尝试！`;
												} else {
													t.description = '账号被锁定，请稍后尝试！';
												}
											} else if ('100002' == t.errorCode) {
												if (t.data && "密码错误" != t.data) {
													let exp = t.data ? JSON.parse(t.data) : {};
													if (exp.account_lock && exp.current_error_count && exp.error_count && exp.current_error_count > 1) {
														if ((exp.error_count - exp.current_error_count) > 0) {
															t.description = `用户名或密码错误，还可以输入${exp.error_count - exp.current_error_count}次`;
														} else if ((exp.error_count - exp.current_error_count) == 0) {
															t.description = '用户名或密码错误，账号被锁定！';
														}
													}
												}

											}
										} catch (e) { }
									}
									if (t && t.description) {
										$("#login_form .error_msg").text(t.description).show();
									} else {
										$("#login_form .error_msg").text('用户名或密码错误！').show();
									}
									$(".verifyCode_input_holder").removeClass("hidden");
									$("#verifyImage").click();
								}
							}
							Throttle.unLock(url);
						},
						error: function (e) {
							let t = e.responseJSON;
							if (t && t.errorCode && ('100004' == t.errorCode || '100005' == t.errorCode || '100006' == t.errorCode)) {
								location.href = BASE_URL + "/modifypassword/force/" + encodeURI(email) + "/" + t.errorCode;
							} else {
								if (t && t.errorCode) {
									try {
										if ('100003' == t.errorCode || '100007' == t.errorCode) {
											let exp = t.data ? JSON.parse(t.data) : {};
											let lockTime = exp.lock_time || 5;
											let limit = Math.ceil(lockTime - ((exp.locked_time || 0) / 60));
											if (limit > 0) {
												t.description = `账号被锁定，请在${limit}分钟后尝试！`;
											} else {
												t.description = '账号被锁定，请稍后尝试！';
											}
										} else if ('100002' == t.errorCode) {
											if (t.data && "密码错误" != t.data) {
												let exp = (!!t.data) ? JSON.parse(t.data) : {};
												if (!!exp.account_lock && !!exp.current_error_count && !!exp.error_count && exp.current_error_count > 1) {
													if ((exp.error_count - exp.current_error_count) > 0) {
														t.description = `用户名或密码错误，还可以输入${exp.error_count - exp.current_error_count}次`;
													} else if ((exp.error_count - exp.current_error_count) == 0) {
														t.description = '用户名或密码错误，账号被锁定！';
													}
												}
											}

										}
									} catch (e) { }
								}
								if (t && t.description) {
									$("#login_form .error_msg").text(t.description).show();
								} else {
									$("#login_form .error_msg").text('用户名或密码错误！').show();
								}
								$(".verifyCode_input_holder").removeClass("hidden");
								$("#verifyImage").click();
							}
							Throttle.unLock(url);
						}
					});

				} else {
					$("#login_form .error_msg").text('系统异常,请与管理员联系！').show();
					$(".verifyCode_input_holder").removeClass("hidden");
					$("#verifyImage").click();
					Throttle.unLock(url);
				}
			}, 'json').error(function () {
				$("#login_form .error_msg").text('系统异常,请与管理员联系！').show();
				$(".verifyCode_input_holder").removeClass("hidden");
				$("#verifyImage").click();
				Throttle.unLock(url);
			});
		});

		$("#verifyImage").on("click", function () {
            $('#verifyImage').attr('src',`${BASE_URL}/verifyImage?random=${new Date().getTime()}`)
		});

		$("a.password_forget").on("click", function () {
			$("#login_form").children().hide();
			$("#forgotPassword-wrapper").show();

		});
		//找回密码->返回按钮
		$("#cancel_email").on("click", function () {
			$("#login_form").children().show();
			$("#forgotPassword-wrapper").hide();
			$("#reg-email").val("");
			$("#forgotPassword-wrapper .error_msg").text("");
			$("#reg-email").siblings().show();
		});
		$(".W_close").on("click", function () {
			$("#login_form").children().show();
			$("#forgotPassword-wrapper").hide();
			$("#reg-email").val("");
			$("#forgotPassword-wrapper .error_msg").text("");
			$("#reg-email").siblings().show();
		});

		$("#send_email").on("click", function () {
			let url = `${BASE_URL}/forgetpassword/sendemail`;
			if (Throttle.isLock(url)) {
				return false;
			}
			$("#forgotPassword-wrapper .error_msg").text("");

			let email = $.trim($("#reg-email").val());
			if (email == '' || email == null) {
				$(".error_msg", "#forgotPassword-wrapper").text("请输入您的注册邮箱！").show();
				$("#reg-email").focus();
				return false;
			}
			if (email && !Validation.check('email',email)) {
				$(".error_msg", "#forgotPassword-wrapper").text("请输入正确的邮箱").show();
				$("#reg-email").focus();
				return false;
			}
            ///////////标记ajax：邮箱找回密码////////////////
			Throttle.lock(url);
			$.post(url, {
				email: email
			}, function (t) {
				$("#forgotPassword-wrapper .error_msg").text(t.description).show();
				Throttle.unLock(url);
			}, 'json');
		});
	},

};




export { Login };
