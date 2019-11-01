import Store from '@/store/index';
import TemplateIndex from './index.art';
import { Trans } from '@/utils/utils';
import { fetchSsoToken } from '../utils';

//顶部子系统模块的模板数据
const modules = ({user:{
    enableBMC,
    userDomainAdmin,
    enableNM,
    jmsType,
    moid,
    vrsShow,
    enableLive,
    enableVRS,
    vrsIP,
    enableNexvision,
    tpsIP,
    enableKIS,
    kisIP,
    domsShow,
    cbsShow
}, menu, systemMode}) => {
    return [
        {
            class_name:'bmc',
            name: '业务管理系统',
            value: enableBMC,
            url: menu.bmcUrl
        }, {
            class_name:'amc',
            name: '账号管理系统',
            value: userDomainAdmin,
            url: menu.amcUrl
        },{
            class_name:'nms',
            name: '网管系统',
            value: enableNM,
            url: menu.nmUrl
        },{
            class_name:'jms',
            name: '配置管理',
            value: jmsType === '1' ? userDomainAdmin : (moid == 'mooooooo-oooo-oooo-oooo-defaultadmin'),
            url: jmsType === '1' ? menu.sjmsUrl : menu.jmsUrl
        }, {
            class_name:'cmc',
            name: '会议管理系统',
            value: moid != 'mooooooo-oooo-oooo-oooo-bmcdebugger' && moid != 'mooooooo-oooo-oooo-oooo-bmcdeveloper',
            url: menu.meetingUrl
        }, {
            class_name:'vrs',
            name: systemMode === '0' ? '会议直播系统' : '会议录播系统',
            value: systemMode === '0' ? (vrsShow && enableLive) : (vrsShow && enableVRS),
            url: `//${vrsIP}/index.html`
        },{
            class_name:'umc',
            name: '网呈管理系统',
            value: enableNexvision,
            url: `${menu.umcUrl}?ip=${tpsIP}`
        }, {
            class_name:'kis',
            name: '智能会议平台',
            value: enableKIS,
            url: kisIP ? `//${kisIP}/index.html` : menu.kisUrl
        }, {
            class_name:'doms',
            name: '大数据运维系统',
            value: domsShow,
            url: menu.domsUrl
        },
        {
            class_name:'cbs',
            name: '大数据管理系统',
            value: cbsShow,
            url: menu.cbsUrl
        }]
}

const DOMAIN = {
    coreDomain: ['bmc','amc','nms','jms','doms','cbs'],
    platformDomain: ['amc','nms','cmc','vrs','umc','kis'],
    jmsDomain: ['nms','jms','cmc','vrs','umc','kis','doms','cbs']
}

function parse(user, menu){
    const { systemMode , domainType } = Store.getState()
    let domain = user.jmsType === '1' ? 'jmsDomain' : (domainType === '1' ? 'platformDomain' : 'coreDomain')
    let moduleList = modules({user, menu, systemMode}).map(item => {
        if(systemMode ==='1'|| user.jmsType === '1'){//自建下  有权限显示无权限隐藏
            if(item.value){
                item.show='show'
            }else{
                item.url='';
                item.show='hidden'
            }
        }
        if(systemMode ==='1' && user.jmsType !== '1'){
            if(item.value){
                item.show='show'
            }else{
                item.url='';
                if(
                    item.class_name ==='cmc' ||
                    item.class_name==='amc' ||
                    item.class_name === 'vrs' ||
                    item.class_name==='nms' ||
                    item.class_name==='kis' ||
                    item.class_name==='doms' ||
                    item.class_name==='cbs'
                ){//租赁情况下  这几个权限有权限显示 无权置灰，其他权限 有权限显示无权限隐藏
                    item.show='disable'//置灰
                }else{
                    item.show='hidden'
                }
            }
        }
        return item
    })

    return moduleList.filter(item => DOMAIN[domain].includes(item.class_name))
}

function eventBind(){
    $(".module",".module-entry-wrapper").on("click",function(e){ //点击部分连接时，需要先获取token
        var me = $(this);
        if(!me.hasClass("disable") && (me.hasClass("umc") || me.hasClass("kis") || me.hasClass("vrs") || me.hasClass("live"))){
            e.preventDefault();

            fetchSsoToken().then(token => {
                if(me.hasClass("umc")){
                    location.href = me.attr("href") + "?SSO_COOKIE_KEY=" + token;
                }else{
                    location.href = me.attr("href") + "?" + Trans.base64encode(Trans.utf16to8("sso_token="+token));
                }
            })
        }
    })
}

export default {
    render(dom, { user, menu }){
        $(dom).empty().append($(TemplateIndex({ modules : parse(user, menu) })).localize())
        eventBind()
    }
}

