(function ($,artDialog) {
	if(window.MoMessageBox){ return }
	var tpl = [
	'<div class="title">',
	'<span>{{title}}</span>',
	'<a href="javascript:void(0);" class="w-close" hidefocus="true" data-action="cancel"></a>',
	'</div>',
	'<div class="separater"></div>',
	'<div class="info-wrap">',
	'<div class="info">{{text}}</div>',
	'</div>',
	'<div class="btn-wrapper">',
	'<a class="mo-btn-gray confirm mo-btn-x mo-btn-x-left" data-action="ok" href="javascript:">确定</a>',
  	'{{if type !== "alert"}}<a class="mo-btn-gray cancel mo-btn-x mo-btn-x-left" data-action="cancel" href="javascript:">取消</a>{{/if}}',
	'</div>'].join('');
	
    var MessageBox = window.MoMessageBox = function (options) {
        var me = this;
		options = options || {};
		this.tpl = options.tpl || tpl;
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

    MessageBox.prototype = {
        constructor: MessageBox,
        show: function (msg, title ,type ,callback, scope ,param) {
            var me = this;
			var data = {text:msg ,title:title,type:type};
			this.$el.find('.mo-msgbox-content').html(template.compile(this.tpl)(data));
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
        alert: function (msg,title,callback) {
			this.show(msg,title,'alert',callback);
        },
        confirm: function (msg,title,callback) {
			this.show(msg,title,'confirm',callback);
        },
		prompt:function(){
		},
		isvisible:function(){
			return this.visible;
		}
    };
	
})($,$.dialog);