import { DigestAuth } from '@/utils/digestAuth'
import { Password } from '@/utils/password'
import { Validation, Throttle } from '@/utils/utils'
import { MoAlert } from '@/components/popup'
import { Size, Common } from '@/utils/common'
import Store from '@/store/index';
import TemplateHeader from '@/components/tpl/header';

import '@/lib/artDialog'
import '@/lib/portal'

let { username, securityPolicy, editName } = Store.getState('user');

const PlatSetFrame = {
	default_detail_paddingTop: 0, // 默认详细表单顶部偏移量
	default_detail_paddingLeft: 0, // 默认详细表单左边偏移量
	main_min_width: 1280,
	main_padding_left: 128,
	main_min_height: 650,
	main_padding_bottom: 83,
	main_top_height: 98,
	fixLineHeight: 2,

	loadPlatSet: function () {
		let wH = $(window).height();
		let innerHeight = wH - this.main_top_height - this.main_padding_bottom;
		let viewHeight = innerHeight - (this.fixLineHeight * 2) - 80;
		$(".set-content").css("min-height", viewHeight);
		if ('password' == $(".tabs .active").attr("data-tab")) {
			$("#detail-btn-save").addClass('disabled');
		} else {
			$("#detail-btn-save").removeClass('disabled');
		}
	},
}

const PlatUpdataAccount = {
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
		this.accountInput = Portal.AccountInput("#account", {
			label: '账号',
			labelWidth: 120,
			value: username,
			require: true,
			readonly: true,
			name: 'account',
			placeholder: '请输入账号',
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

const PlatSet = {
	profileHref: false,//记录是否从个人设置tab标签页进入的密码修改页面 默认false
	dialog: null,
	init: function () {
		PlatFormStore.storePass = $(".password-form").html()
		this.initEvent();
		this.initTab();
		PlatSetChange.init();
		Size.init();
	},
	initEvent: function () {

		$("#detail-btn-cancel").on("click", function () {
			location.href = Store.getState('BASE_URL') + "/home";
		});
		$("#detail-btn-save").on("click", function () {
			if (!($("#detail-btn-save").hasClass("disabled"))) {
				PlatSet.save();
			}
		});
		$(".tab-item").on("click", function () {
			if ('password' == $(this).attr("data-tab")) {
				$("#detail-btn-save").addClass('disabled');
			} else {
				$("#detail-btn-save").removeClass('disabled');
			}
		});
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
	getProfileData: function () {
		let newAccount = $('#account .base-input').val();
		let account = "";//超管传
		if (DigestAuth.username == 'mooooooo-oooo-oooo-oooo-defaultadmin') {//超管
			if (username && newAccount && (username != newAccount)) {//并修改了账号
				account = newAccount
			}
		}
		let data = {
			moid: $("#moid").val(),
			account: account,
			name: $.trim($("#username").val()),
			email: $.trim($("#email").val()),
			mobile: $.trim($("#mobile").val()),
			extNum: $.trim($("#extNum").val()),
			extNum1: $.trim($("#extNum1").val()),
			extNum2: $.trim($("#extNum2").val()),
			extNum3: $.trim($("#extNum3").val()),
			sex: $('input:radio[name=sex]:checked').val(),
			birthday: $('#birthday').datebox('getValue'),
			fax: $.trim($("#fax").val()),
			seat: $.trim($("#seat").val())
		};
		//校验用户账号
		if (newAccount == "") {
			MoAlert('请输入账号', function () {
				$('#account .base-input').focus();
			});
			return false;
		}
		//校验用户姓名
		if (editName) {
			if (data.name == "") {
				MoAlert('请输入姓名', function () {
					$('#name').focus();
				});
				return false;
			}
		}
		if (data.name.match(/\<|\>|"|'|\/|\\/ig)) {
			MoAlert('姓名不能包含敏感字符 >\'<\"\\\/', function () {
				$('#name').focus();
			});
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

		if (data.mobile && !Validation.check('mobile', data.mobile)) {
			// MoAlert('手机长度不超过15,只允许输入"数字、.、_、-、*、#、空格"');
			MoAlert('请输入11位数字的手机号码');
			$("#mobile").focus();
			return false;
		}
		// 若座机号码不为空则校验座机号码
		if (data.extNum1 && !Validation.isUnsignedInteger(data.extNum1)) {
			MoAlert("区号-电话-分机只能为数字");
			$('#extNum1').focus();
			return false;
		}
		if (data.extNum2 && !Validation.isUnsignedInteger(data.extNum2)) {
			MoAlert("区号-电话-分机只能为数字");
			$('#extNum2').focus();
			return false;
		}
		if (data.extNum3 && !Validation.isUnsignedInteger(data.extNum3)) {
			MoAlert("区号-电话-分机只能为数字");
			$('#extNum3').focus();
			return false;
		}
		data.extNum = data.extNum1 + "-" + data.extNum2 + "-" + data.extNum3;
		data.extNum = data.extNum == "--" ? "" : data.extNum;

		if (data.fax && !Validation.check('fax', data.fax)) {
			MoAlert("传真只能为数字");
			$('#fax').focus();
			return false;
		}
		if (data.seat) {
			if (!(data.seat.match(/^[\u4E00-\u9FA5a-zA-Z0-9_]+$/))) {
				MoAlert('办公位置只能为中英文和数字及下划线组成', function () {
					$('#seat').focus();
				});
				return false;
			}
		}
		return data;
	},
	profileSave: function () {
		let url = Store.getState('BASE_URL') + "/system/user/updatePlatFormUser";
		if (Throttle.isLock(url)) {
			return false;
		}
		Throttle.lock(url);

		let data = this.getProfileData();
		if (!data) {
			Throttle.unLock(url);
			return false;
		}


		$("#moid").attr("value", data.moid);
		$("#username").attr("value", data.name);
		$("#mobile").attr("value", data.mobile);
		$("#email").attr("value", data.email);
		$("#extNum").attr("value", data.extNum);
		$("#extNum1").attr("value", data.extNum1);
		$("#extNum2").attr("value", data.extNum2);
		$("#extNum3").attr("value", data.extNum3);
		$("#birthday").attr("value", data.birthday);
		$("#fax").attr("value", data.fax);
		$("#seat").attr("value", data.seat);


		$.ajax({
			type: 'post',
			url: url,
			data: data,
			dataType: 'json',
			success: function (msg) {
				if (msg.success) {
					PlatFormStore.set("profile");
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
		let url = Store.getState('BASE_URL') + "/system/user/confirmPortrait";
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
						PlatSet.loadPage(msg.data);
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
		TemplateHeader.setPortrait(data.portraitUrl40, window.portraitDomain);
	},
	passwordSave: function () {
		let url = Store.getState('BASE_URL') + "/system/user/updatepassword";
		let securityPolicyObj = { "弱": 1, "中": 2, "强": 3 };
		let newPasswordStrength = securityPolicyObj[$(".newPasswordTip .tip-info").text()];
		let passwordStrengthOfSecurityPolicy = securityPolicy.passwordStrength;
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
			MoAlert("当前密码不能为空，请输入当前密码。");
			$("#oldPassword").focus();
			Throttle.unLock(url);
			return false;
		}
		if ('' == $.trim(data.newPassword)) {
			MoAlert("新密码不能为空，请输入新密码。");
			$("#newPassword").focus();
			Throttle.unLock(url);
			return false;
		}

		if (data.newPassword && !Validation.check('password', data.newPassword)) {
			MoAlert('密码仅支持大小写字母、数字、"_"、"."');
			$("#newPassword").focus();
			Throttle.unLock(url);
			return false;
		}

		if (data.newPassword && !Validation.checkLength(data.newPassword, 32)) {
			MoAlert('密码长度不能大于32位字符');
			$("#newPassword").focus();
			Throttle.unLock(url);
			return false;
		}


		if ($.trim(data.oldPassword) == $.trim(data.newPassword)) {
			MoAlert("新密码不能与旧密码一致");
			$("#newPassword").focus();
			Throttle.unLock(url);
			return false;
		}
		if ($.trim(data.newPassword) != $.trim(data.confirmPassword)) {
			MoAlert("两次输入密码不一致，请重新输入。");
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
					PlatFormStore.reset();
					MoAlert("密码修改成功，请重新登录。", function () {
						location.href = Store.getState('BASE_URL') + "/loginout";
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
		MoAlert("Build3实现");
	},

	languageSave: function () {
		MoAlert("Build3实现");
	},

	getHash: function () {
		let hash;
		hash = (!window.location.hash) ? "#perfile" : window.location.hash;
		return hash.substring(1, hash.length);
	},
	initTab: function () {
		let hash = this.getHash();
		this.activeTab("." + hash);

		let that = this;
		$(".tab-item").on("click", function () {
			return that.activeTab(this);
		})
		$(".nav-tab-item").on("click", function () {
			return that.activeTab($(this).attr("href").replace("set#", "."));
		})
	},
	activeTab: function (tab) {
		if (tab == '.profile') {
			this.profileHref = true;
		}
		let name = $(tab).data("tab");
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
			PlatSetChange.show(name);
			return false;
		}
		if (name == 'password') {//切换至修改密码时 个人信息中账号要还原至原状态
			PlatUpdataAccount.accountInput.setValue(username);
			PlatUpdataAccount.accountInput.setReadonly();//账号设置只读状态
		} else if (name == 'profile') {
			PlatUpdataAccount.init();
		}
		if (userMoids == 'mooooooo-oooo-oooo-oooo-defaultadmin') {
			let _this = this;
			if (name == 'password') {
				$(".tipPass").show();
				// Moo.MoAlert('密码修改后，请牢记新密码！'+'<br/>'+'未配置邮箱将密码丢失后无法找回，需要返厂进行初始化。',function(){
				//  $(".showTip").show();
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
		PlatFormStore.set(name);
	},

	getTabName: function () {
		return $(".tab-item.active").data("tab");
	},

	before: function (name) {
		return PlatFormStore.isChange();
	}
}

const PlatSetChange = {
	name: null,
	init: function () {
		this.initEvent();
	},
	initEvent: function () {
		let that = this;
		//取消
		$(".w-close", "#changeWrapper").on("click", function () {
			that.close();
			PlatFormStore.resetText();
			PlatSet.activeTab("." + that.name);
		});
		$(".cancel", "#changeWrapper").on("click", function () {
			that.close();
			PlatFormStore.resetText();
			PlatSet.activeTab("." + that.name);
		});

		$(".save", "#changeWrapper").on("click", function () {
			that.close();
			PlatSet.save();
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

const PlatFormStore = {
	store: [],
	storeH: [],
	storePass: [],
	lastKey: null,

	getSerialize: function (name) {
		let data_serialize = "";
		if (name == "profile") {
			let data = {
				moid: $("#moid").val(),
				name: $.trim($("#username").val()),
				email: $.trim($("#email").val()),
				mobile: $.trim($("#mobile").val()),
				extNum: $.trim($("#extNum").val()),
				extNum1: $.trim($("#extNum1").val()),
				extNum2: $.trim($("#extNum2").val()),
				extNum3: $.trim($("#extNum3").val()),
				sex: $('input:radio[name=sex]:checked').val(),
				birthday: $('#birthday').datebox('getValue'),
				fax: $.trim($("#fax").val()),
				seat: $.trim($("#seat").val())
			};
			data_serialize = JSON.stringify(data);
		} else {
			data_serialize = $("." + name + "-form").serialize();
		}

		return data_serialize;
	},
	getHtml: function (name) {
		return $("." + name + "-form").html();
	},
	reset: function () {
		if (this.lastKey == "password") {
			$("." + this.lastKey + "-form").html(PlatFormStore.storePass)
		} else {
			$("." + this.lastKey + "-form").html(this.storeH[this.lastKey]);
		}
		let options = {
			strongAuthentication: true,
			checkUsed: true
		}
		Password.init(options);
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
	},
	resetText: function () {
		if (this.lastKey == "profile") {
			let dataStore = JSON.parse(this.store[this.lastKey]);
			$("#username").val(dataStore.name);
			$("#email").val(dataStore.email);
			$("#mobile").val(dataStore.mobile);
			$("#extNum").val(dataStore.extNum);
			$("#extNum1").val(dataStore.extNum1);
			$("#extNum2").val(dataStore.extNum2);
			$("#extNum3").val(dataStore.extNum3);
			if (dataStore.sex == "0") {
				$("#sex_w").click();
			} else {
				$("#sex_m").click();
			}
			$('#birthday').datebox('setValue', dataStore.birthday);
			$("#fax").val(dataStore.fax);
			$("#seat").val(dataStore.seat);
			ExtNum.initExtNum();
		} else {
			this.reset();
		}
	}
}

const ExtNum = {
	init: function () {
		this.tiplabel();
		this.initExtNum();
	},
	tiplabel: function () {
		$("#extNum1").on("focus", function () {
			let dom = $(this);
			let pDom = dom.parent(".extNum_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function () {
			let dom = $(this);
			let val = dom.val();
			if (null == val || "" == val) {
				let pDom = dom.parent(".extNum_input_wrapper");
				$(".tip_label", pDom).show();
			}
		});
		$("#extNum2").on("focus", function () {
			let dom = $(this);
			let pDom = dom.parent(".extNum_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function () {
			let dom = $(this);
			let val = dom.val();
			if (null == val || "" == val) {
				let pDom = dom.parent(".extNum_input_wrapper");
				$(".tip_label", pDom).show();
			}
		});
		$("#extNum3").on("focus", function () {
			let dom = $(this);
			let pDom = dom.parent(".extNum_input_wrapper");
			$(".tip_label", pDom).hide();
		}).on("blur", function () {
			let dom = $(this);
			let val = dom.val();
			if (null == val || "" == val) {
				let pDom = dom.parent(".extNum_input_wrapper");
				$(".tip_label", pDom).show();
			}
		});

		$(".extNum_input_wrapper .tip_label").on("click", function () {
			let dom = $(this);
			let inputDom = dom.prev("input");
			inputDom.focus();
		});
	},

	initExtNum: function () {
		let extNum = $("#extNum").val();
		if (extNum != "" && extNum != null) {
			let parNum = extNum.split("-");
			$("#extNum1").val(parNum[0]);
			$("#extNum2").val(parNum[1]);
			$("#extNum3").val(parNum[2]);
		}

		$(".tip_label").each(function (i, item) {
			let dom = $(this);
			let inputDom = dom.prev("input");
			if (inputDom.val() != null && inputDom.val() != "") {
				dom.hide();
			} else {
				dom.show();
			}
		});
	}

}


export { PlatSetFrame, PlatUpdataAccount, PlatSet, ExtNum }
