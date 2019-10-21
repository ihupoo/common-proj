import $ from 'jquery-migrate';
import 'ezmark'

import '@/lib/ezmark/ezmark.scss'

import '@/styles/reset.scss'
import '@/styles/common.scss'
import '@/styles/commonCSS.scss'

import './css/login.scss';
import './css/theme.scss';

import Store from '@/store/index';
import { i18next , documentTitle } from '@/i18n';
import { setBaseUrl } from '@/utils/common';
import { fetchSystemConfig, fetchLoginInfo } from './service';
import { Login } from './js/login';
import TemplateHeader from './tpl/sys_logo.art';
import TemplateFooter from './tpl/enterprise_introduce.art';


function isIE() {
    return !!(window.ActiveXObject || "ActiveXObject" in window)
}

async function fetchInit(){
    let [ resConfig, resInfo ] = await Promise.all([
        fetchSystemConfig(),
        fetchLoginInfo()
    ])
    if(resConfig.success && resConfig.data){
        let system_config = localStorage.getItem('system_config')
        
        Store.dispatch({
            type:'save',
            payload:{
                ...resConfig.data
            }
        })
        localStorage.setItem('system_config', resConfig.data)

        const { sysBrand, BASE_URL, lang, versionYear } = Store.getState()
        $('body').addClass(`theme-${sysBrand}`);
        $('#verifyImage').attr('src', `${BASE_URL}/verifyImage`)

        i18next.changeLanguage(lang)
        $('#login_form').localize();
        $(TemplateHeader({ sysBrand })).localize().appendTo('#login_header .sys_logo');
        $(TemplateFooter({ sysBrand, versionYear })).localize().appendTo('#footer');
        document.title = documentTitle(sysBrand)('login')

    }else{
        //todo
    }
    
    if(resInfo.success && resInfo.data){
        const { outAlter, showVerifyCode, nonceValue } = resInfo.data

        if (showVerifyCode && showVerifyCode == '1') {
            $(".verifyCode_input_holder").removeClass("hidden");
            $('#verifyImage').attr('src',`${Store.getState('BASE_URL')}/verifyImage?random=${new Date().getTime()}`)
        }
        
        if (outAlter == '100012') {
            $("#login_form .error_msg").text("当前账号在别处登录，请重新登录！").show();
        }
        
        DigestAuth.setValue('nonce', nonceValue);

        Login.init();
        
    }else{
        //todo
    }

}

setBaseUrl()

$(function () {
    $('input[type="checkbox"]').ezMark();

    if (isIE()) {
        $("#password").removeAttr("readonly");
    }

    try{
        fetchInit()
    }catch(e){
        //todo
    }
    
});



