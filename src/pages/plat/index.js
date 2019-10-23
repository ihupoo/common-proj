import $ from 'jquery-migrate';
import 'ezmark'

import '@/styles/reset.scss';

import '@/lib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar.css';
import '@/lib/imgareaselect/imgareaselect-default.css';
import '@/lib/artDialog/4.1.7/skins/simple.css';
import '@/lib/ezmark/ezmark.scss';
import '@/lib/portal/mo-portal.css';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';
import '@/styles/reset-artDialog.scss';
import '@/styles/reset-mCustomScrollbar.scss';
import '@/styles/reset-easyui.scss';
import '@/styles/password.scss';

import './css/theme.scss';
import './css/plat.scss';
import './css/set.scss';

import ModifyPortrait from '@/utils/modifyPortrait';
import { Common, setBaseUrl, InputPreventAutocomplete, AjaxComplete } from '@/utils/common';
import { Password } from '@/utils/password';
import {  } from './js/plat';

import Store from '@/store/index';
import { i18next, documentTitle } from '@/i18n';
import { fetchPlat } from './service';
import TemplateHeader from '@/components/tpl/header.art';
import TemplateFooter from '@/components/tpl/footer.art';

function pageRender({ sysBrand, lang = 'zn-CN', versionYear = '2019', user, BASE_URL } = {}) {
    $('body').addClass(`theme-${sysBrand}`);
    i18next.changeLanguage(lang)
    $('#header-logo').empty().append($(TemplateHeader({ sysBrand, user, BASE_URL })).localize())
    $('#footer .footer_content').empty().append($(TemplateFooter({ sysBrand, versionYear })).localize())
    document.title = documentTitle(sysBrand)('home')
}

setBaseUrl()

let options = {
    strongAuthentication: true,
    checkUsed: true
}
const { sysBrand, lang, versionYear, user, BASE_URL } = Store.getState();

$(function () {
    $("#modifyPortrait").hide();

    (async () => {
        let [plat] = await Promise.all([
            fetchPlat()
        ])
        if (plat && plat.success && plat.data) {
            Store.dispatch({
                type: 'save',
                payload: {
                    ...plat.data
                }
            })
            pageRender({ sysBrand, lang, versionYear, user, BASE_URL })
        } else {
            pageRender()
        }

        if (plat && plat.success && plat.data) {
            //处理页面中数据
            // let passwordStrength = user.securityPolicy.passwordStrength;
            // if (passwordStrength == 2) {
            //     $('.password-tip').text('密码等级应为中或者强');
            // } else if (passwordStrength == 3) {
            //     $('.password-tip').text('密码等级应为强');
            // }
            // $('#moid').val(user.moid);
            // $('#account1').text(user.account);
            // $('#mobile').val(user.mobile);
            // $('#email').val(user.email);
            // $('#officeLocation').val(user.seat);
            
            //调用
            CoreSetFrame.initCoreSetPage();
            $(window).resize(function () {
                CoreSetFrame.initCoreSetPage();
            });
            CoreUpdataAccount.init();
            CoreSet.init();
            ModifyPortrait.initUpload();
            Common.setDefaultImg('.user-info');
            Common.initPortrait(user.portrait40, user.portraitDomain);
            if (user.portrait256 && user.portraitDomain) {
                let domain = '//' + portraitDomain + '/';
                $('.img_32').attr('src', domain + user.portrait40);
                $('.img_64').attr('src', domain + user.portrait64);
                $('.img_128').attr('src', domain + user.portrait128);
                $('.img_256').attr('src', domain + user.portrait256);
            }
            Password.init(options);
        }
    })()

    InputPreventAutocomplete()
    AjaxComplete()

})
