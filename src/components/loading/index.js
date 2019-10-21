
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

            $(`<div class="loading-mask-msg">${this.loadingMsg}</div>`)
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
        let msg = $(`<div class="datagrid-mask-msg" style="display:block;left:50%">正在加载，请稍候...</div>`).appendTo(el);
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


export {
    Loading,
    Mask,
}
