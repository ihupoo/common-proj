 /**
 * 工具
 * 
 * */
$.namespace("SSO.utils");
SSO.utils = {
	getSystemUrl:function(url){
		return BP.config.SYSTEM_URL+'/'+url;
	},
	getStaticUrl:function(){
		return BP.config.STATIC_URL;
	},
	getLang:function(){
		return BP.config.LANG;
	}
};

var regexEnum = {
		account:"^[\u4e00-\u9fa5\\w\\.@]+$", // 中文、英文字母（大小写）、数字、“_”、“@”、“.”
		email:"^[\\w][\\w|-]+(\\.[\\w|-]+)*@[\\w|-]+(\\.[\\w|-]+)+$", // 英文字母（大小写）、数字、“_”、“@”、“.”、“-”
		name: "^[\u4e00-\u9fa5\\w]+$", // 中文、英文字母（大小写）、数字、“_“
		password:"^[\\w\\.]+$", // 英文字母(大小写)、数字、“_”、“.”
		// mobile:"^[0-9\-\_\*#. ]{1,15}$", // 数字、“.”、“_”、“-”、“*”、"#"、空格。 手机号码的验证
        mobile:"^\\d{11}$", // 11位数字的手机号码
		// extNum:"^[0-9（）()\\-，,；;*+#. ]{1,30}$", // 分机只允许输入"数字、（、）、，、-、；、*、+、#、空格、."！
        extNum:"^[0-9]*$", // 分机只允许输入"数字."！
		// fax:"^[0-9\-]{1,32}$", // 数字、“-”
        fax:"^[0-9]*$", // 传真 只能为纯数字
		networkDomain:"^[0-9a-zA-Z.\\-]{1,128}$" // 英文（大小写不敏感）、数字、“.”、“-”;
	};


$.namespace("SSO.verify")
SSO.verify = {
	email : function (value){
		if (!SSO.Base.validation.isRegExp(regexEnum.email,value)) {
			return false;
		};
		return true;
	},
	mobile : function(value){
		if(!SSO.Base.validation.isRegExp(regexEnum.mobile,value)){
			return false;
		}
		return true;
	},

	password : function(value){
		if(!SSO.Base.validation.isRegExp(regexEnum.password,value)){
			return false;
		}
		return true;
	},
	fax : function(value){
		if(!SSO.Base.validation.isRegExp(regexEnum.fax,value)){
			return false;
		}
		return true;
	}
}

//字符验证
$.namespace("SSO.Base.validation");
SSO.Base.validation = {
    isAllNumber:function(value){
        var reg =/^[0-9]*$/;
        return this.isRegExp(reg,value);
    },
	isString:function(value){
		return typeof(value) == "string" ? true : false;
	},
	//是否是自定义的正则表达式
	isRegExp:function(reg,value){
		if(this.isString(value)){
			reg = new RegExp(reg);
		}
		if(!reg.test(value)){
			return false;
		}
		return true;
	},
	//验证长度
	checkLength:function(value, len) {
		if (value.length > len) {
			return false;
		}
		return true;
	},
	//是否为任意数字
	isNumeric:function(value){
		var reg = /^(-|\+)?\d+(\.\d+)?$/;
		return this.isRegExp(reg,value);
	},
	//检查是否为正数
	isUnsignedNumeric:function(value){
		var reg = /^\d+(\.\d+)?$/;
		return this.isRegExp(reg,value);
	},
	//是否为整数
	isInteger:function(value){
		var reg = /^(-|\+)?\d+$/;
		return this.isRegExp(reg,value);
	},
	//是否为非负整数
	isUnsignedInteger:function(value){
		var reg = /^\d+$/;
		return this.isRegExp(reg,value);
	},
	//是否为正整数
	isPositiveInteger:function(value){
		var reg = /^[0-9]*[1-9][0-9]*$/;
		return this.isRegExp(reg,value);
	},
	//是否为正整数（第一位不能是0开头）
	isPositiveInteger_:function(value){
		var reg = /^[1-9]*[1-9][0-9]*$/;
		return this.isRegExp(reg,value);
	},
	//是否是仅数字字母下滑线
	isFiledEn:function(value){
		var reg = /^\w+$/;
		return this.isRegExp(reg,value);
	},
	//是否是仅数字字母_-（）
	isFiledEn2:function(val){
		var reg=/^[\w\-\(\)]+$/; 
		return reg.test(val);
	},
	//是否仅中文
	isFiledCN:function(value){
		var reg = /^([\u4e00-\u9fa5])+$/;
		return this.isRegExp(reg,value);
	},
	//是否是中文数字字母下滑线
	isFiledString:function(value){
		var reg = /^(\w|[\u4e00-\u9fa5]|-)+$/;
		return this.isRegExp(reg,value);
	},
	//是否是中文数字字母下滑线点号
	isCodeString:function(value){
		var reg = /^(\w|[\u4e00-\u9fa5]|-|\.)+$/;
		return this.isRegExp(reg,value);
	},
	//是否在指定的范围
	isRange:function(max,min,value){
		if(value<min || value>max){
			return false;
		}else{
			return true;
		}
	},
	//是否为正浮点数
	isUnsignedFloat:function(value){
	  var reg= /^\d+(\.\d*)?$/;
	  return this.isRegExp(reg,value);
	},
	//是否是IP地址
	isIP: function(value){
		var reg = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])[\.](25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)[\.](25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)[\.](25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
		return reg.test(value);
	},
	//中文、英文字母、数字、下划线
	isCharAndNumber: function(value){
		var reg = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
		return reg.test(value);
	},
	//验证金额
	checkMoney:function(value){
		var reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/;
		return this.isRegExp(reg,value);
	}
};


//请求安全锁
$.namespace("Mo.Base.throttle");
Mo.Base.throttle = {
	time:15*1000,
	data:{},
	reg:function(key,time){
		time = time || this.time;
		this.data[key] = {lock:false,time:time,thread:null};
		return this.data[key];
	},
	mask:true,
	lock:function(key,time){
		Mo.Loading.show();
		var data = this.getData(key);
		if(!data){
			data = this.reg(key,time);
		}
		clearTimeout(data.thread);
		var that = this;
		this.getData(key).lock = true;

		if(time==-1){return;}

		this.getData(key).thread = setTimeout(function(){
			that.getData(key).lock = false;
		},data.time);
	},
	unLock:function(key){
		var data = this.getData(key);
		if(!data){
			//data = this.reg(key);
			return;
		}
		clearTimeout(data.thread);
		this.getData(key).lock = false;
		Mo.Loading.hide();
	},
	isLock:function(key){
		var data = this.getData(key);
		if(!data){
			return false;
		}
		return data.lock;
	},
	getData:function(key){
		return this.data[key];
	}	
};

$.namespace("Mo.Loading");
Mo.Loading = {
	loadingWidth : 190,
	loadingHeight : 45,
	loadingMsg : "正在处理，请稍候...",
	show : function() {
		var zindex = 1900;
		var artDiv = $(".aui_state_focus");
		if (artDiv.length>0) {
			zindex = parseInt($(artDiv).css('z-index'));
		}
		var mask = $(".loading-mask");
		if (mask.length < 1) {
			$("<div class=\"loading-mask\"></div>").css({
				display : "block",
				"z-index" : zindex - 2
			}).appendTo(document.body);

			$("<div class=\"loading-mask-msg\"></div>").html(this.loadingMsg)
					.appendTo(document.body).css({
						display : "block",
						"z-index" : zindex - 1,
						left : ($(document.body).outerWidth(true) - this.loadingWidth) / 2,
						top : ($(window).height() - this.loadingHeight) / 2
					});
		} else {
			$(".loading-mask").css({
				display : "block",
				"z-index" : zindex - 2
			}).show();
			$(".loading-mask-msg").css({
				display : "block",
				"z-index" : zindex - 1
			}).show();
		}
	},
	hide : function() {

		$(".loading-mask").hide();
		$(".loading-mask-msg").hide();
	}
};

$.namespace('Mo.SimpleSearch');
Mo.SimpleSearch = {
    init:function(selector,width){
        var width = width || 130;
        $(selector).css({width:width});
        $(".mo-simple-search-input",selector).css({width:width-20}).blur(function(){
            $(selector).removeClass("active");
            var val = $(this).val();
            var hint = $(this).attr("mo-hint");
            if(val == ""){
                $(this).val(hint);
            }
        }).focus(function(){
            $(selector).addClass("active");
            var val = $(this).val();
            var hint = $(this).attr("mo-hint");
            if(val == hint){
                $(this).val("");
            }
        }).blur();
        return this;
    }
};

$.namespace("Mo.loadMask");
Mo.loadMask = {
    show:function(el){
        if(!el){
            el = $("body");
        }
        $("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(el);
        var msg=$("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html("正在加载，请稍候...").appendTo(el);
        msg.outerHeight(40);
        msg.css({marginLeft:(-msg.outerWidth()/2),lineHeight:(msg.height()+"px")});
    },
    hide:function(){
        $("div.datagrid-mask-msg").remove();
        $("div.datagrid-mask").remove();
    }
};

$.namespace("Mo.RebootTip")
Mo.RebootTip = {
    intervalId: null,
    progressbar: null,
    progressId: null,
    runningFlag: true,
    show: function(msg, timeout, progressTime, domain, noDialog, toCore) {
        if (!msg) {
            msg = '系统重启中，请稍候...';
        }
        if (!timeout || isNaN(timeout)) {
            timeout = 120000;
        }
        if (!progressTime || isNaN(progressTime)) {
            progressTime = 300000;
        }
        this.runningFlag = true;
        this.showProgressDialog(msg, progressTime);
        setTimeout(function() {
            if (Mo.RebootTip.runningFlag) {
                Mo.RebootTip.intervalId = window.setInterval(function() {
                    Mo.RebootTip.getStatus(domain, noDialog, toCore);
                }, 10000);
            }
        }, timeout);
    },
	getStatus: function (domain, noDialog, toCore) {
		var appurl = toCore ? '/portalCore' : '/portal';
        if (domain) {
			var loginUrl = domain + appurl + '/login';
            Mo.RebootTip.complete(loginUrl, noDialog);
        } else {
            $.ajax({
                url: Mo.Config.appUrl + '/check',
                method: 'GET',
                timeout: 7000,
                success: function() {
                    var loginUrl = location.href.split(Mo.Config.appUrl)[0] + appurl + '/login';
                    Mo.RebootTip.complete(loginUrl, noDialog);
                }
            });
        }
    },
    getDialogTemplate: function(msg) {
        return (
            '<div class="mo-msgbox-wrapper" style="display: block;"><div class="mo-msgbox-content mo-dialog-content" style="height:256px"><div class="title">' +
            '<span>提示</span></div><div class="separater"></div><div class="info-wrap"><div class="info" id="infoCustom" style="margin-left:25px">' +
            msg +
            '<div id="rebootProgressbar" style="margin-top:12px"></div></div></div></div></div>'
        );
    },
    showProgressDialog: function(msg, progressTime) {
        top.$.dialog({
            padding: 0,
            id: 'rebootProgressDialog',
            content: Mo.RebootTip.getDialogTemplate(msg),
            lock: true,
            opacity: 0.5,
            cancel: false,
            drag: false,
            esc: false
        });
        this.progressbar = top.Portal.Progressbar('#rebootProgressbar', {
            width: 315
        });
        this.progressId = window.setInterval(function() {
            var progressbar = Mo.RebootTip.progressbar;
            var current = progressbar.getValue();
            if (current < 99) {
                progressbar.setValue(++current);
            } else {
                window.clearInterval(Mo.RebootTip.progressId);
            }
        }, progressTime / 100);
    },
    close: function() {
        top.$.dialog({ id: 'rebootProgressDialog' }).close();
        this.runningFlag = false;
        window.clearInterval(Mo.RebootTip.progressId);
        window.clearInterval(Mo.RebootTip.intervalId);
    },
    complete: function(loginUrl, noDialog) {
        window.clearInterval(this.progressId);
        this.progressbar.setValue(100);
        window.clearInterval(this.intervalId);
        setTimeout(function() {
            top.$.dialog({ id: 'rebootProgressDialog' }).close();
            if (Mo.RebootTip.runningFlag) {
                if (noDialog) {
                    top.window.onbeforeunload = null;
                    top.location.href = loginUrl;
                } else {
                    Moo.alert('重启完成，请重新登录生效！', function(r) {
                        if (r) {
                            top.window.onbeforeunload = null;
                            top.location.href = loginUrl;
                        }
                    });
                }
            }
        }, 1000);
    }
};
