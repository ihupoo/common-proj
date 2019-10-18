$.namespace("Mo.SetFrame");
let CoreFrame = {
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
		var that = this;
		$(window).resize(function () {
			that.setSize();
		})
	},

	setSize: function () {
		var win = this.getWindowSize();

		if (win.w < this.main_min_width) {
			win.w = this.main_min_width;
		}

		if (win.h < this.main_min_height) {
			win.h = this.main_min_height;
		}
		var wrapW = win.w - (this.main_padding_left * 2);
		var wrapH = win.h;
		$(".wrap-all").width(wrapW);
		$(".wrap-all").height(win.h);
		var innerHeight = win.h - this.main_top_height - this.main_padding_bottom;
		$("#inner-main").height(innerHeight);
		var viewHeight = innerHeight - (this.fixLineHeight * 2);
		$(".wrapcontent").height(viewHeight);
	},
	initCoreSetPage: function () {
		var wH = $(window).height();
		var innerHeight = wH - this.main_top_height - this.main_padding_bottom;
		var viewHeight = innerHeight - (this.fixLineHeight * 2) - 80;
		$(".wrapcontent").css("min-height", viewHeight);
		if ('password' == $(".tabs .active").attr("data-tab")) {
			$("#detail-btn-save").addClass('disabled');
		} else {
			$("#detail-btn-save").removeClass('disabled');
		}
	},

	getWindowSize: function () {
		var w = ($(window).width());
		var h = ($(window).height());
		return { w: w, h: h };
	},

	getSideW: function () {
		return 0;
	}
}
$.namespace("Mo.updataAccount")
let UpdataAccount = {
	accountInput: '',

	init: function () {
		this.initEvent()
	},
	
	initEvent: function () {
		if (Mo.Base.DigestAuth.username == 'mooooooo-oooo-oooo-oooo-defaultadmin') {//超管
			$('#account').show()
			$("#account-readonly").hide();
		} else {
			$('#account').hide()
			$("#account-readonly").show();
		}
		this.accountInput = Mo.Portal.AccountInput("#account", {
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
				var value = $('#account .base-input').val();
				if (!Mo.Base.account.checkAccount(value)) {
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

$.namespace("Mo.Set")
Mo.Set = {
	profileHref: false,//记录是否从个人设置tab标签页进入的密码修改页面 默认false
	init: function () {
		Mo.Form.store.storePass = $(".password-form").html()
		this.initTab();
		this.initEvent();
		Mo.Set.change.init();
		SSO.Size.init();
	},
	initEvent: function () {
		$("#detail-btn-cancel").click(function () {
			location.href = BP.config.SYSTEM_URL + "/home";
		});
		$("#detail-btn-save").click(function () {
			if (!($("#detail-btn-save").hasClass("disabled"))) {
				Mo.Set.save();
			}
		});
		$(".tab-item").click(function () {
			if ('password' == $(this).attr("data-tab")) {
				$("#detail-btn-save").addClass('disabled');
			} else {
				$("#detail-btn-save").removeClass('disabled');
			}
		});

		SSO.common.headerEvent();
	},
	save: function () {
		var tabname = this.getTabName();
		var that = this;
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

		var url = BP.config.SYSTEM_URL + "/system/user/updateuser";
		if (Mo.Base.throttle.isLock(url)) {
			return false;
		}

		// Mo.Base.throttle.lock(url);
		var newAccount = $('#account .base-input').val();
		var account = "";//超管传
		if (Mo.Base.DigestAuth.username == 'mooooooo-oooo-oooo-oooo-defaultadmin') {//超管
			if (username && newAccount && (username != newAccount)) {//并修改了账号
				account = newAccount
			}
		}
		var data = {
			moid: $.trim($("#moid").val()),
			account: account,
			mobile: $.trim($("#mobile").val()),
			email: $.trim($("#email").val()),
			seat: $.trim($("#officeLocation").val())
		};
		if (!newAccount) {
			alert("请输入账号");
			return false;
		}
		//校验方法
		if (data.mobile && !SSO.verify.mobile(data.mobile)) {
			// alert('手机长度不超过15,只允许输入"数字、.、_、-、*、#、空格"');
			alert('请输入11位数字的手机号码');
			$("#mobile").focus();
			return false;
		}
		if (data.email && !SSO.verify.email(data.email)) {
			alert("请输入正确的邮箱地址");
			$("#email").focus();
			return false;
		}

		if (data.email && !SSO.Base.validation.checkLength(data.email, 64)) {
			alert("邮箱地址长度不能大于64位字符");
			$("#email").focus();
			// Mo.Base.throttle.unLock(url);
			return false;
		}
		if (data.seat && !SSO.Base.validation.checkLength(data.seat, 60)) {
			alert("请输入联系地址长度不超过60");
			$("#officeLocation").focus();
			// Mo.Base.throttle.unLock(url);
			return false;
		}

		$("#mobile").attr("value", data.mobile);
		$("#email").attr("value", data.email);
		$("#officeLocation").attr("value", data.seat);
		if (data.seat) {
			if (!(data.seat.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]+$/))) {
				alert('办公位置只能为中英文和数字及下划线组成', function () {
					$('#officeLocation').focus();
				});
				Mo.Base.throttle.unLock(url);
				return false;
			}
		}
		Mo.Base.throttle.lock(url);
		$.ajax({
			type: 'post',
			url: url,
			data: data,
			dataType: 'json',
			success: function (msg) {
				if (msg.success) {
					Mo.Form.store.set("profile");
				}
				alert(msg.description);
				Mo.Base.throttle.unLock(url);
				var newAccount = $('#account .base-input').val();
				if (username && newAccount && (username != newAccount)) {//修改了账号 回到登陆页面
					setTimeout(function () {
						window.location.href = "./loginout"
					}, 1000)
				}
			},
			error: function () {
				alert("修改个人资料失败，请与系统管理员联系！");
				Mo.Base.throttle.unLock(url);
			}
		});
	},
	portraitSave: function () {
		var url = BP.config.SYSTEM_URL + "/system/user/confirmPortrait";
		if (Mo.Base.throttle.isLock(url)) {
			return false;
		}
		Mo.Base.throttle.lock(url);

		var selection_str = $("#selection").val();
		if (!selection_str) {
			alert("请先选择图片");
			Mo.Base.throttle.unLock(url);
			return false;
		}

		var selection = JSON.parse(selection_str);
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
					Mo.alert("头像修改成功", function () {
						Mo.Set.loadPage(msg.data);
					});
				} else {
					alert(msg.description);
				}
				Mo.Base.throttle.unLock(url);
			},
			error: function () {
				alert("头像修改失败");
				Mo.Base.throttle.unLock(url);
			}
		});
	},
	loadPage: function (data) {
		SSO.common.initPortrait(data.portraitUrl40, window.portraitDomain);
	},
	passwordSave: function () {
		var url = BP.config.SYSTEM_URL + "/system/user/updatepassword";
		var securityPolicyObj = { "弱": 1, "中": 2, "强": 3 };
		var newPasswordStrength = securityPolicyObj[$(".newPasswordTip .tip-info").text()];
		if (passwordStrengthOfSecurityPolicy != "") {
			if (newPasswordStrength < passwordStrengthOfSecurityPolicy) {
				if (passwordStrengthOfSecurityPolicy == 3) {
					Mo.alert("密码等级必须为强");
				}
				if (passwordStrengthOfSecurityPolicy == 2) {
					Mo.alert("密码等级至少为中");
				}
				if (passwordStrengthOfSecurityPolicy == 1) {
					Mo.alert("密码等级至少为弱");
				}
				return;
			}
		} else {
			Mo.alert("未获取到用户密码等级强度");
			return;
		}
		if (Mo.Base.throttle.isLock(url)) {
			return false;
		}
		Mo.Base.throttle.lock(url);
		var data = {
			moid: $("#moid").val(),
			oldPassword: $.trim($("#oldPassword").val()),
			newPassword: $.trim($("#newPassword").val()),
			confirmPassword: $.trim($("#confirmPassword").val())
		};

		if ('' == $.trim(data.oldPassword)) {
			alert("请输入当前密码。");
			$("#oldPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		if ('' == $.trim(data.newPassword)) {
			alert("请输入新密码");
			$("#newPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}

		if ('' == $.trim(data.confirmPassword)) {
			alert("请输入确认密码");
			$("#confirmPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		if (data.newPassword.length > 32 || !SSO.Base.validation.isRegExp(regexEnum.password, data.newPassword)) {
			alert('密码由1-32个字符组成，支持字母大小写、数字、"_"、"."(不包括空格)');
			$("#newPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		};

		if ($.trim(data.oldPassword) == $.trim(data.newPassword)) {
			alert("新密码不能与旧密码一致");
			$("#newPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		if ($.trim(data.newPassword) != $.trim(data.confirmPassword)) {
			alert("新密码、确认密码不一致，请确认后重新输入。");
			$("#confirmPassword").focus();
			Mo.Base.throttle.unLock(url);
			return false;
		}
		var cdata = {};
		if ('1' == systemSecurity) {
			cdata = Mo.Base.DigestAuth.makePassword(data.oldPassword, data.newPassword);
		} else {
			cdata = Mo.Base.DigestAuth.makePassword(hex_md5(data.oldPassword), data.newPassword);
			var params = Mo.Base.DigestAuth.makePassword(hex_md5(data.oldPassword), data.oldPassword);
			cdata['key'] = params['knonce'] + '_' + params['ciphertext'] + '_' + params['hmac'];
		}
		$.ajax({
			type: 'post',
			url: url,
			data: cdata,
			dataType: 'json',
			success: function (msg) {
				if (msg.success) {
					Mo.Form.store.reset();
					alert("密码修改成功，请重新登录。", function () {
						location.href = BP.config.SYSTEM_URL + "/loginout";
					});
				} else {
					alert(msg.description);
				}
				Mo.Base.throttle.unLock(url);
			},
			error: function () {
				alert("密码修改失败");
				Mo.Base.throttle.unLock(url);
			}
		});
	},
	gmtSave: function () {
		alert("时区Build3实现");
	},

	languageSave: function () {
		alert("语言包Build3实现");
	},

	getHash: function () {
		var hash;
		hash = (!window.location.hash) ? "#perfile" : window.location.hash;
		return hash.substring(1, hash.length);
	},
	//选项卡切换
	initTab: function () {
		var hash = this.getHash();
		this.activeTab("." + hash);
		var that = this;
		$(".tab-item").click(function () {
			return that.activeTab(this);
		});
		$(".nav-tab-item").click(function () {
			return that.activeTab($(this).attr("href").replace("set#", "."));
		});
	},
	activeTab: function (tab) { //tab = .password
		let username = "jihuiqin";
		if (tab == '.profile') {
			this.profileHref = true;
		}
		var name = $(tab).data("tab"); //name=password  注意多类选择器的问题
		var userMoids = $("#moid").val();
		var newAccount = $('#account .base-input').val();
		if (name == 'password') {
			if (username && newAccount && (username != newAccount)) {//修改了账号
				if ($('.bmc-accountInput-edit').css("display") == "none") {//是编辑状态
					alert('账号已修改，请先确认新账号');
					return false;
				}
			}
		}
		if (this.before(name)) {
			Mo.Set.change.show(name);
			return false;
		}
		if (name == 'password') {//切换至修改密码时 个人信息中账号要还原至原状态
			Mo.updataAccount.accountInput.setValue(username);
			Mo.updataAccount.accountInput.setReadonly();//账号设置只读状态
		} else if (name == 'profile') {
			Mo.updataAccount.init();
		}
		if (userMoids == 'mooooooo-oooo-oooo-oooo-defaultadmin') {
			var _this = this;
			if (name == 'password') {
				$(".tipPass").show();
				// Moo.alert('密码修改后，请牢记新密码！'+'<br/>'+'未配置邮箱将密码丢失后无法找回，需返厂进行初始化。',function(){
				//     $(".showTip").show();
				// },'重置密码','取消')
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

		// if(this.before(name)){
		// 	Mo.Set.change.show(name);
		// 	return false;
		// }

		$(".tab-item").removeClass("active");
		$(tab).addClass("active");
		$("form").hide();
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
		Mo.Form.store.set(name);
		/*Mo.SetFrame.loadPassword();*/
	},

	getTabName: function () {
		return $(".tab-item.active").data("tab");
	},

	dialog: null,
	before: function (name) {
		return Mo.Form.store.isChange();
	}
}

$.namespace("Mo.Set.change")
Mo.Set.change = {
	init: function () {
		this.initEvent();
	},
	name: null,
	initEvent: function () {
		var that = this;
		//取消
		$(".w-close", "#changeWrapper").on("click", function () {
			that.close();
			Mo.Form.store.reset();
			Mo.Set.activeTab("." + that.name);
		});
		$(".cancel", "#changeWrapper").on("click", function () {
			that.close();
			Mo.Form.store.reset();
			Mo.Set.activeTab("." + that.name);
		});

		$(".save", "#changeWrapper").on("click", function () {
			that.close();
			Mo.Set.save();
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
};

$.namespace("Mo.Form.store")
Mo.Form.store = {
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
			$("." + this.lastKey + "-form").html(Mo.Form.store.storePass)
		} else {
			$("." + this.lastKey + "-form").html(this.storeH[this.lastKey]);
		}
		Mo.Password.init(options);
		Mo.Password.capitalTip("oldPassword")
		Mo.Password.capitalTip("newPassword")
		Mo.Password.capitalTip("confirmPassword");
	},
	set: function (name) {
		this.lastKey = name;
		this.store[name] = this.getSerialize(name);
		this.storeH[name] = this.getHtml(name);

	},
	isChange: function (name) {
		if (this.lastKey == null) {
			return false;
		}
		return this.store[this.lastKey] != this.getSerialize(this.lastKey);
	}
}
