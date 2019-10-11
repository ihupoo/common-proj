TS.namespace("setting");
TS.setting.changehead = {
	guid:"",  //群组头像 ID
	
	init:function(guid){

		if(guid)TS.setting.changehead.guid=guid;
		this.initEvent();
		
		TS.setting.beforeMask.init();
		TS.setting.headUploader.init(guid);
		TS.setting.previewImg.init();
		TS.setting.imageareaselect.init();
		if(guid){
			TS.app.init.page();
			TS.app.sendPrivateMessage.init();//初始化发送私信
			TS.app.face.init();//表情初始化
		}else{
			MovisionNav.init({
				accountType:TS.app.config.ACCOUNT_TYPE,
				xmppCfg:{SYSTEM_DATETIME_STAMP:TS.app.config.SYSTEM_DATETIME_STAMP,
						CLIENT_DATETIME_STAMP:TS.app.config.CLIENT_DATETIME_STAMP}
			});
		}
	},
	
	initEvent:function(){
		$("#setting-changehead-cancel").on("click",function(){
			location.reload();
		});
		$("#setting-changehead-save").on("click",function(){
			var btn = $(this);
			if(btn.hasClass("disabled")){
				return false;
			}
			var range = TS.setting.imageareaselect.getAdjustValue();
			
			if(null == range) {
				TS.setting.message.show("请先调整照片大小",true);
				return;
			}
			//linff 增加群组头像的兼容 2011-09-26
			var url = TS.app.utils.getUploadURL("uploader/confirmPortrait");
			if(TS.setting.changehead.getGroupUid()){
				url = TS.app.utils.getUploadURL("uploader/confirmGroupHeadImg?guid="+TS.setting.changehead.getGroupUid());
			}

			var selector = TS.setting.imageareaselect.selector;
			range.fileName = TS.setting.headUploader.fileName;
			btn.addClass("disabled");
			$.post(url,range,function (t, type){
				if(t.success){
					var iWidth = $("#original").width();
					var msgInfo = "头像保存成功！";
					if(TS.setting.changehead.getGroupUid()!=""){
						 msgInfo = "群图标保存成功！";
					}
					$("#setting-changehead-cancel").hide();
					TS.setting.message.show(msgInfo);					
					selector.update();
				}else{
					TS.setting.message.show(t.description,true);
				}
			},'json').error(function(){
				TS.app.msg.alert("系统繁忙");
				btn.removeClass("disabled");
			});
		
		})
	
	},
	getGroupUid:function(){
		return TS.setting.changehead.guid;
	},
	btnEnabled:function(){
		$("#setting-changehead-cancel").show();
		$("#setting-changehead-save").removeClass("disabled");
	},
	btnDisabled:function(){
		$("#setting-changehead-cancel").hide();
		if(!$("#setting-changehead-save").hasClass("disabled")){
			$("#setting-changehead-save").addClass("disabled");
		}
	}

};

TS.setting.beforeMask = {
	init:function(){
		this.id = $(".beforeUpload");
	},
	show:function(text){		
		$(".beforeUpload").text(text).show();
	},
	hide:function(){		
		$(".beforeUpload").hide();
	}
}
//头像上传
TS.setting.headUploader = {
	reg:/(jpg|jpeg|JPG|JPEG|png|gif|bmp)$/,
	proportion:1,
	minXY:0,
	_X:0,   //原始宽度
	_Y:0,	//原始长度
	fileName:"",//上传后的文件名称
	init:function(guid){
		var mask = this.mask = TS.setting.beforeMask;
		
		//linff 增加群组头像的兼容 2011-09-26
		var url = "";		
		if(guid){
			url = TS.app.utils.getUploadURL('uploader/uploadGroupHead?guid=' + guid);
		}else{
			url = TS.app.utils.getUploadURL('uploader/uploadPortrait');
		}
			
		this.uploader = new qq.FileUploader({				
			action: url,
			element: $('#file-uploader')[0],
			multiple: false,
			debug: false,
			//处理函数
			onSubmit: this.onSubmit,
			onProgress: this.onProgress,
			onComplete: this.onComplete,
			onCancel: function(id, fileName){},
			showMessage: function(message){ TS.setting.message.show(message); }
		}); 
	
		$(".qq-upload-button").addClass("blue-button");
	},	
	onSubmit:function(id, fileName){
		TS.setting.message.hide();
		var hd = TS.setting.headUploader;
		 if(!(fileName && hd.reg.test(fileName.toLowerCase()))) {
			TS.setting.message.show('仅支持JPG、PNG、GIF、BMP图片文件',true);
			return false;
		}		
		
		$(".layer-shadow").css("display","inline");
		if($.browser.msie){
			 hd.mask.show("图片正在上传中...");
			 return true;
		 }
		hd.mask.show("图片上传中 0%");
	
	},
	onProgress:function(id, fileName, loaded, total){
		var hd = TS.setting.headUploader;
		var t = parseInt(loaded/total *100);
		hd.mask.show("图片上传中 "+t+"%");
		
	},
	onComplete:function(id, fileName, msg){
		if(msg.success){
			var url = TS.app.utils.getUploadURL(msg.data+"?t="+Math.random());
			TS.setting.headUploader.setFileName(msg.data);
			setTimeout(function(){
				$("#original").attr("src",url).load(function(){
					TS.setting.imageareaselect.onloadImg();
					$(".preview img").attr("src",url);
				});
				$(".layer-shadow").css("display","none");
				TS.setting.headUploader.setXY(msg.data);
			},500);
			TS.setting.changehead.btnEnabled();			
		}else{			
			TS.setting.message.show(msg.description,true);
			TS.setting.imageareaselect.selector.cancelSelection();
			$(".layer-shadow").css("display","none");
			TS.setting.changehead.btnDisabled();
		}
		
	},
	setFileName:function(url){
		var arr = url.split("/");
		var file = arr[arr.length-1];
		arr = file.split("?");
		this.fileName = arr[0];
	},
	setXY:function(url){
		$("#original").css("width","");
		$("#original").css("height","");
		var arr = url.split("?xy=");
		if(arr.length<2) return;
		
		var arrXY = arr[arr.length-1].split("_");
		var x = parseInt(arrXY[0]);
		var y = parseInt(arrXY[1]);
		this.proportion = 1;
		if(x>=y){
			if(x>320){
				$("#original").css("width","320px");
				$("#original").css("height","");
				var multipleNum = x/320;
				this.proportion = Math.floor(multipleNum*100)/100;
			}
		}else{
			if(y>320){
				$("#original").css("width","");
				$("#original").css("height","320px");
				var multipleNum = y/320;
				this.proportion = Math.floor(multipleNum*100)/100;
			}
		}
		if(x>y) this.minXY = y;
		else this.minXY = x;
		
		this._X = x;
		this._Y = y;
		
		printf("proportion:"+this.proportion)
	}
}

TS.setting.previewImg = {
	init:function(){
		if($("#previewImg256")) this.box256 = $("#previewImg256");
		this.box128 = $("#previewImg128");
		this.box64=$("#previewImg64");
		this.box32=$("#previewImg32");
	},
	show:function(img,selection){
		if (!selection.width || !selection.height){
	        return;
		}
		this.iWidth = $("#original").width();
	    this.iHeight = $("#original").height();

	    if($("#previewImg256"))this.prev(this.box256,256,selection);
	    this.prev(this.box128,128,selection);
		this.prev(this.box64,64,selection);
		this.prev(this.box32,32,selection);
	},
	prev:function(el,size,selection){
		

		var scaleX =  size / selection.width;
	    var scaleY =  size / selection.height;
	    
	    var iWidth = this.iWidth;
	    var iHeight = this.iHeight;
	 	//alert(document.getElementById("original").width);
	    el.css({
	        width: Math.round(scaleX * iWidth),
	        height: Math.round(scaleY * iHeight),
	        marginLeft: -Math.round(scaleX * selection.x1),
	        marginTop: -Math.round(scaleY * selection.y1)
	    });
	}
	
}


TS.setting.imageareaselect = {
	//range:{x1:0,y1:0,width:128,height:128},
	init:function(){
		KISSY.use("imgareaselect",function(S){
			TS.setting.imageareaselect._init();
		});
	},
	_init:function(){
		this.selector = $('#original').imgAreaSelect({
			handles: true,
			instance: true,
			resizable : true,
			aspectRatio:"1:1",
			show:false,
			hide:true,
			autoHide:false,
			
			persistent : true,
			maxHeight : 320,
			maxWidth : 320,
			minHeight : 24,
			minWidth : 24,
			onSelectChange : this.onSelectChange
			//x1: 0, y1: 0, x2: 128, y2: 128
			//x1: 120, y1: 90, x2: 280, y2: 210
		});
	},
	onloadImg:function(){
		var iWidth = $("#original").width();
	    var iHeight = $("#original").height();
		var selector = this.selector;
		if(iWidth>=iHeight){
			selector.setSelection(0, 0, iHeight, iHeight, true);
		}
		if(iWidth<iHeight){
		selector.setSelection(0, 0, iWidth, iWidth, true);
		}
		selector.setOptions({ show: true ,hide: false});
		selector.update();
		TS.setting.previewImg.show(null,selector.getSelection());
		TS.setting.beforeMask.hide();

	},
	onSelectChange:function(img, selection){
		$("div .imgareaselect-border4").off('mousedown');
		$("div .imgareaselect-border4").on('mousedown',function(e){
			$("#setting-changehead-save").removeClass("disabled");
			$(".setting-msg",$("#setting-holder")).css("display","none");
		});
		$("div .imgareaselect-handle").off('mousedown');
		$("div .imgareaselect-handle").on('mousedown',function(e){
			$("#setting-changehead-save").removeClass("disabled");
			$(".setting-msg",$("#setting-holder")).css("display","none");
		});
		TS.setting.previewImg.show(img, selection);
	},

	getValue:function(){
		return this.selector.getSelection();
	},
	getAdjustValue:function(){
		var range = this.getValue();
		var proportion = TS.setting.headUploader.proportion;
		var minXY = TS.setting.headUploader.minXY;
		var X = TS.setting.headUploader._X;
		var Y = TS.setting.headUploader._Y;		
		if(proportion!=1){
			var width = Math.floor(range.width * proportion);			
			if(width>minXY) width = minXY;
			
			var x1 = Math.floor(range.x1 * proportion);
			var y1 = Math.floor(range.y1 * proportion);
			range.width = width;
			range.height = width;
			
			if(x1+width<=X){
				range.x1 = x1;			
				range.x2 = x1+width;
			}else{
				range.x1=X-width;
				range.x2 = X;
			}
			if(y1+width<=Y){
				range.y1 = y1;
				range.y2 = y1+width;
			}else{
				range.y1=Y-width;
				range.y2 = Y;
			}
			
		}		
		return range;
	}
}

KISSY.add("ts-seeting-changehead",function(S){});