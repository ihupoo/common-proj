import { sm3_encrypt, sm4_encrypt_ecb, addH16ZeroTwo, sm3_byte, toTwoHex } from '@/lib/sm';


function Utf8Encode(string) {
	let utftext = "";
	for (let n = 0; n < string.length; n++) {
		let c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}
	return utftext;
}


function GUID() {
	this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
	if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
		GUID.prototype.newGUID = function () {
			this.date = new Date(); let guidStr = '';
			let sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
			let sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
			for (let i = 0; i < 9; i++) {
				guidStr += Math.floor(Math.random() * 16).toString(16);
			}
			guidStr += sexadecimalDate;
			guidStr += sexadecimalTime;
			while (guidStr.length < 32) {
				guidStr += Math.floor(Math.random() * 16).toString(16);
			}
			return this.formatGUID(guidStr);
		}
		/* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
		GUID.prototype.getGUIDDate = function () {
			return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
		}
		/* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
		GUID.prototype.getGUIDTime = function () {
			return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
		}
		/* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
		GUID.prototype.addZero = function (num) {
			if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
				return '0' + Math.floor(num);
			} else {
				return num.toString();
			}
		}
        /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */GUID.prototype.hexadecimal = function (num, x, y) {
			if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
			else { return parseInt(num.toString()).toString(x); }
		}
		/* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
		GUID.prototype.formatGUID = function (guidStr) {
			let str1 = guidStr.slice(0, 8) + '', str2 = guidStr.slice(8, 12) + '', str3 = guidStr.slice(12, 16) + '', str4 = guidStr.slice(16, 20) + '', str5 = guidStr.slice(20);
			return str1 + str2 + str3 + str4 + str5;
		}
	}
}

const DigestAuth = {
	firstHeader: "",
	qop: "",
	realm: "",
	nonce: "",
	nc: '',
	algorithm: "",
	username: "",
	password: "",
	header: null,
	ajax: function (param) {
		let err = param.error;
		param.error = function (XMLHttpRequest, textStatus, errorThrown) {
			let wwwAuthenticate = XMLHttpRequest.getResponseHeader("WWW-Authenticate");
			if (!!wwwAuthenticate && wwwAuthenticate.indexOf('stale="true"') != -1) {
				DigestAuth.sendAgain(XMLHttpRequest, param, err);
			} else {
				err(XMLHttpRequest, textStatus, errorThrown);
			}
		};
		if (!!DigestAuth.header) param.headers = DigestAuth.header;
		$.ajax(param);
	},
	sendAgain: function (XMLHttpRequest, param, err) {
		param.error = err;
		if (!!XMLHttpRequest && XMLHttpRequest.status == 401) {
			let firstHeader = XMLHttpRequest.getResponseHeader("WWW-Authenticate");
			this.qop = firstHeader.split('qop="')[1].split('"')[0];
			this.realm = firstHeader.split('realm="')[1].split('"')[0];
			DigestAuth.realm = this.realm;
			this.nonce = firstHeader.split('nonce="')[1].split('"')[0];
			this.algorithm = firstHeader.split('algorithm="')[1].split('"')[0];
			let method = param.type;
			let uri = param.url;
			param.headers = DigestAuth.makeHeader(method, uri, this.qop, this.realm, this.nonce, this.algorithm);
			DigestAuth.header = param.headers;
			$.ajax(param);
		}
	},
	makeHeader: function (method, uri, qop, realm, nonce, algorithm) {
		let header = {};
		let ha1 = sm3_encrypt(Utf8Encode(DigestAuth.username + ":" + realm + ":" + DigestAuth.password));
		let ha2 = sm3_encrypt(method + ":" + uri);
		let nc = (Math.random(1) * 10000000).toFixed(0);
		let guid = new GUID();
		let cnonce = guid.newGUID();
		let response = sm3_encrypt(ha1 + ":" + nonce + ":" + nc + ":" + cnonce + ":" + qop + ":" + ha2)
		let auth = ["username*=UTF-8''" + encodeURI(DigestAuth.username),
		"realm=\"" + realm + "\"",
		"nonce=\"" + nonce + "\"",
		"uri=\"" + uri + "\"",
		"qop=" + qop,
		"cnonce=\"" + cnonce + "\"",
		"response=\"" + response + "\"",
		"nc=" + nc].join(',');
		header['Authorization'] = "Digest_SM3 " + auth;
		return header;
	},
	makePassword: function (oldpassword, newpassword) {
		let p_username = DigestAuth.username;
		let p_realm = DigestAuth.realm;
		let guid = new GUID();
		let knonce = guid.newGUID();
		let ha1 = sm3_encrypt(Utf8Encode(p_username + ":" + p_realm + ":" + oldpassword)).toUpperCase();
		let mkey = sm3_encrypt(ha1 + ":" + knonce).toUpperCase();
		let hkey = sm3_encrypt(mkey + ":" + knonce).toUpperCase();
		let ciphertext = sm4_encrypt_ecb(newpassword, mkey.substring(0, 32)).res_ciphertext.toUpperCase();
		let hkey_p = new Array(64);
		let ipad = new Array(64);
		let opad = new Array(64);

		let index = 0;
		for (let i = 0; i < hkey_p.length; i++) {
			hkey_p[i] = 0;
		}
		index = 0;
		for (let i = 0; i < hkey.length; i = i + 2) {
			hkey_p[index++] = parseInt(hkey.substring(i, i + 2), 16);
		}

		let ipadStr = '';
		let opadStr = '';
		let index1 = 0;
		for (let i = 0; i < index; i++) {
			index1++;
			ipad[i] = hkey_p[i] ^ 0x36;
			opad[i] = hkey_p[i] ^ 0x5c;

			ipadStr += addH16ZeroTwo(ipad[i].toString(16));
			opadStr += addH16ZeroTwo(opad[i].toString(16));
		}

		for (let i = index1; i < 64; i++) {
			ipad[i] = 0x36;
			opad[i] = 0x5c;
			ipadStr += addH16ZeroTwo(ipad[i].toString(16));
			opadStr += addH16ZeroTwo(opad[i].toString(16));
		}
		let temp = ipadStr + ciphertext;
		temp = opadStr + sm3_byte(toTwoHex(temp)).toUpperCase();
		let hmac = sm3_byte(toTwoHex(temp)).toUpperCase();
		return { knonce: knonce, ciphertext: ciphertext, hmac: hmac };
	}
};



export { DigestAuth }
