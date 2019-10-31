import Store from '@/store';
import { fetchLoop } from '../utils';
import TemplateIndex from './index.art';
import TemplateEightConference from './eightConference';
import TemplateMediaResource from './mediaResource';
import { percentCount } from '@/pages/home/js/draw';

const RESOURCE_DATA = [
    {name: "虚拟会议室资源", percent: 0, showInfo: false},
    {name: "会议并发接入终端数AP", percent: 0},
    {name: "媒体终端授权数MP", percent: 0},
    {name: "媒体资源", percent: 0, showInfo: false}
]

const RESOURCE_MODULE = {
    largeSmallVmr : [
        {
            name:'大型会议室',
            used:0,
            total:0,
            id:'large'
        },{
            name:'小型会议室',
            used:0,
            total:0,
            id:'small'
        }
    ],
    eightVmr: [{
            name:'8方720P',
            used:0,
            total:0,
            id:'8_720'
        },{
            name:'8方1080P',
            used:0,
            total:0,
            id:'8_1080'
        },{
            name:'32方720P',
            used:0,
            total:0,
            id:'32_720'
        },{
            name:'32方1080P',
            used:0,
            total:0,
            id:'32_1080'
        },{
            name:'64方720P',
            used:0,
            total:0,
            id:'64_720'
        },{
            name:'64方1080P',
            used:0,
            total:0,
            id:'64_1080'
        },{
            name:'192方720P',
            used:0,
            total:0,
            id:'192_720'
        },{
            name:'192方1080P',
            used:0,
            total:0,
            id:'192_1080'
        }
    ],
    mediaData:[{
        name:'传统会议',
        used:0,
        other:0,
        available:0,
        total:0,
        id:'tra_meeting',
        percent: 0,
        show: true
    },{
        name:'端口资源',
        used:0,
        other:0,
        available:0,
        total:0,
        id:'port_meeting',
        percent: 0,
        show: false
    }]
}

let eightData = [],
    mediaData = RESOURCE_MODULE.mediaData,
    fetchState = new fetchLoop();


function eventBind(user, resourceData, dom){
    $(".mo-icons-bg.resource_info").on("click",function () {//点击资源负载详情按钮，出现八方会议信息
        if($(this).hasClass("click")){
            return ;
        }
        $(".resource_info").removeClass("click").parent().find('.item-resource-info-content-wrapper').remove();
        
        $(this).addClass("click");

        //与后端交互，查询当前资源负载的八方会议使用详情
        if($(this).prev().text() === '虚拟会议室资源'){
            TemplateEightConference.render($(this).parent().find('.item-resource-info-wrapper'), { data: eightData })
        }
        if($(this).prev().text() === '媒体资源'){
            TemplateMediaResource.render($(this).parent().find('.item-resource-info-wrapper'), { data: mediaData })
        }
        fetchState.stop();
    })

    $(".mo-icons-bg.closed").on("click",function(){//八方会议右上方关闭按钮事件
        $(this).parent().parent().parent().find('.mo-icons-bg.resource_info.click').removeClass("click")
        $(this).parent().parent().find('.item-resource-info-content-wrapper').remove();
        fetchState.start();
    })
}

function fetchLoad(user, resourceData, dom) {
    const { BASE_URL } = Store.getState()
    const { 
        isServiceDomainAdmin,
        isUserDomainAdmin,
        serviceDomainMoid,
        userDomainMoid,
        moid,
    } = user
    //ajax获取资源负载数据，并将其组装成resource_load_data形式
    const url = BASE_URL + "/nms/getResource";
    let data = $.extend(true, [], resourceData);

    return $.get(url, {
            'type': isServiceDomainAdmin ? 'service' : 'user',
            'moid': isServiceDomainAdmin ? serviceDomainMoid : ( isUserDomainAdmin ? userDomainMoid : moid)
        }, function(t){
            if(t.success){
                const { data: { resource: resResource } } = t;
                //处理虚拟会议室资源
                let vmr = resResource.vmr;
                /**根据env_type的数值显示数据**/
                let env_type = (vmr.env_type=='1' || vmr.env_type=='2') ? 'largeSmallVmr' : 'eightVmr';
               
                let percent = RESOURCE_MODULE[env_type].reduce((all, cur) => {
                    return {
                        total: all.total + vmr[`total_${cur.id}`],
                        used : all.totalUsed + vmr[`used_${cur.id}`],
                    }
                })

                eightData = RESOURCE_MODULE[env_type];

                data[0].percent = percentCount(percent.used, percent.total);
                data[0].showInfo = true;

                //处理会议并发介入终端数
                let access = resResource.access;
        
                data[1].percent = percentCount(access.ap_used + access.g_ap_used, access.ap_total + access.g_ap_total);
                data[1].name = `${data[1].name}[${access.ap_used + access.g_ap_used}/${access.ap_total + access.g_ap_total}]`;
                
                //处理媒体终端授权数
                let media = resResource.media;
            
                data[2].percent = percentCount(media.used_h264 + media.used_h265, media.total_h264 + media.total_h265);
                data[2].name = `${data[2].name}[${media.used_h264 + media.used_h265}/${media.total_h264 + media.total_h265}]`;

                //处理媒体资源
                if(data.length === 4){
                    let traMeeting = resResource.tra_meeting;
                    let portMeeting = resResource.port_meeting;
                    let traMeetingUsed = 0;
                    let traMeetingOther = 0;
                    let traMeetingOtherUserDomain = 0;
                    let traMeetingAvailable = 0;
                    let traMeetingTotal = 0;
                    let traMeetingPercent = 0;
                    let portMeetingUsed = 0;
                    let portMeetingOther = 0;
                    let portMeetingOtherUserDomain = 0;
                    let portMeetingAvailable = 0;
                    let portMeetingTotal = 0;
                    let portMeetingPercent = 0;
                    let totalPercent = 0;
                    if(traMeeting){
                        if(traMeeting.used && traMeeting.used > 0){
                            traMeetingUsed = traMeeting.used;
                        }
                        if(traMeeting.other && traMeeting.other > 0){
                            traMeetingOther = traMeeting.other;
                        }
                        if(traMeeting.remainder && traMeeting.remainder > 0){
                            traMeetingAvailable = traMeeting.remainder;
                        }
                        if (traMeeting.port_used && traMeeting.port_used > 0) {
                            traMeetingOtherUserDomain = traMeeting.port_used;
                        }
                        traMeetingTotal = traMeetingUsed + traMeetingOther + traMeetingAvailable; //传统会议总数
                        if(traMeetingTotal > 0){
                            traMeetingPercent = percentCount(traMeetingUsed, traMeetingTotal);
                        }
                    }
                    if(portMeeting && portMeeting.total){
                        mediaData[1].show = true;
                        if(portMeeting.used && portMeeting.used > 0){
                            portMeetingUsed = portMeeting.used;
                        }
                        if(portMeeting.other && portMeeting.other > 0){
                            portMeetingOther = portMeeting.other;
                        }
                        if(portMeeting.remainder && portMeeting.remainder > 0){
                            portMeetingAvailable = portMeeting.remainder;
                        }
                        if (portMeeting.tra_used && portMeeting.tra_used > 0) {
                            portMeetingOtherUserDomain = portMeeting.tra_used;
                        }
                        if(portMeeting.total > 0){
                            portMeetingTotal = portMeeting.total;
                            portMeetingPercent = percentCount(portMeetingUsed, portMeetingTotal);
                        }
                        //有端口会议 总百分比根据端口已使用数加本域的其他占用数计算 
                        totalPercent = percentCount(portMeetingUsed + (isServiceDomainAdmin ? portMeetingOther : portMeetingOtherUserDomain), portMeetingTotal);
                    } else { //端口会议数据如果缺失则不显示
                        mediaData[1].show = false;
                        //没有端口会议 总百分比根据传统已使用数加本域的其他占用数计算 
                        totalPercent = percentCount(traMeetingUsed + (isServiceDomainAdmin ? traMeetingOther : traMeetingOtherUserDomain), traMeetingTotal);
                    }
                   data[3].percent = totalPercent;
                   data[3].showInfo = true;
                    mediaData[0].used = traMeetingUsed;
                    mediaData[0].other  = traMeetingOther;
                    mediaData[0].available = traMeetingAvailable;
                    mediaData[0].total = traMeetingTotal;
                    mediaData[0].percent = traMeetingPercent;
                    mediaData[1].used = portMeetingUsed;
                    mediaData[1].other  = portMeetingOther;
                    mediaData[1].available = portMeetingAvailable;
                    mediaData[1].total = portMeetingTotal;
                    mediaData[1].percent = portMeetingPercent;
                }
            }

            $(dom).empty().append($(TemplateIndex({ resourceData: data })).localize())
            eventBind(user, resourceData, dom)
        },'json').error(function(){
            $(dom).empty().append($(TemplateIndex({ resourceData: data })).localize())
            eventBind(user, resourceData, dom)
           
        }).complete(function(){
            fetchState.loop()
        })
}

export default {
    render(dom, { user }){
        //没有网管权限不显示媒体资源
        const resourceData = RESOURCE_DATA.filter(x => user.enableNM || (x.name !== '媒体资源'))
        $(dom).empty().append($(TemplateIndex({ resourceData })).localize())

        fetchState.cache({ user, resourceData, dom }).start(({ user, resourceData, dom }) => fetchLoad(user, resourceData, dom))
       
    },
    startfetch(){
        fetchState.start()
    },
    stopfetch(){
        fetchState.stop()
    }
}
