import $ from 'jquery-migrate';

import '@/styles/reset.scss';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';
import '@/styles/password.scss';
import '@/styles/set.scss';

import './css/theme.scss';
import './css/core.scss';

import Store from '@/store/index';
import { i18next, documentTitle } from '@/i18n';
import { fetchUserMenu, fetchUserInfo } from '@/api/service';
import TemplateHeader from '@/components/tpl/header';
import TemplateFooter from '@/components/tpl/footer.art';

import ModifyPortrait from '@/utils/modifyPortrait';
import { setBaseUrl, InputPreventAutocomplete, AjaxComplete } from '@/utils/common';
import { Password } from '@/utils/password';
import { DigestAuth } from '@/utils/digestAuth';
import { CoreSetFrame, CoreUpdataAccount, CoreSet } from './js/core';

function pageRender({ sysBrand, lang, versionYear, user, BASE_URL } = {}) {
    $('body').addClass(`theme-${sysBrand}`);
    i18next.changeLanguage(lang)
    TemplateHeader.render('#header-logo', { sysBrand, user, BASE_URL })
    $('#footer .footer_content').empty().append($(TemplateFooter({ sysBrand, versionYear })).localize())
    document.title = documentTitle(sysBrand)('home')
}

setBaseUrl()
InputPreventAutocomplete()
AjaxComplete()

let options = {
    strongAuthentication: true,
    checkUsed: true
}
const config = JSON.parse(localStorage.getItem('system_config') || '{}')

if ($.isEmptyObject(config)) {
    //缓存被清，重新登录
    // location.href = Store.getState('BASE_URL') + '/login'
} else {
    Store.dispatch({
        type: 'save',
        payload: {
            ...config
        }
    })
}
$("#modifyPortrait").hide();

(async () => {
    let [resUser, resUserMenu] = await Promise.all([
        fetchUserInfo(),
        fetchUserMenu()
    ])
    if (resUser && resUser.success && resUser.data) {
        Store.dispatch({
            type: 'save',
            payload: {
                user: resUser.data
            }
        })
    } else {
        //todo 没获取到，跳转login
        // location.href = Store.getState('BASE_URL') + '/login'
    }

    if (resUserMenu && resUserMenu.success && resUserMenu.data) {
        Store.dispatch({
            type: 'save',
            payload: {
                user: {
                    ...Store.getState('user'),
                    ...resUserMenu.data
                }
            }
        })

    } else {
        //todo 没获取到的 初始缺省值
    }


    const { sysBrand, lang = 'zn-CN', versionYear = '2019', BASE_URL, user = {}, menu = {}, realmName } = Store.getState();
    pageRender({ sysBrand, lang, versionYear, user, BASE_URL });

    //处理页面中数据
    DigestAuth.realm = realmName;
    DigestAuth.username = user.moid;
    let passwordStrength = user.securityPolicy.passwordStrength;
    if (passwordStrength == 2) {
        $('.password-tip').text('密码等级应为中或者强');
    } else if (passwordStrength == 3) {
        $('.password-tip').text('密码等级应为强');
    }
    $('#moid').val(user.moid);
    $('#account1').text(user.account);
    $('#mobile').val(user.mobile);
    $('#email').val(user.email);
    $('#officeLocation').val(user.seat);

    //调用
    CoreSetFrame.initCoreSetPage();
    $(window).resize(function () {
        CoreSetFrame.initCoreSetPage();
    });
    CoreUpdataAccount.init();
    CoreSet.init();
    ModifyPortrait.initUpload();

    TemplateHeader.setPortrait(user.portrait40, user.portraitDomain);

    if (user.portrait256 && user.portraitDomain) {
        let domain = '//' + user.portraitDomain + '/';
        $('.img_32').attr('src', domain + user.portrait40);
        $('.img_64').attr('src', domain + user.portrait64);
        $('.img_128').attr('src', domain + user.portrait128);
        $('.img_256').attr('src', domain + user.portrait256);
    }
    Password.init(options);
})()




