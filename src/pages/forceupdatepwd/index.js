import $ from 'jquery-migrate';

import '@/styles/reset.scss';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';
import '@/styles/password.scss';
import '@/styles/set.scss';

import './css/forceupdatepwd.scss';
import './css/theme.scss';


import { setBaseUrl, InputPreventAutocomplete, AjaxComplete } from '@/utils/common';
import { Password } from '@/utils/password';
import { DigestAuth } from '@/utils/digestAuth';
import { ForcePwd } from './js/forceupdatepwd';
import { fetchForcePwd } from './service';

import Store from '@/store/index';
import { i18next, documentTitle } from '@/i18n';
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
    strongAuthentication: true
}

$(function () {
    (async () => {
        let [force] = await Promise.all([
            fetchForcePwd()
        ])
        if (force && force.success && force.data) {
            Store.dispatch({
                type: 'save',
                payload: {
                    ...force.data
                }
            })
            pageRender({ sysBrand, lang, versionYear, user, BASE_URL })
        } else {
            pageRender()
        }

        if (force && force.success && force.data) {
            //处理页面中数据
            let data = force.data;
            DigestAuth.realm = data.realmName;
            DigestAuth.username = data.email;
            let passwordStrength = data.securityPolicy.passwordStrength;
            let description = data.description;
            if (passwordStrength == 2) {
                $('#errMsg').val(description + '密码等级应为中或者强');
            } else if (passwordStrength == 3) {
                $('#errMsg').val(description + '密码等级应为强');
            }
            $('#moid').val(user.moid);
            if ($('#oldPassword').val() == '' && $('#newPassword').val() == '' && $('#confirmPassword').val() == '') {
                $("#detail-btn-save").addClass('disabled');
            }
            $("#detail-btn-cancel").click(function () {
                location.href = Store.getState('BASE_URL') + "/login.html";
            })

            TemplateHeader.setPortrait(user.portrait40, user.portraitDomain);
            Password.init(options);
            ForcePwd.init();
        }
    })()



    InputPreventAutocomplete()
    AjaxComplete()
})
