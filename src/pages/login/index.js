import $ from 'jquery-migrate';
import 'jquery.namespace';
import 'ezmark'

import '@/lib/ezmark/ezmark.scss'

import '@/styles/reset.scss'
import '@/styles/common.scss'
import '@/styles/commonCSS.scss'

import './css/login.scss';
import './css/theme.scss';

import {} from '@/utils/utils';
import { Common, MoBaseAccount } from '@/utils/common';
import { DigestAuth } from '@/utils/digestAuth'
import './js/_tmp_globalUrl'
import { Login } from './js/login';


import { fetchLoginInfo } from './service';
import renderHeader from './tpl/sys_logo.art';
import renderFooter from './tpl/enterprise_introduce.art';


import Store from '@/store/index';
import { i18next , documentTitle } from '@/i18n';


function isIE() {
    return !!(window.ActiveXObject || "ActiveXObject" in window)
}

$(function () {
    $('input[type="checkbox"]').ezMark();

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

    fetchLoginInfo().then(res => {
        if (res.success && res.data) {
            const showVerifyCode = res.data.showVerifyCode;
            const realmName = res.data.realmName;
            const nonceValue = res.data.nonceValue;
            const outAlter = res.data.outAlter;
            const versionYear = res.data.versionYear;
            const loginUserName = res.data.loginUserName;
            const sysBrand = res.data.sysBrand


            //将sysBrand，versionYear保存到store ??
            $('body').addClass(`theme-${sysBrand}`);

            $('#verifyImage').attr('src', `${BP.config.SYSTEM_URL}/verifyImage`)
            $('.email_input_holder .login-input').val(loginUserName)

            $('body').addClass(`theme-${sysBrand}`);


            // i18next.changeLanguage('en-US')

            $('#login_form').localize();
            $(renderHeader({ sysBrand })).localize().appendTo('#login_header .sys_logo');
            $(renderFooter({ sysBrand, versionYear })).localize().appendTo('#footer');
            document.title = documentTitle(sysBrand)('login')

            Login.init();
            Login.initVerifyCode();
            window.onresize = function () {
                Login.init();
            }
            if (outAlter == '100012') {
                $("#login_form .error_msg").text("当前账号在别处登录，请重新登录！").show();
            }

        }
    }).catch(err => {

    })
});



