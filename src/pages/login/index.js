import $ from 'jquery-migrate';
import 'ezmark'

import '@/lib/ezmark/ezmark.scss'

import '@/styles/reset.scss'
import '@/styles/common.scss'
import '@/styles/commonCSS.scss'

import './css/login.scss';
import './css/theme.scss';

import Store from '@/store/index';
import { i18next, documentTitle } from '@/i18n';
import { setBaseUrl, InputPreventAutocomplete, AjaxComplete } from '@/utils/common';
import { DigestAuth } from '@/utils/digestAuth';
import { fetchSystemConfig } from '@/api/service';
import { fetchLoginInfo } from './service';
import { Login } from './js/login';
import TemplateHeader from './tpl/header.art';
import TemplateFooter from './tpl/footer.art';


function isIE() {
    return !!(window.ActiveXObject || "ActiveXObject" in window)
}

function pageRender({ sysBrand, lang = 'zn-CN', versionYear = '2019' } = {}) {
    $('body').addClass(`theme-${sysBrand}`);
    $('#verifyImage').attr('src', `${Store.getState('BASE_URL')}/verifyImage`)

    i18next.changeLanguage(lang)
    $('#login_form').localize();
    $('#login_header .sys_logo').empty().append($(TemplateHeader({ sysBrand })).localize())
    $('#footer').empty().append($(TemplateFooter({ sysBrand, versionYear })).localize())
    document.title = documentTitle(sysBrand)('login')
}

setBaseUrl()

Login.init();


$(function () {
    $('input[type="checkbox"]').ezMark();

    if (isIE()) {
        $("#password").removeAttr("readonly");
    }

    const userName = localStorage.getItem('user')?.userName;
    $('#email').val(userName);

    ;(async () => {
        let [resConfig, resInfo] = await Promise.all([
            fetchSystemConfig(),
            fetchLoginInfo()
        ])
        if (resConfig && resConfig.success && resConfig.data) {
            Store.dispatch({
                type: 'save',
                payload: {
                    ...resConfig.data
                }
            })
            localStorage.setItem('system_config', resConfig.data)

            const { sysBrand, lang, versionYear } = Store.getState()
            pageRender({ sysBrand, lang, versionYear })

        } else {
            pageRender()
        }


        if (resInfo && resInfo.success && resInfo.data) {
            const { outAlter, showVerifyCode, nonceValue } = resInfo.data

            if (showVerifyCode && showVerifyCode == '1') {
                $(".verifyCode_input_holder").removeClass("hidden");
                $('#verifyImage').attr('src', `${Store.getState('BASE_URL')}/verifyImage?random=${new Date().getTime()}`)
            }

            if (outAlter == '100012') {
                $("#login_form .error_msg").text("当前账号在别处登录，请重新登录！").show();
            }

            DigestAuth.setValue('nonce', nonceValue);


        } else {
            //todo
        }
    })()

    InputPreventAutocomplete()
    AjaxComplete()

});



