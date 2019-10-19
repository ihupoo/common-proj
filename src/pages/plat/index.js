import $ from 'jquery-migrate';
import 'jquery.namespace';
import 'ezmark'

import '@/styles/reset.scss';

import '@/lib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar.css';
import '@/lib/imgareaselect/imgareaselect-default.css';
import '@/lib/artDialog/4.1.7/skins/simple.css';
import '@/lib/ezmark/ezmark.scss';
import '@/lib/portal/mo-portal.css';
import '@/lib/portal/mo-portal.js';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';
import '@/styles/reset-artDialog.scss';
import '@/styles/reset-mCustomScrollbar.scss';
import '@/styles/reset-easyui.scss';
import '@/styles/password.scss';
import '@/utils/password.js';
import '@/utils/digestAuth.js';
import '@/utils/common.js';

import '@/lib/uploader';
import '@/lib/sm';
import '@/lib/md5';

import '@/utils/utils.js';


import './css/theme.scss';
import './css/set.scss';
import './css/plat.scss';
import './js/plat.js';

import { i18nUtil, i18nHomeTitle } from '@/utils/i18n.js';
import renderHeader from '@/tpl/header.art';
import renderFooter from '@/tpl/footer.art';
import store from '@/store/index';
import { getPlatData } from './service.js';

//注入的数据，标记ajax
let sysBrand = store.getState('sysBrand');
let versionYear = store.getState('versionYear');
let currentuser = store.getState('currentuser');
$.namespace("Plat.Data");
Plat.Data = {
    username: currentuser.account,
    portrait40: currentuser.portrait40,
    portrait64: currentuser.portrait64,
    portrait128: currentuser.portrait128,
    portrait256: currentuser.portrait256,
    editName: '',
    realmName: '',
    systemSecurity: '',
    strengthRegular: '',
    passwordStrengthOfSecurityPolicy: '',
    portraitDomain: '',
    init() {
        getPlatData().then(res => {
            if (res.success && res.data) {
                this.editName = res.data.editName;
                this.realmName = res.data.realmName;
                this.systemSecurity = res.data.systemSecurity;
                this.strengthRegular = res.data.strengthRegular;
                this.passwordStrengthOfSecurityPolicy = res.data.securityPolicy.passwordStrength;
                this.portraitDomain = res.data.portraitDomain;
            }
        })
    }
}
let options = {
    oldPasswordId: "#oldPassword",
    newPasswordId: "#newPassword",
    confirmPasswordId: "#confirmPassword",
    strongAuthentication: true,
    checkUsed: true
}

$(function () {
    //引入头部底部模板文件
    $('body').addClass(`theme-${sysBrand}`);
    i18nUtil(renderHeader, { sysBrand, currentuser }, '#header-logo');
    i18nUtil(renderFooter, { sysBrand, versionYear }, '#footer .footer_content');
    i18nHomeTitle(sysBrand);

    //如何获取art模板中的$('.setting') ???
    $(".setting").on("click", function (e) {
        if ($(this).hasClass('disabled')) {
            return
        }
        $("#nav-sublist-notify").removeClass("hover");
        $(".setting-list").toggle();
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    })
    $(document).on("click", function () {
        $(".setting-list").hide();
        $(".public-private-cloud").hide(0, function () {
            $(".cloud-name").removeClass("active");
            $(".arrow").removeClass("active");
        });
    });

    $("#modifyUser").on("click", function () {
        $(".setting-list").hide();
        location.href = 'core.html';
    });
    if (currentuser.cloudModelDisplay == '0') {
        $('#cloudstyle').css('display', 'none');
    }

    //各种初始化
    Plat.Data.init();
    Mo.Base.DigestAuth.realm = Plat.Data.realmName;
    Mo.Base.DigestAuth.username = currentuser.moid;
    Mo.updataAccount.init();
    Mo.ExtNum.init();
    Mo.Set.init();
    Mo.SetFrame.loadPlatSet();
    $(window).resize(function () {
        Mo.SetFrame.loadPlatSet();
    });
    Mo.Password.init(options);
    Mo.Password.capitalTip("oldPassword");
    Mo.Password.capitalTip("newPassword");
    Mo.Password.capitalTip("confirmPassword");
    SSO.common.modifyPortait.initUpLoad();
    SSO.common.setDefaultImg('.user-info');
    SSO.common.initPortrait(Plat.Data.portrait40, Plat.Data.portraitDomain);
    if (Plat.Data.portrait256 && Plat.Data.portraitDomain) {
        var domain = '//' + portraitDomain + '/';
        $('.img_32').attr('src', domain + portrait40);
        $('.img_64').attr('src', domain + portrait64);
        $('.img_128').attr('src', domain + portrait128);
        $('.img_256').attr('src', domain + portrait256);
    }
    $("#help").attr("href", "${RESOUCE_STATIC_URL}/${sysBrand}/help/default.html");
})
