import $ from 'jquery-migrate';

import '@/styles/reset.scss';

import '@/styles/common.scss';
import '@/styles/commonCSS.scss';
import '@/styles/password.scss';
import '@/styles/set.scss';

import './css/theme.scss';
import './css/plat.scss';

import ModifyPortrait from '@/utils/modifyPortrait';
import { setBaseUrl, InputPreventAutocomplete, AjaxComplete } from '@/utils/common';
import { Password } from '@/utils/password';
import { PlatSetFrame, PlatUpdataAccount, ExtNum, PlatSet } from './js/plat';

import Store from '@/store/index';
import { i18next, documentTitle } from '@/i18n';
import { fetchPlat } from './service';
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
            pageRender({
                sysBrand,
                lang,
                versionYear,
                user,
                BASE_URL
            })
        } else {
            pageRender()
        }

        if (plat && plat.success && plat.data) {
            //处理页面中数据
            $('#sex_m').on('click', function () {
                $(this).parent().addClass('ez-selected').siblings('div').removeClass('ez-selected');
                $(this).attr('checked', 'checked').parent().siblings('div').children('input').attr('checked', false);
            })
            $('#sex_w').on('click', function () {
                $(this).parent().addClass('ez-selected').siblings('div').removeClass('ez-selected');
                $(this).attr('checked', 'checked').parent().siblings('div').children('input').attr('checked', false);
            })
            let data = plat.data;
            let passwordStrength = user.securityPolicy.passwordStrength;
            if (passwordStrength == 2) {
                $('.password-tip').text('密码等级应为中或者强');
            } else if (passwordStrength == 3) {
                $('.password-tip').text('密码等级应为强');
            }
            if (data.editName) {
                $('#name > input').attr('type', 'text');
                $('#name > input').val(user.name);
            } else {
                $('#name > span').text(user.name);
            }
            $('#moid').val(user.moid);
            $('#account1').text(user.account);
            $('#mobile').val(user.mobile);
            $('#email').val(user.email);
            $('#seat').val(user.seat);
            $('#extNum').val(user.extNum);
            $('#e164').text(user.e164);
            $('#birthday').datebox(user.birthday);
            $('#fax').val(user.fax);
            $('#flagName').text(user.depts); //todo
            $('#flagPosition').text(user.depts); //todo
            $('#sexId  div').on('click', function () {
                $(this).addClass('ez-selected');
            })
            user.sex == '1' ? $('#sex_m').parent().addClass('ez-selected') : $('#sex_w').parent().addClass('ez-selected');
            //调用
            PlatSetFrame.loadPlatSet();
            $(window).resize(function () {
                PlatSetFrame.loadPlatSet();
            });
            PlatUpdataAccount.init();
            ExtNum.init();
            PlatSet.init();
            ModifyPortrait.initUpload();

            TemplateHeader.setPortrait(user.portrait40, user.portraitDomain);
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
