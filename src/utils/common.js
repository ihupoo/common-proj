
//避免浏览器记住密码后对input输入框的自动回填
const InputPreventAutocomplete = () => {
    $("input").each(function(){
        var type= $(this).attr('type');
        if(type=='password'){//只给密码框加 避免浏览器记住密码后对input输入框的自动回填
            $(this).before("<input style='display:none' type='"+type+"'>");
            $(this).attr("autocomplete","new-password");
        }else{
            $(this).attr("autocomplete","off");//避免chrome浏览器对input的默认行为（可下拉勾选输入过的内容）
        }
    });
}

$(function(){
    InputPreventAutocomplete()
})


import { MoAlert } from '@/components/popup';
$(function () {
	//全局对象MessageBox
	let orgAlert = window.alert;
	window.alert = function (msg, callback) {
		if (window.top.MoMessageBox1) {
			MoAlert(msg, callback)
		} else {
			orgAlert(msg);
		}
	}
});



$(document).ajaxComplete(function (event, xhr, options) {
	if (xhr.responseJSON && xhr.responseJSON.errorCode && (xhr.responseJSON.errorCode == "100012" || xhr.responseJSON.errorCode == "100011" || xhr.responseJSON.errorCode == "100010" || xhr.responseJSON.errorCode == "100013")) {
		top.location.href = BASE_URL + "/login";
	}
})


import Store from '@/store';

const BASE_URL = Store.getState('BASE_URL');

const Common = {
	headerEvent: function () {
		$(".li").on("mouseover", function () {
			$(".li-a", $(this)).toggleClass("hover");
			$(".check-hook", $(this)).toggleClass("hover");
		})
		$(".public-private-cloud-content").on('click', function (e) {
			$(".public-private-cloud").toggle(0, function () {
				$(".cloud-name").toggleClass("active");
				$(".arrow").toggleClass("active");
			});
			if (e.stopPropagation)
				e.stopPropagation();
			else
				e.cancelBubble = true;

			let id = $.trim($(".cloud-name").attr("value"));
			$(".check-hook").removeClass("active");
			$("#" + id).addClass("active");
		})
		$(".setting").on("click", function (e) {
			if ($(this).hasClass('disabled')) {
				return
			}
			$("#nav-sublist-notify").removeClass("hover");
			$(".setting-list").toggle();
			if (e.stopPropagation)
				e.stopPropagation();
			else
				e.cancelBubble = true;
		})

		$(document).on("click", function () {
			$(".setting-list").hide();
			$(".public-private-cloud").hide(0, function () {
				$(".cloud-name").removeClass("active");
				$(".arrow").removeClass("active");
			});
		});

		$("#modifyUser").on("click", function () {
			$(".setting-list").hide();
			location.href = BASE_URL + "/set#profile";
		});

		$("#modifyPassword").on("click", function () {
			$(".setting-list").hide();
			location.href = BASE_URL + "/set#password";
		});
		$("#gmt").on("click", function () {
			$(".setting-list").hide();
			location.href = BASE_URL + "/set#gmt";
		});
		$("#language").on("click", function () {
			$(".setting-list").hide();
			location.href = BASE_URL + "/set#language";
		});
		$("#modifyPortrait").on("click", function () {
			$(".setting-list").hide();
			location.href = BASE_URL + "/set#portrait";
		});
		$("#about").on("click", function () {
			$(".setting-list").hide();
			$.dialog({
				padding: 0,
				id: "aboutWindow",
				content: document.getElementById('aboutWrapper'),
				lock: true,
				opacity: 0.50,	// 透明度
				cancel: false, // 隐藏关闭按钮
				drag: false // 不允许拖拽
			});
		});

		//取消
		$(".w-close", "#aboutWrapper").on("click", function () {
			$.dialog({ id: 'aboutWindow' }).close();
		});
	},
	initPortrait: function (portrait, portraitDomain) {
		if (!portrait) {
			portrait = BASE_URL + '/static/images/avator.png?v=1';
		} else if (portraitDomain) {
			portrait = '//' + portraitDomain + '/' + portrait;
		}
		let $userPortrait = $('.user-info .user-portrait');
		$userPortrait.on('load', function () {
			$(this).removeClass('hidden');
		});
		$userPortrait.attr('src', portrait);
	},
	setDefaultImg: function (parent) {
		parent = parent || "";
		$(parent + " img[data-onerror]").each(function (i) {
			$(this).on("error", function () {
				$(this).attr("src", $(this).attr("data-onerror"));
			})
		})
	}
};


const Size = {
	init: function () {
		var height = $(window).height() - 185;
		$(".content").css("min-height", height);
		$(window).resize(function () {
			Size.experirdpageInit();
		})
	},

	experirdpageInit: function () {
		var wrapMinHeight = 650;
		var winHeight = $(window).height();
		var wrapHeight = winHeight > wrapMinHeight ? winHeight : wrapMinHeight;
		var wrapAllHeight = wrapHeight - $("#footer").outerHeight();
		$(".wrap").height(wrapHeight)
		$(".wrap-all").height(wrapAllHeight)
	}
}


export { Size, Common }

//页面进入设置URL
export function setBaseUrl(){
    const baseUrl = window.location.pathname.split('/')[1];
    if(baseUrl !== 'portal' && baseUrl !== 'portalCore'){
        // throw new Error('路径错误')   //todo，跳转404
    }
    Store.dispatch({
        type:'save',
        payload:{
            BASE_URL: `/${baseUrl}`
        }
    })
}





