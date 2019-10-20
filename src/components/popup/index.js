
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


const MoTips =  function (text, callback, time) {
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



export {
    MoAlert,
    MooAlert,
    MoConfirm,
    MooConfirm,
    MoTips
}
