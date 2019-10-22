import Store from '@/store';
import { DigestAuth } from './digestAuth';

import { hex_md5 } from '@/lib/md5/md5';


function getPasswordStrength(pwd) {
    const strengthRegular = Store.getState('strengthRegular');
	if (!pwd && '0' != pwd) return "fault";
	if (strengthRegular) {
		let checkArr = ['3', '2', '1'];// 校验顺序 强 中 弱
		for (let i = 0; i < checkArr.length; i++) {
			let strength = checkArr[i];
			if (strengthRegular[strength] && (new RegExp(strengthRegular[strength]).test(pwd))) {
				let result = strength == '2' ? "medium" : strength == '3' ? "strong" : strength == '1' ? "weak" : "fault";
				return result;
			}
		}
	} else {
		console.error("密码强认证规则获取失败");
	}
	return "fault";
}

const Password = {
	oldPasswordId: "#oldPassword",
	newPasswordId: "#newPassword",
	confirmPasswordId: "#confirmPassword",
	passwordObj: { oldPassword: 'oldPassword', newPassword: 'newPassword', confirmPassword: 'confirmPassword' },
	oldPasswordEye: "",
	newPasswordEye: "",
	confirmPasswordEye: "",
	oldPasswordTip: "",
	newPasswordTip: "",
	confirmPasswordTip: "",
	strongAuthentication: false,
	checkUsed: false,
	saveBtnId: "#detail-btn-save",
	strengthOfPass: { '弱': 1, '中': 2, '强': 3 },
	init: function (options) {
		this.strongAuthentication = options.strongAuthentication;
		for (let i in this.passwordObj) {
			this.capitalTip(this.passwordObj[i]);
		}
		if (options.checkUsed) {
			this.checkUsed = true;
		}
		this.initData();
		this.initEvent();
	},
	initData: function () {
		this.oldPasswordEye = $(this.oldPasswordId).next()
		$(this.oldPasswordEye).remove();
		this.newPasswordEye = $(this.newPasswordId).next()
		$(this.newPasswordEye).remove();
		this.confirmPasswordEye = $(this.confirmPasswordId).next();
		$(this.confirmPasswordEye).remove();
		this.oldPasswordTip = $($(this.oldPasswordId).parents()[2]).find('.oldPasswordTip');
		this.newPasswordTip = $($(this.newPasswordId).parents()[2]).find('.newPasswordTip');
		this.confirmPasswordTip = $($(this.confirmPasswordId).parents()[2]).find('.confirmPasswordTip');
	},
	initEvent: function () {
		this.initShowHidePass();
		this.initOldPass();
		this.initNewPass();
		this.initConfirmPass();
		this.initHelp();
	},
	toggleEye: function ($this) {
		if (!$this.hasClass("click")) {
			if (!$this.hasClass("show-password")) {
				$this.prev().focus();
			}
		}
		$this.addClass("click")
		$this.toggleClass("show-password");

		if ($this.hasClass("show-password")) {
			$this.prev().attr("type", "text");
		} else {
			$this.prev().attr("type", "password");
		}

	},
	initShowHidePass: function () {
		let that = this;
		$(".showHidePassword").mousedown(function () {
			that.toggleEye($(this))
		});
	},
	initOldPass: function () {
		let that = this;
		$(this.oldPasswordId).keyup(function (event) {
			let oldPassword = $(this).val();
			if (oldPassword == undefined || oldPassword.length <= 0) {//当前密码清空时，新密码和确认密码都清空
				that.clearOldPasswordTip();
				that.clearNewPassword();
				that.clearConfirmPassword();
			} else {//清除当前密码本身的提示
				that.clearOldPasswordTip();
			}
			if ($(that.confirmPasswordTip).find('.tip-info').text() == "密码一致") {
				$(that.saveBtnId).addClass("disabled");
			}
		});
		$(this.oldPasswordId).blur(function () {
			if (!$(this).next().hasClass("click")) {
				that.checkPassword(false);
				if (that.oldPasswordEye.hasClass("show-password")) {
					that.toggleEye(that.oldPasswordEye);
				}
				if ($(that.oldPasswordId).next().hasClass("showHidePassword")) {
					$(that.oldPasswordId).next().removeClass("click")
					that.oldPasswordEye = $(that.oldPasswordId).next();
					$(that.oldPasswordEye).remove();
				}

			} else {
				$(this).focus();
			}
			$(this).next().removeClass("click");
			if ($(that.oldPasswordId).val() == "") {
				$(that.oldPasswordTip).find('.tip-icon').removeClass('error-icon');
				$(that.oldPasswordTip).find('.tip-info').removeClass('error-info').text('');
			}
		});
		$(this.oldPasswordId).focus(function () {
			if (!$(this).next().hasClass("showHidePassword")) {
				$(this).after(that.oldPasswordEye)
				$(that.oldPasswordEye).addClass("hide-password")
				that.initShowHidePass();
				$(".text-tips").hide();
			}
		});
	},
	newPassFocus: function ($this) {
		let that = this;
		if (!$this.next().hasClass("showHidePassword")) {
			$this.after(that.newPasswordEye)
			$(that.newPasswordEye).addClass("hide-password")
			this.initShowHidePass();
			$(".text-tips").show();
		}
	},
	newPassBlur: function ($this) {
        let that = this;
        const BASE_URL = Store.getState('BASE_URL')
		if ($this.next().hasClass("showHidePassword")) {
			if (!$this.next().hasClass("click")) {
				if (that.newPasswordEye.hasClass("show-password")) {
					this.toggleEye(that.newPasswordEye)
				}
				if ($(that.newPasswordId).next().hasClass("showHidePassword")) {
					$(that.newPasswordId).next().removeClass("click");
					that.newPasswordEye = $(that.newPasswordId).next();
					$(that.newPasswordEye).remove();
					let newPassword = $.trim($(Password.newPasswordId).val());
					if (this.strongAuthentication) {
						if (newPassword.length > 0 && newPassword.length < 8) {
							this.showTips($(that.newPasswordTip), false, "长度至少为8位")
							$(that.newPasswordTip).find('.help').hide();
							$(that.newPasswordId).focus();
							return false;
						} else if (newPassword.length == 0) {
							this.showTips($(that.newPasswordTip), null)
							return false;
						} else {
							if (this.strengthOfPass[$(that.newPasswordTip).find('.tip-info').text()] < Store.getState('user.passwordStrength')) {
								this.showTips($(that.newPasswordTip), false, "密码不符合强度等级要求")
								$(that.newPasswordTip).find('.help').hide();
								$(that.newPasswordId).focus();
								return false;
							}
						}
					}
					//判断密码是否使用过
					if (Password.checkUsed) {
						let oldPassword = $.trim($(Password.oldPasswordId).val());
						let cdata = {};
						if (!!oldPassword) {
							if (newPassword.length > 0) {
								if ('1' === systemSecurity) {
									cdata = DigestAuth.makePassword(oldPassword, newPassword);
								} else {
									cdata = DigestAuth.makePassword(hex_md5(oldPassword), newPassword);
								}
								$.post(BASE_URL + '/system/user/checkNewPassword', cdata, function (msg) {
									if (msg.success) {
										return Password.checkNewPasswordCallback(msg.data);
									}
								}, 'json').fail(function () {
								});
							}

						} else if (!!nonce) {
							cdata = DigestAuth.makePassword(nonce, newPassword);
							cdata.email = $.trim($('#email').val());
							cdata.sequenceNum = $.trim($('#sequenceNum').val());
							$.post(BASE_URL + '/forgetpassword/checkNewPassword', cdata, function (msg) {
								if (msg.success) {
									return Password.checkNewPasswordCallback(msg.data);
								}
							}, 'json').fail(function () {
							});
						}
					}
				}
			} else {
				$this.focus();
			}
			$this.next().removeClass("click");
		}
	},
	checkNewPasswordCallback: function (data) {
		if (data === '1') { //旧密码使用过
			Password.clearNewPasswordTip();
			Password.showTips($(Password.newPasswordTip), false, "密码已使用");
			$('.newPasswordTip .help').hide();
			$(Password.newPasswordId).focus();
			return false;
		}
		return true;
	},
	initNewPass: function () {
		let that = this;
		let newPass = true;
		$(this.newPasswordId).focus(function () {
			if (that.oldPasswordId != "") {
				if ($(that.oldPasswordTip).find('.tip-icon').hasClass("error-icon")) {
					$(that.oldPasswordId).focus();
				}
				if (!$(that.oldPasswordTip).find('.tip-icon').hasClass("correct-icon")) {
					if ($(that.oldPasswordId).val() == "") {
						that.showTips($(that.oldPasswordTip), false, "当前密码不能为空")
						$(that.oldPasswordId).focus();
					} else {
						that.checkPassword(newPass);
					}
				} else {
					that.newPassFocus($(this))
				}
			} else {
				that.newPassFocus($(this))
			}
		});

		$(this.newPasswordId).blur(function () {
			that.newPassBlur($(this));
		})
		$(this.newPasswordId).keyup(function (event) {
			let password = $(this).val();
			if (password == "" || password == undefined) {//新密码清空时，确认密码清空
				that.clearConfirmPassword();
				that.clearNewPasswordTip();
			} else {
				that.clearConfirmPasswordTip();
				that.clearNewPasswordTip();
				if (that.checkNewPassWithOldPass(password)) {
					that.showStrength(password);
				}
			}
			//已经输入确认密码回头再改新密码
			if ($(that.confirmPasswordId).val() != "" && $(that.confirmPasswordId).val() != undefined) {
				if (that.strongAuthentication && password.length > 0 && password.length < 8) {
					that.showTips($(that.newPasswordTip), false, "长度至少为8位")
					that.showTips($(that.confirmPasswordTip), false, "密码不一致");
				} else {
					if ($(that.confirmPasswordId).val() == $(this).val() && password.length >= 8) {
						that.showTips($(that.confirmPasswordTip), true, "密码一致")
						$(that.saveBtnId).removeClass("disabled");
					} else {
						that.showTips($(that.confirmPasswordTip), false, "密码不一致");
						$(that.saveBtnId).addClass("disabled");
					}
				}
			}
		})
	},
	confirmPassFocus: function ($this) {
		let that = this;
		if (!$this.next().hasClass("showHidePassword")) {
			$this.after(that.confirmPasswordEye)
			$(that.confirmPasswordEye).addClass("hide-password")
			this.initShowHidePass();
			$(".text-tips").hide();
		}
	},
	initConfirmPass: function () {
		let that = this;
		$(this.confirmPasswordId).focus(function () {
			if ($(that.newPasswordTip).find('.tip-icon').hasClass("error-icon") || $(that.oldPasswordTip).find('.tip-icon').hasClass("error-icon")) {
				$(that.newPasswordId).focus();
			} else {
				if ($(that.newPasswordId).val() == "" || $(that.newPasswordId).val() == undefined) {
					that.showTips($(that.newPasswordTip), false, "密码不能为空")
					$(that.newPasswordId).focus();
				} else {
					if ($(that.newPasswordId).val().length > 0 && $(that.newPasswordId).val().length < 8) {
						if (that.strongAuthentication) {
							that.showTips($(that.newPasswordTip), false, "长度至少为8位")
							$(that.newPasswordTip).find('.help').hide();
							$(that.newPasswordId).focus();
						} else {
							that.confirmPassFocus($(that.confirmPasswordId))
						}
					} else {
						if (that.strengthOfPass[$(that.newPasswordTip).find('.correct-tip').text()] < Store.getState('user.passwordStrength')) {
							that.showTips($(that.newPasswordTip), false, "密码不符合强度等级要求")
							$(that.newPasswordTip).find('.help').hide();
							$(that.newPasswordId).focus();
						} else {
							that.confirmPassFocus($(that.confirmPasswordId))
						}
					}
				}
			}

		});
		$(this.confirmPasswordId).blur(function () {
			if ($(this).next().hasClass("showHidePassword")) {
				if (!$(this).next().hasClass("click")) {
					if (that.confirmPasswordEye.hasClass("show-password")) {
						that.toggleEye(that.confirmPasswordEye)
					}
					if ($(that.confirmPasswordId).next().hasClass("showHidePassword")) {
						$(that.confirmPasswordId).next().removeClass("click");
						that.confirmPasswordEye = $(that.confirmPasswordId).next();
						$(that.confirmPasswordEye).remove();
					}

				} else {
					$(this).focus();
				}
				$(this).next().removeClass("click");
			}
		}),
			$(this.confirmPasswordId).keyup(function (event) {
				if ($(that.newPasswordId).val() == $(this).val()) {
					that.showTips($(that.confirmPasswordTip), true, "密码一致")
					$(that.saveBtnId).removeClass("disabled");
				} else {
					$(that.saveBtnId).addClass("disabled");
					if ($(that.confirmPasswordId).val() != "" && $(that.confirmPasswordId).val() != undefined) {
						that.showTips($(that.confirmPasswordTip), false, "密码不一致")
					} else {
						that.clearConfirmPasswordTip();
					}

				}
			})
	},
	initHelp: function () {
		$(".help").hover(function () {
			$(".help-info").toggleClass("displayNone");
			$(".password-form").height(420)
		})
	},
	checkPasswordLevel: function (value) {
		let strong = 0;
		for (let i = 0; i < value.length; i++) {
			if (this.checkCharMode(value.charCodeAt(i)) == 9) {
				strong = -1;
				break;
			}
			if (this.checkCharMode(value.charCodeAt(i)) == 8) {
				strong++;
			}
		}
		if (strong == 1) {
			return "medium";
		} else if (strong > 1) {
			return "strong";
		} else if (strong == -1) {
			return "fault";
		} else {
			return "weak";
		}
	},
	//检查密码强度
	checkCharMode: function (ch) {
		if (ch >= 48 && ch <= 57) {//数字
			return 1;
		} else if (ch >= 65 && ch <= 90) {//大写字母
			return 2;
		} else if (ch >= 97 && ch <= 122) {//小写字母
			return 4;
		} else {//特殊字符 : _ 是95；.是46
			if (ch == 95 || ch == 46) {
				return 8;
			} else {
				return 9;
			}
		}
	},
	checkNewPassWithOldPass: function (password) {
		if (this.oldPasswordId != "") {
			if (password == $(this.oldPasswordId).val()) {//新旧密码相同给出提示
				this.showTips($(this.newPasswordTip), false, "新旧密码不能相同")
				$(".help").hide();
				return false;
			} else if (password.length > 0 && password.length < 8) {
				this.showTips($(this.newPasswordTip), false, "长度至少为8位")
				$(".help").hide();
				return false;
			}
		}
		return true;
	},
	clearNewPassword: function () {//清除新密码
		this.clearNewPasswordTip();
		$(this.newPasswordId).val("");
	},
	clearConfirmPassword: function () {//清除确认密码
		this.clearConfirmPasswordTip()
		$(this.confirmPasswordId).val("");
	},
	clearOldPassword: function () {//清除旧密码
		this.clearOldPasswordTip()
		$(this.oldPasswordId).val("");
	},
	clearOldPasswordTip: function () {
		$(this.oldPasswordTip).find('.tip-icon').removeClass("error-icon correct-icon");
		$(this.oldPasswordTip).find('.tip-info').removeClass("error-tip correct-tip");
		$(this.oldPasswordTip).find('.tip-info').text("");
	},
	clearNewPasswordTip: function () {
		$(this.newPasswordTip).find('.tip-icon').removeClass("error-icon weak-icon medium-icon strong-icon");
		$(this.newPasswordTip).find('.tip-info').removeClass("error-tip weak-tip medium-tip strong-tip");
		$(".help").hide();
		$(this.newPasswordTip).find('.tip-info').text("");
	},
	clearConfirmPasswordTip: function () {
		$(this.confirmPasswordTip).find('.tip-icon').removeClass("error-icon correct-icon");
		$(this.confirmPasswordTip).find('.tip-info').removeClass("error-tip correct-tip");
		$(this.confirmPasswordTip).find('.tip-info').text("");
		$(this.saveBtnId).addClass("disabled");
	},
	checkPassword: function (newPass) {//检测旧（当前）密码是否正确
		let that = this;
		let oldPassword = $(this.oldPasswordId).val();
		if (oldPassword != "" && oldPassword != undefined) {

			let url = Store.getState('BASE_URL') + "/modifypassword/checkOldPassword";
			let data = {};
			if ('1' == systemSecurity) {
				data = DigestAuth.makePassword(oldPassword, oldPassword);
			} else {
				data = DigestAuth.makePassword(hex_md5(oldPassword), oldPassword);
			}
			data.username = DigestAuth.username;
			$.post(url, data, function (msg) {
				if (msg.success) {
					$(that.oldPasswordTip).find('.tip-info').text(msg.description);
					if (msg.data == "1") {//旧（当前）密码正确
						that.showTips($(that.oldPasswordTip), true, "密码一致")
						if (newPass) {
							that.newPassFocus($(that.newPasswordId))
						}
					} else {
						//旧（当前）密码错误-清空新密码和确认密码
						that.showTips($(that.oldPasswordTip), false, "密码不一致")
						if (newPass) {
							$(that.oldPasswordId).focus();
						}
						that.clearNewPassword();
						that.clearConfirmPassword();
					}
				}
			}, "json").error(function () {
			});
		}
	},
	showTips: function (passwordTipElement, isCorrect, tips) {
		if (isCorrect == null) {
			passwordTipElement.find('.tip-icon').removeClass("error-icon correct-icon error-tip correct-tip");
			passwordTipElement.find('.tip-info').text("");
		} else if (isCorrect) {
			passwordTipElement.find('.tip-icon').removeClass("error-icon").addClass("correct-icon");
			passwordTipElement.find('.tip-info').removeClass("error-tip").addClass("correct-tip");
			passwordTipElement.find('.tip-info').text(tips);
		} else {
			passwordTipElement.find('.tip-icon').removeClass("correct-icon").addClass("error-icon");
			passwordTipElement.find('.tip-info').removeClass("correct-tip").addClass("error-tip");
			passwordTipElement.find('.tip-info').text(tips);
		}
	},
	//密码大写输入提示
	capitalTip: function (id) {
		let capital = false; //聚焦初始化，防止刚聚焦时点击Caps按键提示信息显隐错误

		// 获取大写提示的标签，并提供大写提示显示隐藏的调用接口
		let capitalTip = {
			$elem: $('#capital_' + id),
			toggle: function (s) {
				if (s === 'none') {
					this.$elem.hide();
				} else if (s === 'block') {
					this.$elem.show();
				} else if (this.$elem.is(':hidden')) {
					this.$elem.show();
				} else {
					this.$elem.hide();
				}
			}
		}
		$('#' + id).on('keydown.caps', function (e) {
			if (e.keyCode === 20 && capital) { // 点击Caps大写提示显隐切换
				capitalTip.toggle();
			}
		}).on('focus.caps', function () { capital = false })
			.on('keypress.caps', function (e) { capsLock(e) })
			.on('blur.caps', function (e) {
				//输入框失去焦点，提示隐藏
				capitalTip.toggle('none');
			});
		function capsLock(e) {
			let keyCode = e.keyCode || e.which;// 按键的keyCode
			let isShift = e.shiftKey || keyCode === 16 || false;// shift键是否按住
			if (keyCode === 9) {
				capitalTip.toggle('none');
			} else {
				//指定位置的字符的 Unicode 编码 , 通过与shift键对于的keycode，就可以判断capslock是否开启了
				// 90 Caps Lock 打开，且没有按住shift键
				if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
					capitalTip.toggle('block'); // 大写开启时弹出提示框
					capital = true;
				} else {
					capitalTip.toggle('none');
					capital = true;
				}
			}
		}
	},
	showStrength: function (password) {
		let passwordType = getPasswordStrength(password);
		let obj = { 'weak': '弱', 'medium': '中', 'strong': '强' };
		$(".help").show();
		if (password.length < 8 && !this.strongAuthentication) {
			$(this.newPasswordTip).find('.tip-icon').toggleClass("weak-icon");
			$(this.newPasswordTip).find('.tip-info').toggleClass("weak-tip");
			$(this.newPasswordTip).find('.tip-info').text("弱");
			return;
		}

		if (passwordType == "fault") {
			this.showTips($(this.newPasswordTip), false, "密码不符合要求")
		} else {
			$(this.newPasswordTip).find('.tip-icon').toggleClass(passwordType + "-icon");
			$(this.newPasswordTip).find('.tip-info').toggleClass(passwordType + "-tip");
			$(this.newPasswordTip).find('.tip-info').text(obj[passwordType]);
		}
	}

};

export { Password }
