import $ from 'jquery-migrate';
import 'jquery-namespace';

import '@/lib/ezmark/1.0/ezmark'
import '@/lib/ezmark/1.0/jquery.ezmark'

import '@/styles/common.scss'
import '@/styles/commonCSS.scss'

import './css/login.scss';
import './css/theme.scss';

import '@/utils/utils'
import './js/_tmp_globalUrl'
import '@/utils/common'

import '@/utils/sm';
import '@/utils/md5';
import '@/utils/digestAuth';//todo

import './js/login';

var showVerifyCode = "${showVerifyCode}";
var realmName = "${realmName}";
var nonceValue = "${nonceValue}";
var systemSecurity = "${systemSecurity}";
var outAlter = "${outAlter}";

function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}
$(function () {

    $('input[type="checkbox"]').ezMark();
    /* if(isRent){
        $(".commercialVerInfo").css("display","inline-block");
    } */
    if (isIE()) {
        $("#password").removeAttr("readonly");
    }
    $("#password").on('focus', function () {
        $("#password").removeAttr("readonly");
    });
    // 密码框抬起时，密码框内容为空则隐藏眼睛
    $("#password").on("keyup", function () {
        if ($(this).val()) {
            $('.login_input_wrapper .pwdEye').show()
        } else {
            $('.login_input_wrapper .pwdEye').hide()
        }
    });
    // 点击眼睛，切换眼睛图标的高亮状态 并 切换明文密码
    $(".login_input_wrapper .pwdEye").on("click", function () {
        $(this).toggleClass('active')
        if ($(this).hasClass('active')) {
            $(".login_input_wrapper #password").prop("type", 'text')
        } else {
            $(".login_input_wrapper #password").prop("type", 'password')
        }
    });

    Mo.common.logininit(Mo.CompanyInfo);
    SSO.login.init();
    SSO.login.initVerifyCode();
    window.onresize = function() {
        SSO.login.init();
    }
    /* if(outAlter=='100010'){
        $("#login_form .error_msg").text("token值已经登出，请重新登录！").show();
    }
    if(outAlter=='100011'){
        $("#login_form .error_msg").text("token验证错误，请重新登录！").show();
    } */
    if(outAlter=='100012'){
        $("#login_form .error_msg").text("当前账号在别处登录，请重新登录！").show();
    }
    /* if(outAlter=='100013'){
        $("#login_form .error_msg").text("认证信息不存在，请重新登录！").show();
    } */
});



// import i18next from 'i18next';
// import jqueryI18next from 'jquery-i18next';
// import translationZn from '@/i18n/zn-CN';
// import translationEn from '@/i18n/en-US';

// i18next.init({
//     lng: 'zn-CN',
//     resources: {
//         'zn-CN': {
//             translation: translationZn
//         }
//     }
// }).then((t) => {
//     jqueryI18next.init(i18next, $);

//     $('<div class="nav"><span data-i18n="home.user.modify.title"></span></div>').localize().appendTo('body')
// })
