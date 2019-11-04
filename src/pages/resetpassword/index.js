import $ from 'jquery-migrate';

import '@/styles/reset.scss';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';
import '@/styles/password.scss';
import '@/styles/set.scss';

import './css/resetpassword.scss';
import './css/theme.scss';

import { Size, setBaseUrl, InputPreventAutocomplete, AjaxComplete } from '@/utils/common';
import { Password } from '@/utils/password';
import { DigestAuth } from '@/utils/digestAuth';
import { ResetPwd } from './js/resetpassword';

import Store from '@/store/index';
import { i18next, documentTitle } from '@/i18n';
import { fetchResetPwd } from './service';
import TemplateHeader from '@/components/tpl/header';
import TemplateFooter from '@/components/tpl/footer.art';

function pageRender({ sysBrand, lang = 'zn-CN', versionYear = '2019', user, BASE_URL } = {}) {
    $('body').addClass(`theme-${sysBrand}`);
    i18next.changeLanguage(lang)
    TemplateHeader.render('#header-logo', { sysBrand, user, BASE_URL })
    $('#footer .footer_content').empty().append($(TemplateFooter({ sysBrand, versionYear })).localize())
    document.title = documentTitle(sysBrand)('home')
}

setBaseUrl()
const { sysBrand, lang, versionYear, user, BASE_URL } = Store.getState();
let options = {
    strongAuthentication: true,
    checkUsed: true
}

$(function () {
    (async () => {
        let [reset] = await Promise.all([
            fetchResetPwd()
        ])
        if (reset && reset.success && reset.data) {
            Store.dispatch({
                type: 'save',
                payload: {
                    ...reset.data
                }
            })
            pageRender({ sysBrand, lang, versionYear, user, BASE_URL })
        } else {
            pageRender()
        }

        if (reset && reset.success && reset.data) {
            //处理页面中数据
            let data = reset.data;
            DigestAuth.realm = data.realmName;
            DigestAuth.username = data.email;
            let passwordStrength = data.securityPolicy.passwordStrength;
            if (passwordStrength == 2) {
                $('#errMsg').val('密码等级应为中或者强');
            } else if (passwordStrength == 3) {
                $('#errMsg').val('密码等级应为强');
            }
            $('#email').val(user.email);
            $('#sequenceNum').val(user.sequenceNum);
            //调用
            Size.experirdpageInit();
            Password.init(options);
            ResetPwd.init();
        }
    })()

    InputPreventAutocomplete()
    AjaxComplete()
})
