import { Loading } from '@/components/loading';

const ENUM_REGEX = {
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
        return Validation.checkValue(ENUM_REGEX[type], value)
    },
	//验证长度
	checkLength(value, len) {
        return value.length <= len
	},
    isAllNumber(value){
        let reg =/^[0-9]*$/;
        return Validation.checkValue(reg,value);
    },
	//是否为任意数字
	isNumeric(value){
		let reg = /^(-|\+)?\d+(\.\d+)?$/;
		return Validation.checkValue(reg,value);
	},
	//是否为整数
	isInteger(value){
		let reg = /^(-|\+)?\d+$/;
		return Validation.checkValue(reg,value);
	},
	//是否为非负整数
	isUnsignedInteger(value){
		let reg = /^\d+$/;
		return Validation.checkValue(reg,value);
	},
	//是否为正整数
	isPositiveInteger(value){
		let reg = /^[0-9]*[1-9][0-9]*$/;
		return Validation.checkValue(reg,value);
    },
};


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

const isEqual = (val, val2, deep = false) => {
    if(typeof val === typeof val2 && Object.keys(val).length === Object.keys(val2).length){
        for (const [ key,value ] of Object.entries(val)) {
            if(typeof value === 'object' && deep){
                if(!isEqual(value, val2[key], true)){
                    return false
                }
            }else{
                if(val2[key] !== value){
                    return false
                }
            }
        }
        return true
    }
    return false
}

const Times = {
    tenSeconds:10000,
	oneHour:60*60*1000,
	oneDay:24*60*60*1000,
	oneWeek:7*24*60*60*1000,
	/*整点时间格式为 YY/MM/DD HH:00:00*/
	formatTimeHour:function(time){
    	let Year = time.getFullYear();
    	let Month = time.getMonth()+1;
    	Month = Month<10?'0'+Month:Month;
    	let Date = time.getDate();
    	Date = Date<10?'0'+Date:Date;
    	let Hour = time.getHours()
    	Hour = Hour<10?'0'+Hour:Hour;
    	let timeStr = Year+"/"+Month+"/"+Date+" "+Hour+":00:00";
    	return timeStr;
    },
    /*时间格式为:YY/MM/DD HH:MM:SS*///网管的时间格式统一是此格式
    formatTime:function(time){
    	let Year = time.getFullYear();
    	let Month = time.getMonth()+1;
    	Month = Month<10?'0'+Month:Month;
    	let Date = time.getDate();
    	Date = Date<10?'0'+Date:Date;
    	let Hour = time.getHours()
    	Hour = Hour<10?'0'+Hour:Hour;
    	let Minutes = time.getMinutes();
    	Minutes = Minutes<10?'0'+Minutes:Minutes;
    	let Seconds = time.getSeconds();
    	Seconds = Seconds<10?'0'+Seconds:Seconds;
    	let timeStr = Year+"/"+Month+"/"+Date+" "+Hour+":"+Minutes+":"+Seconds
    	return timeStr;
    },
    /*传递给会管时间获取会议，时间格式：YY-MM-DD HH:MM:SS*/
    getCurrentTime: function (time) {
        if (!time) {
            time = new Date();
        }
		let currentTime = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
		return currentTime;
    }
}

const Trans = {
    base64encodechars : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    base64encode:function(str) {
        let out, i, len;
        let c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += Trans.base64encodechars.charAt(c1 >> 2);
                out += Trans.base64encodechars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += Trans.base64encodechars.charAt(c1 >> 2);
                out += Trans.base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                out += Trans.base64encodechars.charAt((c2 & 0xf) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += Trans.base64encodechars.charAt(c1 >> 2);
            out += Trans.base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            out += Trans.base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
            out += Trans.base64encodechars.charAt(c3 & 0x3f);
        }
        return out;
    },
    utf16to8:function(str) {
        let out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007f)) {
                out += str.charAt(i);
            } else if (c > 0x07ff) {
                out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
            } else {
                out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
            }
        }
        return out;
    }
    
}


//todo（live直播列表中使用）
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
    isEqual,
    Times,
    Trans
}
