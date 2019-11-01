import Store from '@/store';
import './runtime';
import TemplateIndex from './index.art';
import TemplateBookMeetingCount from './book_meeting_count';
import TemplateBookMeetingInfo from './book_meeting_info';
import TemplateCallMeetingInfo from './call_meeting_info';
import TemplateLiveRoom from './live_room';
import TemplateLiving from './living';
import TemplateMeetingCategoryInfo from './meeting_category_info';
import TemplateMeetingCount from './meeting_count';
import TemplateMeetingInfo from './meeting_info';
import TemplatePastMeetingInfo from './past_meeting_info';
import TemplatePlatformResource from './platform_resource';
import TemplateResourceLoad from './resource_load';
import TemplateSubscribeAlarm from './subscribe_alarm';


//一般用户界面的主体模板数据
const USER_MODULE = ({ createMeetingUrl }) => ({
    call_meeting_info: {
        contentId:"call_meeting_info",
        head_titles:["正在召开的会议"],
        head_more:[{more:"创建会议",url: createMeetingUrl },{more:"更多",url:"/meeting/mcc"}],
        height: 430
    },
    book_meeting_info: {
        contentId:"book_meeting_info",
        head_titles:["预约的会议"],
        head_more:[{more:"更多",url:"/meeting/meeting/meetingList"}],
        height: 430
    },
    past_meeting_info: {
        contentId:"past_meeting_info",
        head_titles:["历史会议"],
        head_more:[{more:"更多",url:"/meeting/meeting/historyMeeting"}],
        height: 430
    },
    live_room: {
        contentId:"live_room",
        head_titles: ["直播室"],
        head_more:[],
        height: 430
    },
    living: {
        contentId:"living",
        head_titles:["即将直播"],
        head_more:[],
        height: 430
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
    vrsIP,

    isServiceDomainAdmin,
    jmsType,
    enableMeeting,
    enableNM
}) => ({
    resource_load: {
        contentId:"resource_load",
        head_titles:["资源负载"],
        head_more: (() => {
            let moreList = [
                { more:"更多", url:`/nms/home/?path=platformdevice&domainMoid=${_moid}` }
            ]
            //没有网管权限不显示更多
            if (!enableNM) {
                moreList = moreList.filter(x => x !== '更多')
            }
            return moreList
        })(),
        height: 161,
    },
    subscribe_alarm: {
        contentId:"subscribe_alarm",
        head_titles: ["订阅告警"],
        head_more: (() => {
            let moreList = [
                { more:"更多", url:`/nms/home/?path=unrepairedwarning&domainMoid=${_moid}` }
            ]
            //没有网管权限不显示更多
            if (!enableNM) {
                moreList = moreList.filter(x => x !== '更多')
            }
            return moreList
        })(),
        height: 386,
    },
    platform_resource: {
        contentId:"platform_resource",
        head_titles:["平台CPU资源","平台内存资源"],
        head_more:(() => {
            let moreList =[
                { more:"显示自定义服务器" },
                { more:"更多", url:"/nms/home/" }
            ]
            //没有网管权限不显示更多
            if (!enableNM) {
                moreList = moreList.filter(x => x !== '更多')
            }
            return moreList
        })(),
        height: 565,
    },
    meeting_count: {
        contentId:"meeting_count",
        head_titles:["并发会议统计","并发会议在线终端统计","终端在线统计"],
        head_more:(() => {
            let moreList = [
                { more:"更多", url:`/nms/home/?path=history_meeting&type=multi&domainMoid=${_moid}`}
            ]
            //没有网管权限不显示更多
            if (!enableNM) {
                moreList = moreList.filter(x => x !== '更多')
            }
            return moreList
        })(),
        height: 565,
    },
    book_meeting_count: {
        contentId:"book_meeting_count",
        head_titles:["预约会议并发统计"],
        head_more:[],
        height: 430
    },
    meeting_info: {
        contentId:"meeting_info",
        head_titles: (() => {
            let titleList = ["正在召开的会议","预约的会议","历史会议"];
            //服务域管理员
            if(isServiceDomainAdmin && jmsType !== '1'){//服务域管理员
                titleList = titleList.filter(x => x === '预约的会议')
            }
            //用户域管理员
            if (isUserDomainAdmin && !enableMeeting) {
                titleList = titleList.filter(x => x !== '预约的会议')
            }

        
            return titleList
        })(),
        head_more: (() => {
            let moreList = [
                { more: '创建会议', url: createMeetingUrl },
                { more: '更多', url: {
                    call_meeting_info : {
                        url: domainType === 'coreDomain' 
                            ? '/nms/home/?path=realtime_meeting'
                            : '/meeting/mcc',
                        canShow: true
                    },
                    book_meeting_info : {
                        url: '/nms/home/?path=appointment_meeting',
                        canShow: enableNM
                    },
                    past_meeting_info : {
                        url: '/nms/home/?path=history_meeting',
                        canShow: enableNM
                    },
                } }
            ]
            //核心域不显示创建会议
            if(domainType === 'coreDomain'){
                moreList = moreList.filter(x => x.more !== '创建会议')
                //无网管权限没有更多
                if(!enableNM){
                    moreList = moreList.filter(x => x.more !== '更多')
                }
            }

            return moreList

        })(),
        height: 430
    },
    meeting_category_info: {
        contentId:"meeting_category_info",
        head_titles:["传统会议","端口会议","点对点会议"],
        head_more: (() => {
            let moreList = [
                { more:"更多",url:{
                    transMeeting: `/nms/home/?path=realtime_meeting&type=tran&domainMoid=${_moid}`,
                    portMeeting: `/nms/home/?path=realtime_meeting&type=port&domainMoid=${_moid}`,
                    p2pMeeting: `/nms/home/?path=realtime_meeting&type=p2p&domainMoid=${_moid}`,
                }}
            ]
            //没有网管权限不显示更多
            if (!enableNM) {
                moreList = moreList.filter(x => x !== '更多')
            }
            return moreList
        })(),
        height: 430
    },
    live_room: {
        contentId:"live_room",
        head_titles: ["直播室"],
        head_more: (() => {
            let moreList = [
                {more:"全部",url:"allLiveRooms?type=live"},
                {more:"更多",url:`//${vrsIP}${liveUrl}`}
            ]
            //服务域管理员
            if (isServiceDomainAdmin && jmsType !== '1') {
                //服务域管理员不显示直播室更多
                moreList = moreList.filter(x => x.more !== '更多')
            }
            //用户域管理员
            if (isUserDomainAdmin) {
                //用户域管理员不显示直播室全部
                moreList = moreList.filter(x => x.more !== '全部')
                
                if (domainType === 'coreDomain') {
                    moreList = moreList.filter(x => x.more !== '更多')
                }
            }

            return moreList
        })(),
        height: 430
    },
    living: {
        contentId:"living",
        head_titles:["即将直播"],
        head_more: (() => {
            let moreList = [
                { more: "全部", url: "allLiveRooms?type=appointment" },
                { more: "更多", url: `//${vrsIP}${livingUrl}` }
            ]
            //服务域管理员
            if (isServiceDomainAdmin && jmsType !== '1') {
                //服务域管理员不显示直播室更多
                moreList = moreList.filter(x => x.more !== '更多')
            }
            //用户域管理员
            if (isUserDomainAdmin) {
                //用户域管理员不显示直播室全部
                moreList = moreList.filter(x => x.more !== '全部')
                
                if (domainType === 'coreDomain') {
                    moreList = moreList.filter(x => x.more !== '更多')
                }
            }
            return moreList
        })(),
        height: 430
    }
})


function parseAdminModule(list, adminModule){
    return list.map(x => {
        if(Array.isArray(x)){
            return x.map(y => adminModule[y])
        }else{
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
            list: [],
            moduleObj: {}
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

        let moduleObj = {}, moduleList = [];
        moduleList = list.map(x => {
            moduleObj[x] = userModule[x]
            return userModule[x]
        })
        return {
            list,
            moduleList,
            moduleObj
        }
    }else{
        //管理员
        let _moid = isServiceDomainAdmin ? serviceDomainMoid : ( isUserDomainAdmin ? userDomainMoid : moid);
        let adminModule = ADMIN_MODULE({
            _moid,
            menu,
            domainType,
            isUserDomainAdmin,
            vrsIP,

            isServiceDomainAdmin,
            jmsType,
            enableMeeting,
            enableNM
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

        //用户域管理员
        if (isUserDomainAdmin) {
            if (jmsType !=='1') {
                list[0][1] = 'book_meeting_count'
                list = list.filter(x => x !== 'platform_resource' && x !== 'book_meeting_count')
            }
            if(domainType !== 'coreDomain'){
                if(!(systemMode === '0' ? (vrsShow && enableLive) : (vrsShow && enableVRS))){
                    list = list.filter(x => x !== 'live_room' && x !== 'living')
                }
            }
        }
        
        let moduleObj = {}, _list = list.flat(), moduleList = parseAdminModule(list, adminModule);
        _list.forEach(x => {
            moduleObj[x] = adminModule[x]
            return adminModule[x]
        })

        return {
            list: _list,
            moduleList,
            moduleObj
        }
        
    }

}


const renderWrapper = {
    live_room: (user, setting) => TemplateLiveRoom.render('#live_room',{ user }),
    living: (user, setting) => TemplateLiving.render('#living',{ user }),

    resource_load: (user, setting) => TemplateResourceLoad.render('#resource_load',{ user }),
    subscribe_alarm: (user, setting) => TemplateSubscribeAlarm.render('#subscribe_alarm',{ user }),
    platform_resource: (user, setting) => TemplatePlatformResource.render('#platform_resource',{ user }),
    meeting_count: (user, setting) => TemplateMeetingCount.render('#meeting_count',{ user }),
    book_meeting_count: (user, setting) => TemplateBookMeetingCount.render('#book_meeting_count',{ user }),
    meeting_info: (user, setting) => TemplateMeetingInfo.render('#meeting_info',{ user }, setting),
    meeting_category_info: (user, setting) => TemplateMeetingCategoryInfo.render('#meeting_category_info',{ user }, setting),

    call_meeting_info: (user, setting) => TemplateCallMeetingInfo.render('#call_meeting_info',{ user }),
    book_meeting_info: (user, setting) => TemplateBookMeetingInfo.render('#book_meeting_info',{ user }),
    past_meeting_info: (user, setting) => TemplatePastMeetingInfo.render('#past_meeting_info',{ user }),
}

const fetchAbort = {
    live_room: () => TemplateLiveRoom.stopfetch(),
    living: () => TemplateLiving.stopfetch(),

    resource_load: () => TemplateResourceLoad.stopfetch(),
    subscribe_alarm: () => TemplateSubscribeAlarm.stopfetch(),
    platform_resource: () => TemplatePlatformResource.stopfetch(),
    meeting_count: () => TemplateMeetingCount.stopfetch(),
    book_meeting_count: () => TemplateBookMeetingCount.stopfetch(),
    meeting_info: () => TemplateMeetingInfo.stopfetch(),
    meeting_category_info: () => TemplateMeetingCategoryInfo.stopfetch(),

    call_meeting_info: () => TemplateCallMeetingInfo.stopfetch(),
    book_meeting_info: () => TemplateBookMeetingInfo.stopfetch(),
    past_meeting_info: () => TemplatePastMeetingInfo.stopfetch(),
}


export default {
    list: null ,
    render(dom, { user, menu }){
        const { moduleList , list, moduleObj } = parse( user, menu ) 
        $(dom).empty().append($(TemplateIndex({ moduleList })).localize())
        this.list = list;
        if(list.length > 0){
            //todo 渲染每个wrap 内容
            list.forEach(x => renderWrapper[x](user, moduleObj[x]))
        }
    },
    fetchAbort(){
        if(this.list && this.list.length > 0){
            this.list.forEach(x => fetchAbort[x]())
        }
    }
}
