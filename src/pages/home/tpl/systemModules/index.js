import Store from '@/store/index';
import TemplateIndex from './index.art';

//顶部子系统模块的模板数据
const modules = ({user, menu, systemMode}) => {
    return [
        {
            class_name:'bmc',
            name: '业务管理系统',
            value: user.enableBMC,
            url: menu.bmcUrl
        }, {
            class_name:'amc',
            name: '账号管理系统',
            value: user.userDomainAdmin,
            url: menu.amcUrl
        },{
            class_name:'nms',
            name: '网管系统',
            value: user.enableNM,
            url: menu.nmUrl
        },{
            class_name:'jms',
            name: '配置管理',
            value: user.jmsType === '1' ? user.userDomainAdmin : (user.moid == 'mooooooo-oooo-oooo-oooo-defaultadmin'),
            url: user.jmsType === '1' ? menu.sjmsUrl : menu.jmsUrl
        }, {
            class_name:'cmc',
            name: '会议管理系统',
            value: user.moid != 'mooooooo-oooo-oooo-oooo-bmcdebugger' && user.moid != 'mooooooo-oooo-oooo-oooo-bmcdeveloper',
            url: menu.meetingUrl
        }, {
            class_name:'vrs',
            name: systemMode === '0' ? '会议直播系统' : '会议录播系统',
            value: systemMode === '0' ? (user.vrsShow && user.enableLive) : (user.vrsShow && user.enableVRS),
            url: `//${user.vrsIP}/index.html`
        },{
            class_name:'umc',
            name: '网呈管理系统',
            value: user.enableNexvision,
            url: `${menu.umcUrl}?ip=${user.tpsIP}`
        }, {
            class_name:'kis',
            name: '智能会议平台',
            value: user.enableKIS,
            url: user.kisIp ? `//${user.kisIP}/index.html` : menu.kisUrl
        }, {
            class_name:'doms',
            name: '大数据运维系统',
            value: user.domsShow,
            url: menu.domsUrl
        },
        {
            class_name:'cbs',
            name: '大数据管理系统',
            value: user.cbsShow,
            url: menu.cbsUrl
        }]
}

const DOMAIN = {
    coreDomain: ['bmc','amc','nms','jms','doms','cbs'],
    platformDomain: ['amc','nms','cmc','vrs','umc','kis'],
    jmsDomain: ['nms','jms','cmc','vrs','umc','kis','doms','cbs']
}

function parse({ user, menu }){
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


export default ({ user, menu }) => TemplateIndex({
    modules : parse({ user, menu })
})
