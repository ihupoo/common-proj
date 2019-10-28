import template from 'art-template/lib/template-web.js'
import '@/lib/artDialog/4.1.7/jquery.artDialog.min';
import '@/lib/artDialog/4.1.7/skins/simple.css';
import '@/styles/reset-artDialog.scss';

(function ($,artDialog) {
	if(window.MoMessageBox1){ return }
    
    //image+自定义按钮的提示框
    var tp2 = [
       		'<div class="title">',
       		'<span>{{title}}</span>',
       		'<a href="javascript:void(0);" class="w-close" hidefocus="true" data-action="cancel"></a>',
       		'</div>',
       		'<div class="separater"></div>',
       		'<div class="info-wrap">',
       		'<div class="tipImage"></div>',
       		'<div class="info" id="infoCustom">{{@ text}}</div>',
       		'</div>',
       		'<div class="btn-wrapper">',
       		'<a class="mo-btn-gray confirm mo-btn-x mo-btn-x-left" data-action="ok" href="javascript:">{{okText}}</a>',
       	  	'{{if type !== "alert"}}<a class="mo-btn-gray cancel mo-btn-x mo-btn-x-left" data-action="cancel" href="javascript:">{{cancelText}}</a>{{/if}}',
       		'</div>'].join('');
    var MessageBox1 = window.MoMessageBox1 = function (options) {
		var me = this;
		options = options || {};
		this.tp2 = options.tp2 || tp2;
		this.autodestroy = options.autodestroy;
		this.id = options.id || "mo-msgbox-dialog";
		this.$el = $('<div class="mo-msgbox-wrapper"><div class="mo-msgbox-content mo-dialog-content"></div></div>');
		this.$el.on('click','[data-action]',function (e) {
			switch($(e.target).attr('data-action')){
				case 'ok':{
					me.close('ok');
					break;
				}
				case 'cancel':{
					me.close('cancel');
					break;
				}
			}
		});
		return this;
	}

	MessageBox1.prototype = {
		constructor: MessageBox1,
		show: function (msg, title ,type ,callback,okText,cancelText,scope ,param) {
			var me = this;
			var data = {text:msg ,title:title,type:type,okText:okText||"确定",cancelText:cancelText || "取消"};
			this.$el.find('.mo-msgbox-content').html(template.compile(this.tp2)(data));
			this.callback = callback;
			this.scope = scope;
			this.param = param;
			this.dialog = $.dialog({
				id:this.id,
				content:this.$el[0],
				lock: true,
				opacity: 0.50,  // 透明度
				padding: 0,
				width: 400,
				height:260,
				cancel:false, // 隐藏关闭按钮
				drag: false, // 不允许拖拽
				show:true,
				close: function () {
					if(!me.result){
						me.onresult('cancel')
					}
					if(me.autodestroy){
						return true;
					}
					me.hide();
				}
			});
			this.dialog.show();
			this.visible = true;
			this.result = null;
		},
		close:function(result){
			if(result) this.onresult(result);
			this.result = result || 'cancel';
			if(this.dialog)this.dialog.close();
			this.visible = false;
		},
		hide:function(){
			this.dialog.hide();
			this.visible = false;
		},
		onresult:function(result){
			if(this.callback){
				this.callback.call(this.scope || this, result=="ok",result,this.param );
			}
		},
		alert: function (msg,title,callback,okText,cancelText) {
			if(msg){
				var arr = msg.split("\n");
				var message="" ;
				if(arr.length>1){
					for(var i=0;i<arr.length;i++){
						if(i == arr.length-1){
							message += "<span style='float:left;'>"+arr[i]+ "</span>";
						}else {
							message += "<span style='float:left;'>" + arr[i] + "</span><br>";
						}
					}
					msg = message;
			}
			}
			this.show(msg,title,'alert',callback,okText,cancelText);
		},
		confirm: function (msg,title,callback,okText,cancelText) {
			if(msg){
			var arr = msg.split("\n");
			var message="" ;
			if(arr.length>1){
				for(var i=0;i<arr.length;i++){
					if(i == arr.length-1){
						message += "<span style='float:left;'>"+arr[i]+ "</span>";
					}else {
						message += "<span style='float:left;'>" + arr[i] + "</span><br>";
					}
				}
				msg = message;
			}
			}
			
			this.show(msg,title,'confirm',callback,okText,cancelText);
		},
		alertWithoutBtn: function (msg,title,callback,okText,cancelText) {
			if(msg){
			var arr = msg.split("\n");
			var message="" ;
			if(arr.length>1){
				for(var i=0;i<arr.length;i++){
					if(i == arr.length-1){
						message += "<span style='float:left;'>"+arr[i]+ "</span>";
					}else {
						message += "<span style='float:left;'>" + arr[i] + "</span><br>";
					}
				}
				msg = message;
			}
			}
			
			this.show(msg,title,'alertWithoutBtn',callback);
		},
		prompt:function(){
		},
		isvisible:function(){
			return this.visible;
		}
	};
})($,$.dialog);
