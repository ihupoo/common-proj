import $ from 'jquery-migrate';
import 'jquery.namespace';
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
import '@/utils/common.js';


import './css/home.scss';
import './css/boot.scss';
import './css/theme.scss';


import './js/initTemplate.js';
import './js/home.js';
import './js/detail.js';

import renderHeader from './tpl/header.art';
import renderFooter from './tpl/footer.art';

import store from '@/store/index';
import { i18nUtil } from '@/utils/i18n.js';

let sysBrand = store.getState('sysBrand');
let versionYear = store.getState('versionYear');

$(function () {

    $('body').addClass(`theme-${sysBrand}`);
    i18nUtil(renderFooter, { sysBrand, versionYear }, '#footer .footer_content');
    i18nUtil(renderHeader, { sysBrand }, '#header_title_logo');

    Home.Data.init();
    initHome.init();
    envent.initEvent();
    // $(".setting").on("click", function (e) {
    //     if ($(this).hasClass('disabled')) {
    //         return
    //     }
    //     $("#nav-sublist-notify").removeClass("hover");
    //     $(".setting-list").toggle();
    //     if (e.stopPropagation)
    //         e.stopPropagation();
    //     else
    //         e.cancelBubble = true;
    // })
    // $(document).on("click", function () {
    //     $(".setting-list").hide();
    //     $(".public-private-cloud").hide(0, function () {
    //         $(".cloud-name").removeClass("active");
    //         $(".arrow").removeClass("active");
    //     });
    // });

    // $("#modifyUser").on("click", function () {
    //     $(".setting-list").hide();
    //     location.href = 'core.html';
    // });

    
    
})
