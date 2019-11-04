import $ from 'jquery-migrate';

import '@/styles/reset.scss';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';


import './css/boot.scss';
import './css/home.scss';
import './css/theme.scss';


import Store from '@/store/index';
import { setBaseUrl, AjaxComplete } from '@/utils/common';
import { fetchUserMenu, fetchUserInfo, fetchSystemConfig } from '@/api/service';
import { MoConfirm } from '@/components/popup';

import { i18next, documentTitle } from '@/i18n';
import TemplateHeader from '@/components/tpl/header';
import TemplateFooter from '@/components/tpl/footer.art';
import TemplateMain from './tpl/main';
import TemplateSystemModules from './tpl/systemModules';
import TemplateLicense from './tpl/license';
import { fetchHomeInfo } from './service';



function pageRender({ sysBrand, lang , versionYear, BASE_URL, user , menu }) {
    $('body').addClass(`theme-${sysBrand}`);

    i18next.changeLanguage(lang)
    TemplateHeader.render('.sys-info-wrapper', { sysBrand, user, BASE_URL })

    TemplateSystemModules.render('.module-entry-wrapper', { user, menu })
    TemplateMain.render('main', { user, menu })

    $('#footer .footer_content').empty().append($(TemplateFooter({ sysBrand, versionYear })).localize())
    document.title = documentTitle(sysBrand)('home')
}

setBaseUrl()
AjaxComplete()

const config = JSON.parse(localStorage.getItem('system_config') || '{}')

if($.isEmptyObject(config)){
    //缓存被清，重新登录
    // location.href = Store.getState('BASE_URL') + '/login'
}else{
    Store.dispatch({
        type: 'save',
        payload: {
            ...config
        }
    })
}

;(async () => {
    let [resUser, resUserMenu, resMenu] = await Promise.all([
        fetchUserInfo(),
        fetchUserMenu(),
        fetchHomeInfo()
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


    if (resMenu && resMenu.success && resMenu.data) {
        Store.dispatch({
            type: 'save',
            payload: {
                menu : resMenu.data
            }
        })

    } else {
        //todo url没获取到的 初始缺省值
    }

    
    const { sysBrand, lang = 'zn-CN', versionYear = '2019', BASE_URL, user = {}, menu = {} } = Store.getState()

    pageRender({ sysBrand, lang, versionYear, BASE_URL, user, menu })

    const { 
        portrait40, 
        portraitDomain, 
        passwordExpire, 
        serviceDomainAdmin,
        meetingAdmin,
        userDomainAdmin,
        jmsType,
    } = user

    const { licenseInvalidWarn } = menu

    TemplateHeader.setPortrait(portrait40, portraitDomain);

    if (passwordExpire) {
        let pwdExpire = parseInt(passwordExpire)
        if (pwdExpire > -1) {
            MoConfirm('您的密码有效期剩余' + pwdExpire + '天，是否进行密码修改？', function (bool) {
                if (bool) {
                    location.href = 'set#password';
                }
            }, '修改密码');
        }
    }

    if (window.innerHeight - $("main").outerHeight() - $(".header-wrapper").outerHeight(true) > 103) {
        $("main").height(window.innerHeight - 103 - $(".header-wrapper").outerHeight(true))
    }

    $(window).on("resize", function () {
        if (window.innerHeight - $("main").outerHeight() - $(".header-wrapper").outerHeight(true) > 103) {
            $("main").height(window.innerHeight - 103 - $(".header-wrapper").outerHeight(true))
        }
    });


    if ((serviceDomainAdmin || meetingAdmin || (jmsType === 1 && userDomainAdmin)) &&  licenseInvalidWarn !== 1) {
        $.getJSON(BASE_URL + '/checkLicenseIsInvalid', function (msg) {
            if (msg.success) {
                let data = msg.data;
                if (typeof data === 'number' && data >= 0) {
                    TemplateLicense.render({ days: data })
                }
            }
        });
    }
    

})()


    

