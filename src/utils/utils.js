 /**
 * 工具
 * 
 * */

// $.namespace("SSO.utils");
// SSO.utils = {
// 	getSystemUrl:function(url){
// 		return BP.config.SYSTEM_URL+'/'+url;
// 	},
// 	getStaticUrl:function(){
// 		return BP.config.STATIC_URL;
// 	},
// 	getLang:function(){
// 		return BP.config.LANG;
// 	}
// };


const regexEnum = {
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

//字符验证
const Validation = {
	//是否是自定义的正则表达式
	checkValue(reg, value){
		if(typeof(value) === "string"){
			reg = new RegExp(reg);
		}
		return reg.test(value);
    },
    check(type, value){
        return validation.checkValue(regexEnum[type], value)
    },
	//验证长度
	checkLength(value, len) {
        return value.length <= len
	},
    isAllNumber(value){
        var reg =/^[0-9]*$/;
        return validation.checkValue(reg,value);
    },
	//是否为任意数字
	isNumeric(value){
		var reg = /^(-|\+)?\d+(\.\d+)?$/;
		return validation.checkValue(reg,value);
	},
	//是否为整数
	isInteger(value){
		var reg = /^(-|\+)?\d+$/;
		return validation.checkValue(reg,value);
	},
	//是否为非负整数
	isUnsignedInteger(value){
		var reg = /^\d+$/;
		return validation.checkValue(reg,value);
	},
	//是否为正整数
	isPositiveInteger(value){
		var reg = /^[0-9]*[1-9][0-9]*$/;
		return validation.checkValue(reg,value);
    },
};

//loading
const Loading = {
	loadingWidth : 190,
	loadingHeight : 45,
	loadingMsg : "正在处理，请稍候...",
	show() {
		let zindex = 1900;
		let artDiv = $(".aui_state_focus");
		if (artDiv.length > 0) {
			zindex = parseInt(artDiv.css('z-index'));
		}
		let mask = $(".loading-mask");
		if (mask.length < 1) {
            $(`<div class="loading-mask"></div>`)
                .css({
                    display : "block",
                    "z-index" : zindex - 2
                })
                .appendTo(document.body);

            $(`<div class="loading-mask-msg"></div>`)
                .html(this.loadingMsg)
                .css({
                    display : "block",
                    "z-index" : zindex - 1,
                    left : ($(document.body).outerWidth(true) - this.loadingWidth) / 2,
                    top : ($(window).height() - this.loadingHeight) / 2
                })
                .appendTo(document.body)
		} else {
            $(".loading-mask")
                .css({
                    display : "block",
                    "z-index" : zindex - 2
                })
                .show();
            $(".loading-mask-msg")
                .css({
                    display : "block",
                    "z-index" : zindex - 1
                })
                .show();
		}
	},
	hide() {
		$(".loading-mask").hide();
		$(".loading-mask-msg").hide();
	}
};


//loading - 2
const Mask = {
    show(el){
        el = el || $("body");
        $(`<div class="datagrid-mask" style="display:block"></div>`).appendTo(el);
        var msg = $(`<div class="datagrid-mask-msg" style="display:block;left:50%">正在加载，请稍候...</div>`).appendTo(el);
        msg.outerHeight(40);
        msg.css({ 
            marginLeft:(-msg.outerWidth()/2),
            lineHeight:(msg.height()+"px")
        });
    },
    hide(){
        $(".datagrid-mask-msg").remove();
        $(".datagrid-mask").remove();
    }
}



//请求安全锁
const Throttle = {
	time: 15 * 1000,
	mask: true,
	data: {},
	reg(key,time){
		time = time || this.time;
		this.data[key] = {lock:false,time:time,thread:null};
		return this.data[key];
	},
	lock(key,time){
        let that = this;
		Loading.show();
		let data = this.getData(key);
		if(!data){
			data = this.reg(key,time);
		}
		clearTimeout(data.thread);
		this.getData(key).lock = true;

		if(time==-1){return;}

		this.getData(key).thread = setTimeout(function(){
			that.getData(key).lock = false;
		},data.time);
	},
	unLock(key){
		let data = this.getData(key);
		if(!data){
			//data = this.reg(key);
			return;
		}
		clearTimeout(data.thread);
		this.getData(key).lock = false;
		Loading.hide();
	},
	isLock(key){
		let data = this.getData(key);
		if(!data){
			return false;
		}
		return data.lock;
	},
	getData(key){
		return this.data[key];
	}	
};


//todo
const SimpleSearch = (selector, w) => {
    let width = w || 130;
    $(selector)
        .css({ width: width })
        .find('.mo-simple-search-input')
        .css({ width: width-20 })
        .blur(function(){
            $(selector).removeClass("active");
            let val = $(this).val();
            let hint = $(this).attr("mo-hint");
            if(val == ""){
                $(this).val(hint);
            }
        })
        .focus(function(){
            $(selector).addClass("active");
            let val = $(this).val();
            let hint = $(this).attr("mo-hint");
            if(val == hint){
                $(this).val("");
            }
        })
        .blur();
}

export {
    Validation,
    Throttle,
    Loading,
    Mask
}
