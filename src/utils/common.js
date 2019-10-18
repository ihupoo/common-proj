/**
 * 工具
 * 
 * */
const Common = {
	init: function () {
		this.regEvent();
		ModifyPassword.init();
		ModifyUser.init();
		ModifyPortait.init();
	},
	headerEvent: function () {
		$(".li").on("mouseover", function () {
			$(".li-a", $(this)).toggleClass("hover");
			$(".check-hook", $(this)).toggleClass("hover");
		})
		$(".public-private-cloud-content").on('click', function (e) {
			$(".public-private-cloud").toggle(0, function () {
				$(".cloud-name").toggleClass("active");
				$(".arrow").toggleClass("active");
			});
			if (e.stopPropagation)
				e.stopPropagation();
			else
				e.cancelBubble = true;

			let id = $.trim($(".cloud-name").attr("value"));
			$(".check-hook").removeClass("active");
			$("#" + id).addClass("active");
		})
		$(".setting").on("click", function (e) {
			if ($(this).hasClass('disabled')) {
				return
			}
			$("#nav-sublist-notify").removeClass("hover");
			$(".setting-list").toggle();
			if (e.stopPropagation)
				e.stopPropagation();
			else
				e.cancelBubble = true;
		})

		$(document).on("click", function () {
			$(".setting-list").hide();
			$(".public-private-cloud").hide(0, function () {
				$(".cloud-name").removeClass("active");
				$(".arrow").removeClass("active");
			});
		});

		$("#modifyUser").on("click", function () {
			$(".setting-list").hide();
			location.href = BP.config.SYSTEM_URL + "/set#profile";
		});

		$("#modifyPassword").on("click", function () {
			$(".setting-list").hide();
			location.href = BP.config.SYSTEM_URL + "/set#password";
		});
		$("#gmt").on("click", function () {
			$(".setting-list").hide();
			location.href = BP.config.SYSTEM_URL + "/set#gmt";
		});
		$("#language").on("click", function () {
			$(".setting-list").hide();
			location.href = BP.config.SYSTEM_URL + "/set#language";
		});
		$("#modifyPortrait").on("click", function () {
			$(".setting-list").hide();
			location.href = BP.config.SYSTEM_URL + "/set#portrait";
		});
		$("#about").on("click", function () {
			$(".setting-list").hide();
			$.dialog({
				padding: 0,
				id: "aboutWindow",
				content: document.getElementById('aboutWrapper'),
				lock: true,
				opacity: 0.50,	// 透明度
				cancel: false, // 隐藏关闭按钮
				drag: false // 不允许拖拽
			});
		});

		//取消
		$(".w-close", "#aboutWrapper").on("click", function () {
			$.dialog({ id: 'aboutWindow' }).close();
		});
	},
	regEvent: function () {
		let that = this;
		let t;
		let count = $(".menu-long a:visible").length;
		if (count > 5) {
			$(".a_right").css({ visibility: 'visible' });
		}
		$(".menu-long").css({ width: count * 165 });
	},
	initFooter: function () {
		let bh = $("body").height();
		let wh = $(window).height();
		if (bh > wh) {
			$("#footer").css({ "position": "relative", "margin": "30px 0 0 0" });
			$("#wrap").css("padding", 0);
		} else {
			$("#footer").css({ "position": "fixed", "margin": "0" });
			$("#wrap").css("padding", "0 0 60px 0");
		}
	},
	initPortrait: function (portrait, portraitDomain) {
		if (!portrait) {
			portrait = Mo.Config.appUrl + '/static/images/avator.png?v=1';
		} else if (portraitDomain) {
			portrait = '//' + portraitDomain + '/' + portrait;
		}
		let $userPortrait = $('.user-info .user-portrait');
		$userPortrait.on('load', function () {
			$(this).removeClass('hidden');
		});
		$userPortrait.attr('src', portrait);
	},
	setDefaultImg: function (parent) {
		parent = parent || "";
		$(parent + " img[data-onerror]").each(function (i) {
			$(this).on("error", function () {
				$(this).attr("src", $(this).attr("data-onerror"));
			})
		})
	}
};

//修改用户信息
const ModifyUser = {
	init: function () {
		this.initEvent();
	},
	initEvent: function () {
		let that = this;
		$("#modifyUser").on("click", function () {
			$.dialog({
				padding: 0,
				id: "modifyUserWindow",
				lock: true,
				title: "",
				opacity: 0.50,	// 透明度
				content: document.getElementById('modifyUserWrapper'),
				close: function () {//关闭清空数据
					that.hideMsg();
					//					$("#account").val($("#oldAccount").val());
					$("#mobile").val($("#oldMobile").val());
					$("#email").val($("#oldEmail").val());
					$("#officeLocation").val($("#oldOfficeLocation").val());
				},
				cancel: false, // 隐藏关闭按钮
				drag: false // 不允许拖拽
			});
		});
		//绑定按钮
		$(".confirm", "#modifyUserWrapper").on("click", function () {
			that.hideMsg();
			let data = that.checkData();
			if (false == data) {
				return false;
			}
			///////////标记ajax：修改用户信息////////////
			$.ajax({
				type: 'post',
				//url: BP.config.SYSTEM_URL + "/system/user/updateuser",
				data: data,
				dataType: 'json',
				success: function (msg) {
					if (msg.success) {
						$("#oldAccount").val($("#account").val());
						$("#oldMobile").val($("#mobile").val());
						$("#oldEmail").val($("#email").val());
						$("#oldOfficeLocation").val($("#officeLocation").val());
					}
					that.close();
					alert(msg.description);
				},
				error: function () {
					that.showMsg("修改个人资料失败，请与系统管理员联系！");
				}
			});
		});
		//关闭
		$(".W_close", "#modifyUserWrapper").on("click", function () {
			that.close();
		});

		//取消
		$(".cancel", "#modifyUserWrapper").on("click", function () {
			that.close();
		});
	},
	close: function () {
		$.dialog({ id: 'modifyUserWindow' }).close();
	},
	//验证
	checkData: function () {
		let data = {
			mobile: $.trim($("#mobile").val()),
			email: $.trim($("#email").val()),
			seat: $.trim($("#officeLocation").val()),
			moid: $.trim($("#moid").val())
		};

		if (data.mobile && !Validation.checkValue(regexEnum.mobile, data.mobile)) {
			this.showMsg('请输入11位数字的手机号码'); //this.showMsg('手机长度不超过15,只允许输入"数字、.、_、-、*、#、空格"');
			$("#mobile").focus();
			return false;
		}

		if (data.email && !Validation.checkValue(regexEnum.email, data.email)) {
			this.showMsg("请输入正确的邮箱地址");
			$("#email").focus();
			return false;
		}

		if (data.email && !Validation.checkLength(data.email, 64)) {
			this.showMsg("邮箱地址长度不能大于64位字符");
			$("#email").focus();
			return false;
		}

		if (data.seat && !Validation.checkLength(data.seat, 60)) {
			this.showMsg("请输入联系地址长度不超过60");
			$("#officeLocation").focus();
			return false;
		}

		return data;
	},
	showMsg: function (msg) {
		$(".msg", "#modifyUserWrapper").text(msg);
		$(".item-msg", "#modifyUserWrapper").show();
	},
	hideMsg: function () {
		$(".item-msg", "#modifyUserWrapper").hide();
		$(".msg", "#modifyUserWrapper").text('');
	}
};

//修改密码
const ModifyPassword = {
	init: function () {
		this.initEvent();
	},
	initEvent: function () {
		let that = this;
		$("#modifyPassword").on("click", function () {
			$.dialog({
				padding: 0,
				id: "modifyPasswordWindow",
				lock: true,
				opacity: 0.50,	// 透明度
				title: "",
				content: document.getElementById('modifyPasswordWrapper'),
				close: function () {//关闭清空数据
					$("#oldPassword").val("");
					$("#newPassword").val("");
					$("#confirmPassword").val("");
					that.hideMsg();
				},
				cancel: false, // 隐藏关闭按钮
				drag: false // 不允许拖拽
			});
		});
		//绑定按钮
		$(".confirm", "#modifyPasswordWrapper").on("click", function () {
			that.hideMsg();
			let data = that.checkData();
			if (data == false) {
				return false;
			}
			////////////标记ajax：修改密码////////////////////
			$.ajax({
				type: 'post',
				//url: BP.config.SYSTEM_URL + "/system/user/updatepassword",
				data: data,
				dataType: 'json',
				success: function (msg) {
					if (msg.success) {
						that.close();
						alert(msg.description);
					} else {
						$("#oldPassword").val("");
						$("#newPassword").val("");
						$("#confirmPassword").val("");
						that.showMsg(msg.description);
					}
				}
			});
		});
		//取消
		$(".W_close", "#modifyPasswordWrapper").on("click", function () {
			that.close();
		});
		//取消
		$(".cancel", "#modifyPasswordWrapper").on("click", function () {
			that.close();
		});
	},
	close: function () {
		$.dialog({ id: 'modifyPasswordWindow' }).close();
	},
	checkData: function () {
		let data = {
			moid: $("#moid").val(),
			oldPassword: $.trim($("#oldPassword").val()),
			newPassword: $.trim($("#newPassword").val()),
			confirmPassword: $.trim($("#confirmPassword").val())
		};
		if ('' == $.trim(data.oldPassword)) {
			this.showMsg("当前密码不能为空，请输入当前密码。");
			$("#oldPassword").focus();
			return false;
		}
		if ('' == $.trim(data.newPassword)) {
			this.showMsg("新密码不能为空，请输入新密码。");
			$("#newPassword").focus();
			return false;
		}

		if (data.newPassword && !Validation.checkValue(regexEnum.password, data.newPassword)) {
			this.showMsg('密码仅支持大小写字母、数字、"_"、"."');
			$("#newPassword").focus();
			return false;
		}

		if (data.newPassword && !Validation.checkLength(data.newPassword, 32)) {
			this.showMsg('密码长度不能大于32位字符');
			$("#newPassword").focus();
			return false;
		}


		if ($.trim(data.oldPassword) == $.trim(data.newPassword)) {
			this.showMsg("新密码不能与旧密码一致");
			$("#newPassword").focus();
			return false;
		}
		if ($.trim(data.newPassword) != $.trim(data.confirmPassword)) {
			this.showMsg("两次输入密码不一致，请重新输入。");
			$("#confirmPassword").focus();
			return false;
		}

		return data;
	},
	showMsg: function (msg) {
		$(".msg", "#modifyPasswordWrapper").text(msg);
		$(".item-msg", "#modifyPasswordWrapper").show();
	},
	hideMsg: function () {
		$(".item-msg", "#modifyPasswordWrapper").hide();
		$(".msg", "#modifyPasswordWrapper").text('');
	}
};

//设置头像
const ModifyPortait = {
	reg: /(jpg|jpeg|JPG|JPEG|png|gif|bmp)$/,
	proportion: 1,
	minXY: 0,
	_X: 0,   //原始宽度
	_Y: 0,	//原始长度
	fileName: "",//上传后的文件名称
	//url: BP.config.SYSTEM_URL + "/system/user/uploadPortrait",
	init: function () {
		this.initEvent();
		this.initUpLoad();
	},
	initEvent: function () {
		let that = this;
		$("#modifyPortait").on("click", function () {
			$.dialog({
				padding: 0,
				id: "modifyPortaitWindow",
				lock: true,
				opacity: 0.50,	// 透明度
				title: "",
				content: document.getElementById('modifyUserPortaitWrapper'),
				close: function () {
				},
				cancel: false, // 隐藏关闭按钮
				drag: false // 不允许拖拽
			});
		});
		//绑定按钮
		$(".W_close", "#modifyUserPortaitWrapper").on("click", function () {
			that.close();
		});
		//取消
		$(".cancel", "#modifyUserPortaitWrapper").on("click", function () {
			that.close();
		});
	},
	initUpLoad: function () {
		this.uploader = new qq.FileUploader({
			action: this.url,
			element: $('#file-uploader')[0],
			multiple: false,
			debug: false,
			//处理函数
			onSubmit: this.onSubmit,
			onProgress: this.onProgress,
			onComplete: this.onComplete,
			onCancel: function (id, fileName) { },
			showMessage: function (message) { }
		});
		$(".qq-upload-list").addClass("hidden");
	},
	onSubmit: function (id, fileName) {
		if (!(fileName && ModifyPortait.reg.test(fileName.toLowerCase()))) {
			alert('仅支持JPG、PNG、GIF、BMP图片文件');
			return false;
		}
		if (Throttle.isLock(this.url)) {
			return false;
		}
		Throttle.lock(this.url);
	},
	onProgress: function (id, fileName, loaded, total) {
		$(".img_span").text("图片正在上传中...");
	},
	onComplete: function (id, fileName, msg) {
		if (msg.success) {
			$("#img_side_320").attr("src", BP.config.SYSTEM_URL + "/" + msg.data + "?t=" + Math.random());
			$(".preview_div").find("img").attr("src", BP.config.SYSTEM_URL + "/" + msg.data + "?t=" + Math.random());
			ModifyPortait.setFileName(msg.data);
			ModifyPortait.setXY(msg.data);
			let length = 0;
			document.getElementById("img_side_320").onload = function () {
				length = SelectImage.getSelectLength();
				SelectImage.qietuInit(length);
			}
		} else {
			alert(msg.description);
		}
		$(".img_span").addClass("hidden");
		Throttle.unLock(this.url);
	},
	setFileName: function (url) {
		let arr = url.split("/");
		let file = arr[arr.length - 1];
		arr = file.split("?");
		this.fileName = arr[0];
		$("#fileName").val(arr[0]);
	},
	setXY: function (url) {
		$("#img_side_320").css("width", "");
		$("#img_side_320").css("height", "");
		let arr = url.split("?xy=");
		if (arr.length < 2) return;

		let arrXY = arr[arr.length - 1].split("_");
		let x = parseInt(arrXY[0]);
		let y = parseInt(arrXY[1]);
		this.proportion = 1;
		if (x >= y) {
			if (x > 320) {
				$("#img_side_320").css("width", "320px");
				$("#img_side_320").css("height", "");
				let multipleNum = x / 320;
				this.proportion = Math.floor(multipleNum * 100) / 100;
			}
		} else {
			if (y > 320) {
				$("#img_side_320").css("width", "");
				$("#img_side_320").css("height", "320px");
				let multipleNum = y / 320;
				this.proportion = Math.floor(multipleNum * 100) / 100;
			}
		}
		if (x > y) this.minXY = y;
		else this.minXY = x;

		this._X = x;
		this._Y = y;

	},
	close: function () {
		$.dialog({ id: 'modifyPortaitWindow' }).close();
	}
};

//图片剪切
const SelectImage = {
	getSelectLength: function () {
		let length = $("#img_side_320").width() < $("#img_side_320").height() ? $("#img_side_320").width() : $("#img_side_320").height();
		return length;
	},

	qietuInit: function (length) {
		//构造imgAreaSelectApi
		let imgAreaSelectApi = $('#img_side_320').imgAreaSelect({
			persistent: true,	// true，选区以外点击不会启用一个新选区（只能移动/调整现有选区）
			instance: true,	// true，返回一个imgAreaSelect绑定到的图像的实例，可以使用api方法
			onSelectChange: this.preview_img,	// 改变选区时的回调函数
			show: true,	// 选区会显示
			handles: true,	// true，调整手柄则会显示在选择区域内
			resizable: true,	// true， 选区面积可调整大小
			minWidth: Math.floor(20),	// 选取的最小宽度
			minHeight: Math.floor(20),	// 选取的最小高度
			aspectRatio: '1:1'	// 选区的显示比率 400:300
		});
		imgAreaSelectApi.setSelection(0, 0, length, length);
		imgAreaSelectApi.update();
		let xx = {};
		xx.width = length;
		xx.height = length;
		this.preview_img("", xx);
	},
	preview_img: function (img, selection) {
		let param = {};
		param.x1 = parseInt(selection.x1 * ModifyPortait.proportion);
		param.y1 = parseInt(selection.y1 * ModifyPortait.proportion);
		param.width = parseInt(selection.width * ModifyPortait.proportion);
		param.height = parseInt(selection.height * ModifyPortait.proportion);
		$("#selection").val(JSON.stringify(param));
		SelectImage.preview_photo(selection, ".side_256");
		SelectImage.preview_photo(selection, ".side_128");
		SelectImage.preview_photo(selection, ".side_64");
		SelectImage.preview_photo(selection, ".side_32");
	},
	preview_photo: function (selection, item) {
		let div = $(item);
		//获取div的宽度与高度
		let width = div.outerWidth();
		let height = div.outerHeight();

		//显示区域与选区图片比例 宽度之比，高度之比
		//获取比例的用处是：
		//当选区的图片大于显示区域时，要相应的缩写图片。
		//当选区的图片小于显示区域时，要相应的放大图片。
		//selection的宽高之比是4:3,div的宽高之比也是4:3 
		//scaleX scaleY之比为1:1
		let scaleX = width / selection.width;
		let scaleY = height / selection.height;

		//css 控制图片的缩放以及偏移量
		//width height 控制img区域的大小，如果只做他俩的限定可以实现图片的缩放
		//但是有一点缺陷，width height大于div的outerWidth outerHeight时，图片显示不完全
		//由此我们要引入偏移量 marginLeft marginTop 显示出来的就是局部缩放
		$(item).find('img').css({
			width: Math.round(scaleX * $('#img_side_320').outerWidth()) + 'px',
			height: Math.round(scaleY * $('#img_side_320').outerHeight()) + 'px',
			marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
			marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
		});
	}
}

$(function () {
	//全局对象MessageBox
	let orgAlert = window.alert;
	window.alert = function (msg, callback) {
		if (window.top.MoMessageBox1) {
			if (window.top.g_msgbox && window.top.g_msgbox.isvisible()) {
				let dialogCount = window.momsgboxCount || 0;
				let msgbox = new window.top.MoMessageBox1({ id: 'mo-msgbox-dialog-' + dialogCount, autodestroy: true });
				window.momsgboxCount = dialogCount + 1;
				msgbox.alert(msg, '提示', callback);
			} else {
				window.top.g_msgbox = window.top.g_msgbox || new window.top.MoMessageBox1();
				window.top.g_msgbox.alert(msg, '提示', callback);
			}
		} else {
			orgAlert(msg);
		}
	}
});

const MoAlert = function (msg, callback) {
	if (window.top.g_msgbox && window.top.g_msgbox.isvisible()) {
		let dialogCount = window.momsgboxCount || 0;
		let msgbox = new window.top.MoMessageBox1({ id: 'mo-msgbox-dialog-' + dialogCount, autodestroy: true });
		window.momsgboxCount = dialogCount + 1;
		msgbox.alert(msg, '提示', callback);
	} else {
		window.top.g_msgbox = window.top.g_msgbox || new window.top.MoMessageBox1();
		window.top.g_msgbox.alert(msg, '提示', callback);
	}
}

const MoConfirm = function (msg, callback, title) {
	if (!!!title) {
		title = '提示';
	}
	if (window.top.confirm_msgbox && window.top.confirm_msgbox.isvisible()) {
		let dialogCount = window.momsgboxCount || 0;
		let msgbox = new window.top.MoMessageBox1({ id: 'mo-msgbox-dialog-' + dialogCount, autodestroy: true });
		window.momsgboxCount = dialogCount + 1;
		msgbox.confirm(msg, title, callback);
	} else {
		window.top.confirm_msgbox = window.top.comfrim_msgbox || new window.top.MoMessageBox1();
		window.top.confirm_msgbox.confirm(msg, title, callback);
	}

}

const MooAlert = function (msg, callback, okText, cancelText) {
	if (window.top.g_msgbox1 && window.top.g_msgbox1.isvisible()) {
		let dialogCount = window.momsgboxCount1 || 0;
		let msgbox1 = new window.top.MoMessageBox1({ id: 'mo-msgbox-dialog-' + dialogCount, autodestroy: true });
		window.momsgboxCount1 = dialogCount + 1;
		msgbox1.alert(msg, '提示', okText, cancelText);
	} else {
		window.top.g_msgbox1 = window.top.g_msgbox1 || new window.top.MoMessageBox1();
		window.top.g_msgbox1.alert(msg, '提示', callback, okText, cancelText);
	}
}

const MooConfirm = function (msg, callback, okText, cancelText) {
	if (window.top.confirm_msgbox1 && window.top.confirm_msgbox1.isvisible()) {
		let dialogCount = window.momsgboxCount1 || 0;
		let msgbox = new window.top.MoMessageBox1({ id: 'mo-msgbox-dialog-' + dialogCount, autodestroy: true });
		window.momsgboxCount1 = dialogCount + 1;
		msgbox.confirm(msg, '提示', callback, okText, cancelText);
	} else {
		window.top.confirm_msgbox1 = window.top.comfrim_msgbox1 || new window.top.MoMessageBox1();
		window.top.confirm_msgbox1.confirm(msg, '提示', callback, okText, cancelText);
	}
};

const MoCommon = {
	logininit: function (data) {
		let loginHeaderHtml = template('loginheader', data);
		document.getElementById('login_header').innerHTML = loginHeaderHtml;
		/* 渲染底部信息 */
		let lodinFooterHtml = template('enterprise_introduce', data);
		document.getElementById('footer').innerHTML = lodinFooterHtml;

		document.title = data.title;
	},
	homeInit: function (data) {
		document.title = data.title;
		let headerHtml = template('logo', data);
		document.getElementById('header_title_logo').innerHTML = headerHtml;
	},
	aboutInit: function (data) {
		let aboutHtml = template('company_info', Mo.CompanyInfo);
		document.getElementById('about_info').innerHTML = aboutHtml;
	},

};

const MoBaseAccount = {
	getPasswordStrength: function (pwd) {
		if (!!!pwd && '0' != pwd)
			return "fault";
		let strengthRegular = strengthRegular;// 默认获取当前页面
		let max = 8;// 寻找上级页面密码强认证规则
		for (let i = 0; i < max; i++) {
			if (!!!strengthRegular) {
				strengthRegular = window.parent.strengthRegular;
			} else {
				break;
			}
		}
		if (!!strengthRegular) {
			let checkArr = ['3', '2', '1'];// 校验顺序 强 中 弱
			for (let i = 0; i < checkArr.length; i++) {
				let strength = checkArr[i];
				if (!!strengthRegular[strength] && !!(eval('/' + strengthRegular[strength] + '/').test(pwd))) {
					if (strength == '2') {
						return "medium";
					} else if (strength == '3') {
						return "strong";
					} else if (strength == '1') {
						return "weak";
					} else {
						return "fault";
					}
				}
			}
		} else {
			console.error("密码强认证规则获取失败");
		}
		return "fault";
	},
	checkAccount: function (value) {
		if (Validation.isAllNumber(value)) {//账号的检验 新增该规则（不可以纯数字）
			alert('账号不允许纯数字');
			return false;
		}
		if (!Validation.isRegExp(regexEnum.account, value)) {
			alert('账号仅允许输入英文、数字、汉字、下划线（_）、减号（-）、@、点号（.）且首尾字符仅允许英文、数字、汉字');
			return false;
		}
		if (!Validation.checkLength(value, 40)) {
			alert('账号长度不能大于40位字符');
			return false;
		}
		return true;
	},
	checkPassword: function (value) {

		if (!Validation.checkValue(regexEnum.password, value)) {
			alert("密码仅支持大小写字母、数字、'_'、'.'，请确认后重新输入。");
			return false;
		}
		if (!Validation.checkLength(value, 32)) {
			alert('密码长度不能大于32位字符');
			return false;
		}
		return true;
	}
};

$(document).ajaxComplete(function (event, xhr, options) {
	if (xhr.responseJSON && xhr.responseJSON.errorCode && (xhr.responseJSON.errorCode == "100012" || xhr.responseJSON.errorCode == "100011" || xhr.responseJSON.errorCode == "100010" || xhr.responseJSON.errorCode == "100013")) {
		top.location.href = Mo.Config.appUrl + "/login";
	}
})

const MoTips = {
	show: function (text, callback, time) {
		if (callback && typeof callback == "function") {
			callback();
		}
		let height = $(window).height();
		let width = $(window).width();
		let htmlText = text || "操作成功";
		let el = document.getElementsByTagName("body");
		let maskBox = '<div class="success-datagrid-maskBox" style="width:' + width + 'px;height:' + height + 'px;position: fixed;top:0;left: 0; background: #000; opacity: 0.2;"></div>';
		let mask = '<div class="success-datagrid-mask" style="min-width:148px;text-align:center;z-index:100;font-size:14px;position: absolute;display: inline-block;padding: 14px 20px;' +
			'left: 43%;bottom: 121px;background: #434343;color: #fff;">' + htmlText + '</div>';
		$(el).append(mask)
		$(el).append(maskBox)
		setTimeout(function () {
			$(el).find('.success-datagrid-maskBox').remove();
			$(el).find('.success-datagrid-mask').remove();
		}, time || 1500)
	}
}

const Size = {
	init: function () {
		var height = $(window).height() - 185;
		$(".content").css("min-height", height);
		$(window).resize(function () {
			SSO.Size.experirdpageInit();
		})
	},

	experirdpageInit: function () {
		var wrapMinHeight = 650;
		var winHeight = $(window).height();
		var wrapHeight = winHeight > wrapMinHeight ? winHeight : wrapMinHeight;
		var wrapAllHeight = wrapHeight - $("#footer").outerHeight();
		$(".wrap").height(wrapHeight)
		$(".wrap-all").height(wrapAllHeight)
	}
}

export { Size, Common, MoAlert, MoConfirm, MoTips, MoCommon, MoBaseAccount, MooAlert, MooConfirm, ModifyUser, ModifyPassword, ModifyPortait, SelectImage }




