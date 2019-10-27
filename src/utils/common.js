import Store from '@/store';
import { Validation } from './utils';
import { MoAlert } from '@/components/popup';

const Common = {
	initPortrait: function (portrait, portraitDomain) {
		if (!portrait) {
			portrait = Store.getState('BASE_URL') + '/static/images/avator.png?v=1';
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
				$(this).off('error')
			})
		})
    },
    //账号正确与否
    checkAccount(value) {
		if (Validation.isAllNumber(value)) {//账号的检验 新增该规则（不可以纯数字）
			MoAlert('账号不允许纯数字');
			return false;
		}
		if (!Validation.check('account', value)) {
			MoAlert('账号仅允许输入英文、数字、汉字、下划线（_）、减号（-）、@、点号（.）且首尾字符仅允许英文、数字、汉字');
			return false;
		}
		if (!Validation.checkLength(value, 40)) {
			MoAlert('账号长度不能大于40位字符');
			return false;
		}
		return true;
	},
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

//避免浏览器记住密码后对input输入框的自动回填
export function InputPreventAutocomplete(){
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


//全局jq请求拦截
export function AjaxComplete(){
    $(document).ajaxComplete(function (event, xhr, options) {
        if (xhr.responseJSON && xhr.responseJSON.errorCode && (xhr.responseJSON.errorCode == "100012" || xhr.responseJSON.errorCode == "100011" || xhr.responseJSON.errorCode == "100010" || xhr.responseJSON.errorCode == "100013")) {
            location.href = Store.getState('BASE_URL') + "/login";
        }
    })
}




