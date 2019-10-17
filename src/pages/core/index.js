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
import '@/styles/fileuploader.scss';
import '@/styles/password.scss';
import '@/utils/password.js';
import '@/utils/digestAuth.js';
import '@/utils/common.js';
import '@/utils/fileuploader.js';
import '@/utils/utils.js';
import '@/utils/md5.js';
import '@/utils/sm.js';
import '@/utils/browser-polyfill.min.js';

import './css/theme.scss';
import './css/set.scss';
import './css/core.scss';
import './js/core.js';

import { i18nUtil, i18nHomeTitle } from '@/utils/i18n.js';
import renderHeader from '@/tpl/header.art';
import renderFooter from '@/tpl/footer.art';
import store from '@/store/index';
import { getCoreData } from './service.js';

let sysBrand = store.getState('sysBrand');
let versionYear = store.getState('versionYear');
let currentuser = store.getState('currentuser');

$.namespace("Core.Data");
Core.Data = {
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
        getCoreData().then(res => {
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

var options = {
    oldPasswordId: "#oldPassword",
    newPasswordId: "#newPassword",
    confirmPasswordId: "#confirmPassword",
    strongAuthentication: true,
    checkUsed: true
}

$(function () {
    let sysBrand = store.getState('sysBrand');
    let versionYear = store.getState('versionYear');
    $('body').addClass(`theme-${sysBrand}`);
    i18nUtil(renderHeader, { sysBrand, currentuser }, '#header-logo');
    i18nUtil(renderFooter, { sysBrand, versionYear }, '#footer .footer_content');
    i18nHomeTitle(sysBrand);

    Core.Data.init();
    Mo.Base.DigestAuth.realm = Core.Data.realmName;
    Mo.Base.DigestAuth.username = currentuser.moid;
    Mo.updataAccount.init();
    $("#modifyPortrait").hide();
    Mo.Set.init();
    Mo.SetFrame.initCoreSetPage();
    $(window).resize(function () {
        Mo.SetFrame.initCoreSetPage();
    });
    Mo.Password.init(options);
    Mo.Password.capitalTip("oldPassword")
    Mo.Password.capitalTip("newPassword")
    Mo.Password.capitalTip("confirmPassword");
    SSO.common.modifyPortait.initUpLoad();
    SSO.common.setDefaultImg('.user-info');
    SSO.common.initPortrait(portrait40, portraitDomain);
    if (portrait256 && portraitDomain) {
        var domain = '//' + portraitDomain + '/';
        $('.img_32').attr('src', domain + portrait40);
        $('.img_64').attr('src', domain + portrait64);
        $('.img_128').attr('src', domain + portrait128);
        $('.img_256').attr('src', domain + portrait256);
    }
    $("#help").attr("href", "${RESOUCE_STATIC_URL}/${sysBrand}/help/default.html");
    

})