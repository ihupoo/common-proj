import Store from '@/store';
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
const USER_MODULE = {
    call_meeting_info: {
        contentId:"call_meeting_info",
        height: 430
    },
    book_meeting_info: {
        contentId:"book_meeting_info",
        height: 430
    },
    past_meeting_info: {
        contentId:"past_meeting_info",
        height: 430
    },
    live_room: {
        contentId:"live_room",
        height: 430
    },
    living: {
        contentId:"living",
        height: 430
    }
}
//管理员模板
const ADMIN_MODULE = {
    resource_load: {
        contentId:"resource_load",
        height: 161,
    },
    subscribe_alarm: {
        contentId:"subscribe_alarm",
        height: 386,
    },
    platform_resource: {
        contentId:"platform_resource",
        height: 568,
    },
    meeting_count: {
        contentId:"meeting_count",
        height: 568,
    },
    book_meeting_count: {
        contentId:"book_meeting_count",
        height: 430
    },
    meeting_info: {
        contentId:"meeting_info",
        height: 430
    },
    meeting_category_info: {
        contentId:"meeting_category_info",
        height: 430
    },
    live_room: {
        contentId:"live_room",
        height: 430
    },
    living: {
        contentId:"living",
        height: 430
    }
}


function parseAdminModule(x, adminModule, heightSet){
    if(Array.isArray(x)){
        return x.map(y => parseAdminModule(y, adminModule, heightSet))
    }else{
        heightSet[x] && (adminModule[x].height = heightSet[x])
        return adminModule[x]
    }
}

function parse({ 
    userDomainAdmin, 
    usualUser,
    moid,
    enableLive,
    enableVRS,
    jmsType,
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
    if(usualUser){
        //普通用户
        const userModule = USER_MODULE;

        let list = ['call_meeting_info','book_meeting_info','past_meeting_info','live_room','living']

        if(!(systemMode === 0 ? (menu.vrsShow && enableLive) : (menu.vrsShow && enableVRS))){
            list = list.filter(x => x !== 'live_room' && x !== 'living')
        }
        if(!enableMeeting){
            list = list.filter(x => x !== 'book_meeting_info')
        }

        let  moduleList = list.map(x => userModule[x])
        return {
            list,
            moduleList,
        }
    }else{
        //管理员
        let adminModule = ADMIN_MODULE

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

        let heightSet = {}

        //用户域管理员
        if (userDomainAdmin) {
            if (jmsType !== 1) {
                list[0][1] = 'book_meeting_count'
                heightSet['book_meeting_count'] = 386
                list = list.filter(x => x !== 'platform_resource' && x !== 'book_meeting_count')
            }
            if(domainType === 1){
                if(!(systemMode === 0 ? (menu.vrsShow && enableLive) : (menu.vrsShow && enableVRS))){
                    list = list.filter(x => x !== 'live_room' && x !== 'living')
                }
            }
        }
        
        let moduleList = parseAdminModule(list, adminModule, heightSet);

        return {
            list: list.flat(),
            moduleList,
        }
        
    }

}


const renderWrapper = {
    live_room: (user, menu ) => TemplateLiveRoom.render('#live_room',{ user, menu }),
    living: (user, menu ) => TemplateLiving.render('#living',{ user, menu }),

    resource_load: (user, menu ) => TemplateResourceLoad.render('#resource_load',{ user, menu }),
    subscribe_alarm: (user, menu ) => TemplateSubscribeAlarm.render('#subscribe_alarm',{ user, menu }),
    platform_resource: (user, menu ) => TemplatePlatformResource.render('#platform_resource',{ user, menu }),
    meeting_count: (user, menu ) => TemplateMeetingCount.render('#meeting_count',{ user, menu }),
    book_meeting_count: (user, menu ) => TemplateBookMeetingCount.render('#book_meeting_count',{ user, menu }),
    meeting_info: (user, menu ) => TemplateMeetingInfo.render('#meeting_info',{ user, menu }),
    meeting_category_info: (user, menu ) => TemplateMeetingCategoryInfo.render('#meeting_category_info',{ user, menu }),

    call_meeting_info: (user, menu ) => TemplateCallMeetingInfo.render('#call_meeting_info',{ user, menu }),
    book_meeting_info: (user, menu ) => TemplateBookMeetingInfo.render('#book_meeting_info',{ user, menu }),
    past_meeting_info: (user, menu ) => TemplatePastMeetingInfo.render('#past_meeting_info',{ user, menu }),
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
        const { moduleList , list } = parse( user, menu ) 
        $(dom).empty().append($(TemplateIndex({ moduleList })).localize())
        this.list = list;
        if(list.length > 0){
            //todo 渲染每个wrap 内容
            list.forEach(x => renderWrapper[x](user, menu))
        }
    },
    fetchAbort(){
        if(this.list && this.list.length > 0){
            this.list.forEach(x => fetchAbort[x]())
        }
    }
}
