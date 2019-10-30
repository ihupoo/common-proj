import Store from '@/store';
import { Trans } from '@/utils/utils';
import TemplateIndex from './index.art';
import TemplateResourceLoad from './resource_load';
import TemplatePlatformResource from './platform_resource';

//一般用户界面的主体模板数据
const USER_MODULE = ({ createMeetingUrl }) => ({
    call_meeting_info: {
        contentId:"call_meeting_info",
        head_titles:["正在召开的会议"],
        head_more:[{more:"创建会议",url: createMeetingUrl },{more:"更多",url:"/meeting/mcc"}],
    },
    book_meeting_info: {
        contentId:"book_meeting_info",
        head_titles:["预约的会议"],
        head_more:[{more:"更多",url:"/meeting/meeting/meetingList"}],
    },
    past_meeting_info: {
        contentId:"past_meeting_info",
        head_titles:["历史会议"],
        head_more:[{more:"更多",url:"/meeting/meeting/historyMeeting"}],
    },
    live_room: {
        contentId:"live_room",
        head_titles: ["直播室"],
        head_more:[]
    },
    living: {
        contentId:"living",
        head_titles:["即将直播"],
        head_more:[]
    }
})
//管理员模板
const ADMIN_MODULE = ({ 
    _moid,
    menu: {
        createMeetingUrl,
        liveUrl,
        livingUrl
    },
    domainType,
    isUserDomainAdmin,
    vrsIP
}) => ({
    resource_load: {
        contentId:"resource_load",
        head_titles:["资源负载"],
        head_more:[
            { more:"更多", url:`/nms/home/?path=platformdevice&domainMoid=${_moid}` }
        ],
        height: 161,
    },
    subscribe_alarm: {
        contentId:"subscribe_alarm",
        head_titles: ["订阅告警"],
        head_more:[
            { more:"更多", url:`/nms/home/?path=unrepairedwarning&domainMoid=${_moid}` }
        ],
        height: 386,
    },
    platform_resource: {
        contentId:"platform_resource",
        head_titles:["平台CPU资源","平台内存资源"],
        head_more:[
            { more:"显示自定义服务器" },
            { more:"更多", url:"/nms/home/" }
        ],
    },
    meeting_count: {
        contentId:"meeting_count",
        head_titles:["并发会议统计","并发会议在线终端统计","终端在线统计"],
        head_more:[
            { more:"更多", url:`/nms/home/?path=history_meeting&type=multi&domainMoid=${_moid}`}
        ],
    },
    book_meeting_count: {
        contentId:"book_meeting_count",
        head_titles:["预约会议并发统计"],
        head_more:[]
    },
    meeting_info: {
        contentId:"meeting_info",
        head_titles:["正在召开的会议","预约的会议","历史会议"],
        head_more: [
            { more: '创建会议', url: createMeetingUrl },
            { more: '更多', url: ( domainType !== 'coreDomain' 
            ? '/meeting/mcc'
            : (isUserDomainAdmin ? '/nms/home/?path=realtime_meeting' : '/nms/home/?path=appointment_meeting')) }
        ],
    },
    meeting_category_info: {
        contentId:"meeting_category_info",
        head_titles:["传统会议","端口会议","点对点会议"],
        head_more:[
            {more:"更多",url:`/nms/home/?path=realtime_meeting&type=tran&domainMoid=${_moid}`}
        ],
    },
    live_room: {
        contentId:"live_room",
        head_titles: ["直播室"],
        head_more: [
            {more:"全部",url:"allLiveRooms?type=live"},
            {more:"更多",url:`//${vrsIP}${liveUrl}`}
        ],
    },
    living: {
        contentId:"living",
        head_titles:["即将直播"],
        head_more: [
            {more:"全部",url:"allLiveRooms?type=appointment"},
            {more:"更多",url:`//${vrsIP}${livingUrl}`}
        ]
    }
})


function parseAdminModule(list, adminModule){
    return list.map(x => {
        if(Array.isArray(x)){
            return parseAdminModule(x, adminModule)
        }else{
            adminModule[x].head_more = adminModule[x].head_more.filter(m => moreRemove[x] ? !moreRemove[x].include(m.more): true)
            adminModule[x].head_titles = adminModule[x].head_titles.filter(t => titleRemove[x] ? !titleRemove[x].include(t): true)
            return adminModule[x]
        }
    })
}

function parse({ 
    isServiceDomainAdmin, 
    isUserDomainAdmin, 
    isUsualUser,
    serviceDomainMoid, 
    userDomainMoid, 
    moid, 
    vrsIP,
    vrsShow,
    enableLive,
    enableVRS,
    jmsType,
    enableNM,
    enableMeeting
}, menu ){
    const { systemMode , domainType } = Store.getState()
    if('mooooooo-oooo-oooo-oooo-bmcdebugger' === moid || 'mooooooo-oooo-oooo-oooo-bmcdeveloper' === moid){
        return {
            moduleList: [],
            list: []
        };
    }
    if(isUsualUser){
        //普通用户
        const userModule = USER_MODULE(menu);

        let list = ['call_meeting_info','book_meeting_info','past_meeting_info','live_room','living']

        if(!(systemMode === '0' ? (vrsShow && enableLive) : (vrsShow && enableVRS))){
            list = list.filter(x => x !== 'live_room' && x !== 'living')
        }
        if(!enableMeeting){
            list = list.filter(x => x !== 'book_meeting_info')
        }
        return {
            list,
            moduleList: list.map(x => userModule[x])
        }
    }else{
        //管理员
        let _moid = isServiceDomainAdmin ? serviceDomainMoid : ( isUserDomainAdmin ? userDomainMoid : moid);
        let adminModule = ADMIN_MODULE({
            _moid,
            menu,
            domainType,
            isUserDomainAdmin,
            vrsIP
        })

        let list = [
            ['resource_load','subscribe_alarm'],
            'platform_resource',
            'meeting_count',
            'book_meeting_count',
            'meeting_info',
            'meeting_category_info',
            'live_room',
            'living',
        ]

        let moreRemove = {}, titleRemove = {};

        //服务域管理员
        if(isServiceDomainAdmin && jmsType !== '1'){//服务域管理员
            moreRemove['live_room'] = ['更多']  //服务域管理员不显示直播室更多
            moreRemove['living'] = ['更多']

            titleRemove['meeting_info'] = ["正在召开的会议", '历史会议']
        }
        //用户域管理员
        if (isUserDomainAdmin) {
            moreRemove['live_room'] = ['全部']  //用户域管理员不显示直播室全部
            moreRemove['living'] = ['全部']

            if (jmsType !=='1') {
                list[0][1] = 'book_meeting_count'
                list = list.filter(x => x !== 'platform_resource' && x !== 'book_meeting_count')
            }
            if(domainType === 'coreDomain'){
                moreRemove['live_room'] = ['全部', '更多']
                moreRemove['living'] = ['全部', '更多']
            }else{
                if(!(systemMode === '0' ? (vrsShow && enableLive) : (vrsShow && enableVRS))){
                    list = list.filter(x => x !== 'live_room' && x !== 'living')
                }
            }
            if(!enableMeeting){
                titleRemove['meeting_info'] = ["预约的会议"]
            }
        }
        //没有网管权限不显示更多
        if (!enableNM) {
            moreRemove['resource_load'] = ['更多']
            moreRemove['subscribe_alarm'] = ['更多']
             
            //没有网管权限不显示媒体资源
            // panelData.resource_load.resourceData.pop();

            moreRemove['platform_resource'] = ['更多']
            moreRemove['meeting_count'] = ['更多']

            if (domainType === 'coreDomain' ) {
                moreRemove['meeting_info'] = ['更多']
            }

            moreRemove['meeting_category_info'] = ['更多']
        } 
        
        //核心域不显示创建会议
        if(domainType === 'coreDomain'){
            moreRemove['meeting_info'] = ['创建会议']
        }
        
        return {
            list: list.flat(),
            moduleList: parseAdminModule(list, adminModule)
        }
        
    }

}

function fetchSsoToken(){
    return new Promise(function(resolve, reject){
        const { BASE_URL } = Store.getState()

        $.get(BASE_URL + "/getSsoToken",null,function(t){
            if(t.success){
                resolve(t.data)
            }else{
                resolve('')
            }
        },'json').error(function(){
            resolve('')
        });
    })
    
}

function eventBind(){
    $(".live_room .more,.living .more").on("click",function(e){
        e.preventDefault();
        var me = $(this);
        if(me.attr("href").indexOf("?") == -1){
            fetchSsoToken().then(token => {
                location.href = me.attr("href") + "?" + Trans.base64encode(Trans.utf16to8("sso_token="+token));
            })
        }
    })
    
}

const renderWrapper = {
    live_room: () => {},
    living: () => {},

    resource_load: (user) => TemplateResourceLoad.render('#resource_load',{ user }),
    subscribe_alarm: () => {},
    platform_resource: (user) => TemplatePlatformResource.render('#platform_resource',{ user }),
    meeting_count: () => {},
    book_meeting_count: () => {},
    meeting_info: () => {},
    meeting_category_info: () => {},

    call_meeting_info: () => {},
    book_meeting_info: () => {},
    past_meeting_info: () => {},
}


export default {
    render(dom, { user, menu }){
        const { moduleList , list } = parse( user, menu ) 
        $(dom).empty().append($(TemplateIndex({ moduleList })).localize())
        if(list.length > 0){
            //todo 渲染每个wrap 内容
            list.forEach(x => renderWrapper[x](user))
        }
    }
}
