import { DigestAuth } from '@/utils/digestAuth'
import { Password } from '@/utils/password'
import { Validation, Throttle } from '@/utils/utils'
import { MoAlert } from '@/components/popup'
import { Common, Size } from '@/utils/common'

const CoreFrame = {
	default_detail_paddingTop: 0, // 默认详细表单顶部偏移量
	default_detail_paddingLeft: 0, // 默认详细表单左边偏移量
	main_min_width: 1280,
	main_padding_left: 128,
	main_min_height: 650,
	main_padding_bottom: 83,
	main_top_height: 98,
	fixLineHeight: 2,

	init: function () {
		this.setSize();
		this.initEvent();
	},

	initEvent: function () {
		let that = this;
		$(window).resize(function () {
			that.setSize();
		})
	},

	setSize: function () {
		let win = this.getWindowSize();
		if (win.w < this.main_min_width) {
			win.w = this.main_min_width;
		}
		if (win.h < this.main_min_height) {
			win.h = this.main_min_height;
		}
		let wrapW = win.w - (this.main_padding_left * 2);
		let wrapH = win.h;
		$(".wrap-all").width(wrapW);
		$(".wrap-all").height(win.h);
		let innerHeight = win.h - this.main_top_height - this.main_padding_bottom;
		$("#inner-main").height(innerHeight);
		let viewHeight = innerHeight - (this.fixLineHeight * 2);
		$(".wrapcontent").height(viewHeight);
	},

	initCoreSetPage: function () {
		let wH = $(window).height();
		let innerHeight = wH - this.main_top_height - this.main_padding_bottom;
		let viewHeight = innerHeight - (this.fixLineHeight * 2) - 80;
		$(".wrapcontent").css("min-height", viewHeight);
		if ('password' == $(".tabs .active").attr("data-tab")) {
			$("#detail-btn-save").addClass('disabled');
		} else {
			$("#detail-btn-save").removeClass('disabled');
		}
	},

	getWindowSize: function () {
		let w = ($(window).width());
		let h = ($(window).height());
		return { w: w, h: h };
	},

	getSideW: function () {
		return 0;
	}
}

const CoreUpdataAccount = {
	accountInput: '',

	init: function () {
		this.initEvent()
	},

	initEvent: function () {
		if (DigestAuth.username == 'mooooooo-oooo-oooo-oooo-defaultadmin') {//超管
			$('#account').show()
			$("#account-readonly").hide();
		} else {
			$('#account').hide()
			$("#account-readonly").show();
		}
		//portal如何使用  ？？？
		this.accountInput = portal.AccountInput("#account", {
			label: '账号',
			labelWidth: 120,
			value: username,
			require: true,
			readonly: true,
			placeholder: '请输入账号',
			name: 'account',
			tipMsg: '账号修改后，需使用新账号重新登录，请牢记新账号！',
			editFun: function (cb) {
				$.dialog({
					padding: 0,
					id: "confirmAccount",
					content: document.getElementById('confirmAccount'),
					lock: true,
					opacity: 0.50,	// 透明度
					cancel: false, // 隐藏关闭按钮
					drag: false // 不允许拖拽
				});
				$(".save", "#confirmAccount").off('click').on("click", function () {
					$.dialog({ id: 'confirmAccount' }).close();
					cb();
					$("#account .bmc-accountInput-tipMsg").show();
					$("#detail-btn-save").addClass("disabled")
				});
			},
			comfirmFun: function (cb) {
				let value = $('#account .base-input').val();
				if (!Common.checkAccount(value)) {
					return false
				}
				cb();
				$("#detail-btn-save").removeClass("disabled")
			},
		});
		$(".w-close", "#confirmAccount").off('click').on("click", function () {
			$.dialog({ id: 'confirmAccount' }).close();
		});
		$(".cancel", "#confirmAccount").off('click').on("click", function () {
			$.dialog({ id: 'confirmAccount' }).close();
		});
	}
}

const CoreSet = {
	profileHref: false,//记录是否从个人设置tab标签页进入的密码修改页面 默认false

	init: function () {
		CoreFormStore.storePass = $(".password-form").html()
		this.initTab();
		this.initEvent();
		CoreSetChange.init();
		Size.init();
	},

	initEvent: function () {
		$("#detail-btn-cancel").click(function () {
			location.href = BP.config.SYSTEM_URL + "/home";
		});
		$("#detail-btn-save").click(function () {
			if (!($("#detail-btn-save").hasClass("disabled"))) {
				CoreSet.save();
			}
		});
		$(".tab-item").click(function () {
			if ('password' == $(this).attr("data-tab")) {
				$("#detail-btn-save").addClass('disabled');
			} else {
				$("#detail-btn-save").removeClass('disabled');
			}
		});

		Common.headerEvent();
	},
	save: function () {
		let tabname = this.getTabName();
		let that = this;
		switch (tabname) {
			case "profile": {
				this.profileSave();
				break;
			}
			case "password": {
				this.passwordSave();
				break;
			}
			case "gmt": {
				this.gmtSave();
				break;
			}
			case "language": {
				this.languageSave();
				break;
			}
			case "portrait": {
				this.portraitSave();
				break;
			}
		}
	},
	//保存更改后的个人信息
	profileSave: function () {

		let url = BP.config.SYSTEM_URL + "/system/user/updateuser";
		if (Throttle.isLock(url)) {
			return false;
		}

		// Throttle.lock(url);
		let newAccount = $('#account .base-input').val();
		let account = "";//超管传
		if (DigestAuth.username == 'mooooooo-oooo-oooo-oooo-defaultadmin') {//超管
			if (username && newAccount && (username != newAccount)) {//并修改了账号
				account = newAccount
			}
		}
		let data = {
			moid: $.trim($("#moid").val()),
			account: account,
			mobile: $.trim($("#mobile").val()),
			email: $.trim($("#email").val()),
			seat: $.trim($("#officeLocation").val())
		};
		if (!newAccount) {
			MoAlert("请输入账号");
			return false;
		}
		//校验方法
		if (data.mobile && !Validation.check('mobile', data.mobile)) {
			// MoAlert('手机长度不超过15,只允许输入"数字、.、_、-、*、#、空格"');
			MoAlert('请输入11位数字的手机号码');
			$("#mobile").focus();
			return false;
		}
		if (data.email && !Validation.check('email', data.email)) {
			MoAlert("请输入正确的邮箱地址");
			$("#email").focus();
			return false;
		}

		if (data.email && !Validation.checkLength(data.email, 64)) {
			MoAlert("邮箱地址长度不能大于64位字符");
			$("#email").focus();
			return false;
		}
		if (data.seat && !Validation.checkLength(data.seat, 60)) {
			MoAlert("请输入联系地址长度不超过60");
			$("#officeLocation").focus();
			return false;
		}

		$("#mobile").attr("value", data.mobile);
		$("#email").attr("value", data.email);
		$("#officeLocation").attr("value", data.seat);
		if (data.seat) {
			if (!(data.seat.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]+$/))) {
				MoAlert('办公位置只能为中英文和数字及下划线组成', function () {
					$('#officeLocation').focus();
				});
				Throttle.unLock(url);
				return false;
			}
		}
		Throttle.lock(url);
		$.ajax({
			type: 'post',
			url: url,
			data: data,
			dataType: 'json',
			success: function (msg) {
				if (msg.success) {
					CoreFormStore.set("profile");
				}
				MoAlert(msg.description);
				Throttle.unLock(url);
				let newAccount = $('#account .base-input').val();
				if (username && newAccount && (username != newAccount)) {//修改了账号 回到登陆页面
					setTimeout(function () {
						window.location.href = "./loginout"
					}, 1000)
				}
			},
			error: function () {
				MoAlert("修改个人资料失败，请与系统管理员联系！");
				Throttle.unLock(url);
			}
		});
	},
	portraitSave: function () {
		let url = BP.config.SYSTEM_URL + "/system/user/confirmPortrait";
		if (Throttle.isLock(url)) {
			return false;
		}
		Throttle.lock(url);

		let selection_str = $("#selection").val();
		if (!selection_str) {
			MoAlert("请先选择图片");
			Throttle.unLock(url);
			return false;
		}

		let selection = JSON.parse(selection_str);
		$.ajax({
			type: 'post',
			url: url,
			data: {
				x1: selection.x1 ? selection.x1 : 0,
				y1: selection.y1 ? selection.y1 : 0,
				width: selection.width,
				height: selection.height,
				fileName: $("#fileName").val()
			},
			dataType: 'json',
			success: function (msg) {
				if (msg.success) {
					MoAlert("头像修改成功", function () {
						CoreSet.loadPage(msg.data);
					});
				} else {
					MoAlert(msg.description);
				}
				Throttle.unLock(url);
			},
			error: function () {
				MoAlert("头像修改失败");
				Throttle.unLock(url);
			}
		});
	},
	loadPage: function (data) {
		Common.initPortrait(data.portraitUrl40, window.portraitDomain);
	},
	passwordSave: function () {
		let url = BP.config.SYSTEM_URL + "/system/user/updatepassword";
		let securityPolicyObj = { "弱": 1, "中": 2, "强": 3 };
		let newPasswordStrength = securityPolicyObj[$(".newPasswordTip .tip-info").text()];
		if (passwordStrengthOfSecurityPolicy != "") {
			if (newPasswordStrength < passwordStrengthOfSecurityPolicy) {
				if (passwordStrengthOfSecurityPolicy == 3) {
					MoAlert("密码等级必须为强");
				}
				if (passwordStrengthOfSecurityPolicy == 2) {
					MoAlert("密码等级至少为中");
				}
				if (passwordStrengthOfSecurityPolicy == 1) {
					MoAlert("密码等级至少为弱");
				}
				return;
			}
		} else {
			MoAlert("未获取到用户密码等级强度");
			return;
		}
		if (Throttle.isLock(url)) {
			return false;
		}
		Throttle.lock(url);
		let data = {
			moid: $("#moid").val(),
			oldPassword: $.trim($("#oldPassword").val()),
			newPassword: $.trim($("#newPassword").val()),
			confirmPassword: $.trim($("#confirmPassword").val())
		};

		if ('' == $.trim(data.oldPassword)) {
			MoAlert("请输入当前密码。");
			$("#oldPassword").focus();
			Throttle.unLock(url);
			return false;
		}
		if ('' == $.trim(data.newPassword)) {
			MoAlert("请输入新密码");
			$("#newPassword").focus();
			Throttle.unLock(url);
			return false;
		}

		if ('' == $.trim(data.confirmPassword)) {
			MoAlert("请输入确认密码");
			$("#confirmPassword").focus();
			Throttle.unLock(url);
			return false;
		}
		if (data.newPassword.length > 32 || !Validation.isRegExp(regexEnum.password, data.newPassword)) {
			MoAlert('密码由1-32个字符组成，支持字母大小写、数字、"_"、"."(不包括空格)');
			$("#newPassword").focus();
			Throttle.unLock(url);
			return false;
		};

		if ($.trim(data.oldPassword) == $.trim(data.newPassword)) {
			MoAlert("新密码不能与旧密码一致");
			$("#newPassword").focus();
			Throttle.unLock(url);
			return false;
		}
		if ($.trim(data.newPassword) != $.trim(data.confirmPassword)) {
			MoAlert("新密码、确认密码不一致，请确认后重新输入。");
			$("#confirmPassword").focus();
			Throttle.unLock(url);
			return false;
		}
		let cdata = {};
		if ('1' == systemSecurity) {
			cdata = DigestAuth.makePassword(data.oldPassword, data.newPassword);
		} else {
			cdata = DigestAuth.makePassword(hex_md5(data.oldPassword), data.newPassword);
			let params = DigestAuth.makePassword(hex_md5(data.oldPassword), data.oldPassword);
			cdata['key'] = params['knonce'] + '_' + params['ciphertext'] + '_' + params['hmac'];
		}
		$.ajax({
			type: 'post',
			url: url,
			data: cdata,
			dataType: 'json',
			success: function (msg) {
				if (msg.success) {
					CoreFormStore.reset();
					MoAlert("密码修改成功，请重新登录。", function () {
						location.href = BP.config.SYSTEM_URL + "/loginout";
					});
				} else {
					MoAlert(msg.description);
				}
				Throttle.unLock(url);
			},
			error: function () {
				MoAlert("密码修改失败");
				Throttle.unLock(url);
			}
		});
	},
	gmtSave: function () {
		MoAlert("时区Build3实现");
	},

	languageSave: function () {
		MoAlert("语言包Build3实现");
	},

	getHash: function () {
		let hash;
		hash = (!window.location.hash) ? "#perfile" : window.location.hash;
		return hash.substring(1, hash.length);
	},
	//选项卡切换
	initTab: function () {
		let hash = this.getHash();
		this.activeTab("." + hash);
		let that = this;
		$(".tab-item").click(function () {
			return that.activeTab(this);
		});
		$(".nav-tab-item").click(function () {
			return that.activeTab($(this).attr("href").replace("set#", "."));
		});
	},
	activeTab: function (tab) { //tab = .password
		if (tab == '.profile') {
			this.profileHref = true;
		}
		let name = $(tab).data("tab"); //name=password  注意多类选择器的问题
		let userMoids = $("#moid").val();
		let newAccount = $('#account .base-input').val();
		if (name == 'password') {
			if (username && newAccount && (username != newAccount)) {//修改了账号
				if ($('.bmc-accountInput-edit').css("display") == "none") {//是编辑状态
					MoAlert('账号已修改，请先确认新账号');
					return false;
				}
			}
		}
		if (this.before(name)) {
			CoreSetChange.show(name);
			return false;
		}
		if (name == 'password') {//切换至修改密码时 个人信息中账号要还原至原状态
			CoreUpdataAccount.accountInput.setValue(username);
			CoreUpdataAccount.accountInput.setReadonly();//账号设置只读状态
		} else if (name == 'profile') {
			CoreUpdataAccount.init();
		}
		if (userMoids == 'mooooooo-oooo-oooo-oooo-defaultadmin') {
			let _this = this;
			if (name == 'password') {
				$(".tipPass").show();
				$.dialog({
					padding: 0,
					id: "passwordUpdate",
					content: document.getElementById('passwordUpdate'),
					lock: true,
					opacity: 0.50,	// 透明度
					cancel: false, // 隐藏关闭按钮
					drag: false // 不允许拖拽
				});
				$(".save", "#passwordUpdate").off('click').on("click", function () {
					$.dialog({ id: 'passwordUpdate' }).close();
					$(".showTip").show();
				});
				$(".w-close", "#passwordUpdate").off('click').on("click", function () {
					$.dialog({ id: 'passwordUpdate' }).close();
					if (_this.profileHref) {//从个人信息tab标签来
						$("#modifyUser").click();
					} else {
						window.location.href = window.document.referrer;
					}
				});
				$(".cancel", "#passwordUpdate").off('click').on("click", function () {//取消 从哪里来的返回哪个页面
					$.dialog({ id: 'passwordUpdate' }).close();
					if (_this.profileHref) {//从个人信息tab标签来
						$("#modifyUser").click();
					} else {
						window.location.href = window.document.referrer;
					}
				});
			} else {
				$(".tipPass").hide();
				$(".showTip").hide();
			}
		}

		if ($(tab).hasClass("active")) {
			return false;
		}

		$(".tab-item").removeClass("active");
		$(tab).addClass("active");
		$('.set-tab-forms').hide();
		$("." + name + "-form").show();
		$(".tab-tip").hide();
		$("." + name + "-tip").show();

		if ($(".imgareaselect-selection").length != 0) {
			if (name == "portrait") {
				$(".imgareaselect-selection").parent().css("display", "block");
				$(".imgareaselect-outer").css("display", "block");
			} else {
				$(".imgareaselect-selection").parent().css("display", "none");
				$(".imgareaselect-outer").css("display", "none");
			}
		}
		CoreFormStore.set(name);
	},

	getTabName: function () {
		return $(".tab-item.active").data("tab");
	},

	dialog: null,
	before: function (name) {
		return CoreFormStore.isChange();
	}
}

const CoreSetChange = {
	name: null,

	init: function () {
		this.initEvent();
	},

	initEvent: function () {
		let that = this;
		//取消
		$(".w-close", "#changeWrapper").on("click", function () {
			that.close();
			CoreFormStore.reset();
			CoreSet.activeTab("." + that.name);
		});
		$(".cancel", "#changeWrapper").on("click", function () {
			that.close();
			CoreFormStore.reset();
			CoreSet.activeTab("." + that.name);
		});

		$(".save", "#changeWrapper").on("click", function () {
			that.close();
			CoreSet.save();
		});
	},
	show: function (name) {
		$.dialog({
			padding: 0,
			id: "changeWindow",
			content: document.getElementById('changeWrapper'),
			lock: true,
			opacity: 0.50,	// 透明度
			cancel: false, // 隐藏关闭按钮
			drag: false // 不允许拖拽
		});
		this.name = name;
	},
	close: function () {
		$("#detail-btn-save").removeClass("disabled");
		$.dialog({ id: 'changeWindow' }).close();
	}
}

const CoreFormStore = {
	store: [],
	storeH: [],
	storePass: [],
	lastKey: null,
	getSerialize: function (name) {
		return $("." + name + "-form").serialize();
	},
	getHtml: function (name) {
		return $("." + name + "-form").html();
	},
	reset: function () {
		if (this.lastKey == "password") {
			$("." + this.lastKey + "-form").html(CoreFormStore.storePass)
		} else {
			$("." + this.lastKey + "-form").html(this.storeH[this.lastKey]);
		}
		Password.init(options);
	},
	set: function (name) {
		let that = this;
		that.lastKey = name;
		that.store[name] = that.getSerialize(name);
		that.storeH[name] = that.getHtml(name);
	},
	isChange: function (name) {
		if (this.lastKey == null) {
			return false;
		}
		return this.store[this.lastKey] != this.getSerialize(this.lastKey);
	}
}

export { CoreFrame, CoreUpdataAccount, CoreSet }

