import Store from '@/store';
import qq from '@/lib/uploader/fileuploader'
import { MoAlert } from '@/components/popup';
import { Throttle } from './utils';

import '@/lib/imgareaselect';


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
		this.preview_img("", {
            width: length,
            height: length
        });
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

//设置头像
const ModifyPortait = {
	reg: /(jpg|jpeg|JPG|JPEG|png|gif|bmp)$/,
	proportion: 1,
	minXY: 0,
	_X: 0,   //原始宽度
	_Y: 0,	//原始长度
	fileName: "",//上传后的文件名称
    url: Store.getState('BASE_URL') + "/system/user/uploadPortrait",
    
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
			MoAlert('仅支持JPG、PNG、GIF、BMP图片文件');
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
			$("#img_side_320").attr("src", Store.getState('BASE_URL') + "/" + msg.data + "?t=" + Math.random());
			$(".preview_div").find("img").attr("src", Store.getState('BASE_URL') + "/" + msg.data + "?t=" + Math.random());
			ModifyPortait.setFileName(msg.data);
			ModifyPortait.setXY(msg.data);
			let length = 0;
			document.getElementById("img_side_320").onload = function () {
				length = SelectImage.getSelectLength();
				SelectImage.qietuInit(length);
			}
		} else {
			MoAlert(msg.description);
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

	}
}

export default {
    initUpload: ModifyPortait.initUpLoad
}
