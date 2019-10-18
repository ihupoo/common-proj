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

import { Password } from '@/utils/password.js';
import { DigestAuth } from '@/utils/digestAuth.js';
import '@/utils/common.js';
import '@/lib/uploader/fileuploader.js';
import '@/utils/utils.js';
import '@/utils/md5.js';
import '@/utils/sm.js';

import './css/theme.scss';
import './css/set.scss';
import './css/core.scss';
import { UpdataAccount } from './js/core';

import { i18next, documentTitle } from '@/i18n';
import renderHeader from '@/tpl/header.art';
import renderFooter from '@/tpl/footer.art';
import store from '@/store/index';

let sysBrand = store.getState('sysBrand');
let versionYear = store.getState('versionYear');
let options = {
    oldPasswordId: "#oldPassword",
    newPasswordId: "#newPassword",
    confirmPasswordId: "#confirmPassword",
    strongAuthentication: true,
    checkUsed: true
}

$(function () {
    $('body').addClass(`theme-${sysBrand}`);
    $(renderHeader({ sysBrand, currentuser })).localize().appendTo('#header-logo');
    $(renderFooter({ sysBrand, versionYear })).localize().appendTo('#footer .footer_content');
    document.title = documentTitle(sysBrand)('home');

    CoreData.init();
    DigestAuth.realm = CoreData.realmName;
    DigestAuth.username = currentuser.moid;
    UpdataAccount.init();
    $("#modifyPortrait").hide();
    Set.init();
    CoreFrame.initCoreSetPage();
    $(window).resize(function () {
        CoreFrame.initCoreSetPage();
    });
    Password.init(options);
    Password.capitalTip("oldPassword")
    Password.capitalTip("newPassword")
    Password.capitalTip("confirmPassword");
    ModifyPortait.initUpLoad();
    Common.setDefaultImg('.user-info');
    Common.initPortrait(portrait40, portraitDomain);
    if (portrait256 && portraitDomain) {
        var domain = '//' + portraitDomain + '/';
        $('.img_32').attr('src', domain + portrait40);
        $('.img_64').attr('src', domain + portrait64);
        $('.img_128').attr('src', domain + portrait128);
        $('.img_256').attr('src', domain + portrait256);
    }
    $("#help").attr("href", "${RESOUCE_STATIC_URL}/${sysBrand}/help/default.html");
})