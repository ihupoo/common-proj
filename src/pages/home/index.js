import $ from 'jquery-migrate';

import '@/styles/reset.scss';

import '@/lib/ezmark/ezmark.scss';
// import '@/lib/artDialog/4.1.7/skins/simple.css';
// import '@/lib/imgareaselect/imgareaselect-default.css';
// import '@/lib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar.css';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';
// import '@/styles/reset-artDialog.scss';
// import '@/styles/reset-mCustomScrollbar.scss';
import '@/styles/reset-easyui.scss';


import './css/boot.scss';
import './css/home.scss';
import './css/theme.scss';
// import '@/lib/portal/mo-portal.css';


// import '@/lib/artDialog/4.1.7/jquery.artDialog.min';

// import '@/lib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar';
import 'ezmark'

//todo
{/* 
<script src="${RESOUCE_STATIC_URL}/js/jlib/components/mo-portal.min.js?t=6.0.2184442885"></script>

<script src="${RESOUCE_STATIC_URL}/js/home/header-email.js?t=6.0.3480032774"></script> */}


import Store from '@/store/index';
import { setBaseUrl, AjaxComplete } from '@/utils/common';
import { fetchUserMenu, fetchUserInfo } from '@/api/service';
// import { fetchHomeMenu } from './service';
import { MoConfirm } from '@/components/popup';

import { i18next, documentTitle } from '@/i18n';
import TemplateHeader from '@/components/tpl/header';
import TemplateFooter from '@/components/tpl/footer.art';
import TemplateMain from './tpl/main';
import TemplateSystemModules from './tpl/systemModules';
import { fetchHomeInfo } from './service';



function pageRender({ sysBrand, lang = 'zn-CN', versionYear = '2019', BASE_URL, user = {} , menu = [] } = {}) {
    $('body').addClass(`theme-${sysBrand}`);

    i18next.changeLanguage(lang)
    TemplateHeader.render('.sys-info-wrapper', { sysBrand, user, BASE_URL })

    TemplateSystemModules.render('.module-entry-wrapper', { user, menu })
    TemplateMain.render('main', { user, menu })


    //todo

    $('#footer .footer_content').empty().append($(TemplateFooter({ sysBrand, versionYear })).localize())
    document.title = documentTitle(sysBrand)('home')
}

setBaseUrl()

$(function () {
    const config = JSON.parse(localStorage.getItem('system_config') || {})
    Store.dispatch({
        type: 'save',
        payload: {
            ...config
        }
    })

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
            //todo 没获取到，跳转login?

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



        
        const { sysBrand, lang, versionYear, BASE_URL, user, menu } = Store.getState()

        pageRender({ sysBrand, lang, versionYear, BASE_URL, user, menu })

        TemplateHeader.setPortrait(user.portrait40, user.portraitDomain);

        if (user.passwordExpire) {
            let pwdExpire = parseInt(user.passwordExpire)
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

    

        if (user.jmsType === '1') {
            var jmsConfigLink = $('#jmsConfig');
            if (user.jmsConfigGuideUrl) { //如果jmsConfigGuideUrl为空，false，null或undefined
                jmsConfigLink.attr('href', user.jmsConfigGuideUrl);
                jmsConfigLink.parent().show();
            }
        }

        // if ((isServiceDomainAdmin || meetingAdmin || (isSimpleMcu && isUserDomainAdmin)) && '1' !== licenseInvalidWarn) {
        //     $.getJSON(BASE_URL + '/checkLicenseIsInvalid', function (msg) {
        //         if (msg.success) {
        //             var data = msg.data;
        //             if (typeof data === 'number' && data >= 0) {
        //                 Portal.Dialog({
        //                     id: 'licenseWarn',
        //                     content: template('license-warn-dialog', { days: data }),
        //                     okBtn: false,
        //                     cancelText: '关闭',
        //                     cancelFn: function () {
        //                         if (licenseWarnCheckbox.getValue()) {
        //                             $.post(BASE_URL + '/saveLicenseWarnStatus', function () { }, 'json');
        //                         }
        //                     },
        //                 });
        //                 var licenseWarnCheckbox = Portal.Checkbox('#license-warn-checkbox', {
        //                     name: 'licenseWarnCheckbox',
        //                     data: {
        //                         id: "licenseWarnCheckbox",
        //                         name: "今日不再提醒",
        //                         value: "0"
        //                     }
        //                 });
        //             }
        //         }
        //     });
        // }
        



    })()


    
    AjaxComplete()
})
