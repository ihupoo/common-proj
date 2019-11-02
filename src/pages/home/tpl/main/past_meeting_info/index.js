import Store from '@/store';
import { Times } from '@/utils/utils';
import { fetchLoop } from '../../utils';
import TemplateIndex from './index.art';

import '@/lib/easyui/1.8.5/themes/icon.css';
import '@/lib/easyui/1.8.5/themes/default/easyui.css';
import '@/lib/easyui/1.8.5/jquery.easyui.min.js';
import '@/lib/easyui/1.8.5/locale/easyui-lang-zh_CN.js';
import '@/styles/reset-easyui.scss';
let pages = {
    currentPage: 1,
    total: 0
}

const fetchState = new fetchLoop()

function datagridInit({ moid, user }){
    $('#past_meeting_info_grid').datagrid({
        idField : "id",
        pagination:true,
        pageNumber: 1,//初始化页面数量
        pageSize: 5,//初始化显示条数
        pageList:[5],
        loadMsg:"",
        columns: [[
            { field: 'id', hidden: true },
            {
                field: 'name', width: 311, align: 'left', 
                formatter: function (val, row) {
                    let rowTemp  = $.extend( false, row)
                    rowTemp.subject = rowTemp.isVideoMeeting == "1"
                        ? `[${rowTemp.meetingResourceVO.multi}方${rowTemp.meetingResourceVO.resolution}]${rowTemp.subject}`
                        : rowTemp.subject
                    let rooms = [];
                    for(let i = 0;i< rowTemp.rooms.length; i++){
                        rooms.push(rowTemp.rooms[i].name);
                    }
                    rowTemp.rooms = rooms.length == 0 ? "无会议室信息" : rooms.toLocaleString();
                    let meetingDetailUrl = '';

                    if (user.isUsualUser) {
                        meetingDetailUrl = 'href="/meeting/meeting/detail/' + row.id + '?history"';
                    }
                    var videoStr = '"></a><a ' + meetingDetailUrl + ' class="meeting-name ';
                    var leftStr = '<div class="grid-item-wrapper">' +
                        '<div class="grid_td-item " title="' + row.subject + '"><a class="mo-icons-bg video_icon ';
                    var rightStr = '">' + rowTemp.subject + '</a></div>' +
                        '<div class="grid_td-item meeting-rooms" title="' + rowTemp.rooms + '">' + rowTemp.rooms + '</div>' +
                        '</div>'

                    if (rowTemp.isVideoMeeting == "1") {
                        videoStr = videoStr + 'video'
                    } else {
                        videoStr = "hidden" + videoStr;
                    }
                    return leftStr + videoStr + rightStr
                }
            },
            {
                field: 'date', width: 198, align: 'right', 
                formatter: function (val, row) {
                    var rowTemp = $.extend(false, row);
                    var startTimeDate = new Date(rowTemp.startTime.replace(new RegExp('-', "g"), "/"))
                    var startTimeDateStr = startTimeDate.toDateString();
                    var meetingTime = '手动结束'

                    if (rowTemp.endTime != "") {
                        var endTimeDate = new Date(rowTemp.endTime.replace(new RegExp('-', "g"), "/"))
                        var diffTime = endTimeDate.getTime() - startTimeDate.getTime();
                        var onehour = 60;
                        diffTime = Math.floor(diffTime / 1000 / 60);
                        var hour = Math.floor(diffTime / onehour);
                        var minute = diffTime % onehour;
                        meetingTime = "时长" + hour + '小时';
                        meetingTime = minute == 0 ? meetingTime : meetingTime + minute + '分钟';
                    }
                    if (startTimeDateStr == new Date().toDateString()) {//同一天不显示日期
                        var hour = startTimeDate.getHours() < 10 ? '0' + startTimeDate.getHours() : startTimeDate.getHours();
                        var miniute = startTimeDate.getMinutes() < 10 ? '0' + startTimeDate.getMinutes() : startTimeDate.getMinutes()
                        rowTemp.time = hour + ":" + miniute + "开始 " + meetingTime;
                    } else {
                        rowTemp.time = rowTemp.startTime.replace(new RegExp('/', "g"), "-").substring(0, rowTemp.startTime.length - 3) + "开始 " + meetingTime;
                    }
                    rowTemp.telephone = '(' + rowTemp.telephone;
                    rowTemp.mobile = rowTemp.mobile + ')';
                    if (rowTemp.mobile.length != 1 && rowTemp.telephone.length != 1) {
                        rowTemp.creator = rowTemp.creator + rowTemp.telephone + '/' + rowTemp.mobile;
                    } else {
                        if (rowTemp.mobile.length == 1 && rowTemp.telephone.length == 1) {
                            rowTemp.creator = rowTemp.creator
                        } else {
                            rowTemp.creator = rowTemp.creator + rowTemp.telephone + rowTemp.mobile
                        }
                    }
                    return '<div class="grid-item-wrapper past-meeting-item">' +
                        '<div class="grid_td-item meeting-status" title="' + rowTemp.time + '">' + rowTemp.time + '</div>' +
                        '<div class="grid_td-item meeting-user" title="' + rowTemp.creator + '">' + rowTemp.creator + '</div>' +
                        '</div>'
                }
            }
        ]],
        onLoadSuccess:function () {
        }
    });
    $('#past_meeting_info_grid').datagrid('getPager').pagination({
        pageSize: 5,//每页显示的记录条数，默认为10
        pageList: [5],//可以设置每页记录条数的列表
        layout: ["manual","prev", "next"],
        displayMsg:"",
        beforePageText:"",
        afterPageText:"/ {pages}",
        onSelectPage: function(pageNumber, pageSize){
            fetchState.stop()
            pages.currentPage = pageNumber
            fetchState.start()
        }
    });
}


function renderGrid({total, meetings} , dom){
    if(total === 0 || !meetings || meetings.length === 0){
        $(dom).siblings('.no-data-wrapper').removeClass("hidden").find('.warm-text').text('暂无历史会议记录');
        $("#past_meeting_container").addClass('none-visible')
    }else{
        $(dom).siblings('.no-data-wrapper').addClass("hidden");
        $("#past_meeting_container").removeClass("none-visible");
        $('#past_meeting_info_grid').datagrid('loadData', meetings);
       
    }
}

function fetchLoad({ moid, user } , dom){//获取告警信息
    const { BASE_URL, domainType } = Store.getState()

    const url = domainType == "coreDomain" 
        ? BASE_URL + "/nms/getHistoryMeetingList"
        : BASE_URL + "/meeting/listMeetingByCondition";

    const _moid = domainType == "coreDomain" ? moid : user.moid
    const _searchType = user.isUserDomainAdmin ? '1' : '0'

    let endTime = new Date();
    let startTime = new Date(endTime.getTime());
    startTime.setDate(startTime.getDate() - 1);
    startTime = domainType == "coreDomain" ? Times.getCurrentTime(startTime).replace(/-/g, '/') : Times.getCurrentTime(startTime)
    endTime = domainType == "coreDomain" ? Times.getCurrentTime(endTime).replace(/-/g, '/') : Times.getCurrentTime(endTime)

    let params = {
        moid : _moid,
        searchType : _searchType,
        count : 5,
        start : (pages.currentPage - 1)* 5,
        startTime : startTime,
        endTime : endTime,
        type : 4,
        order : 1
    }

    return $.get(url, params, function(t){
        if(t.success){
            let data = t.data;
            pages.total = data.total
            renderGrid(data , dom);
        }else{
            renderGrid({ total:0, meetings: [] }, dom);
        }
    },'json').error(function(){
        renderGrid({ total:0, meetings: [] } , dom);
        
    }).complete(function() {
        fetchState.loop()
    });

}


export default {
    render(dom, { user }){
        
        $(dom).children('#past_meeting_container').remove().end().append($(TemplateIndex({})).localize())
        $(dom).siblings('.no-data-wrapper').removeClass("hidden").find('.warm-text').text('暂无历史会议记录');
        
        const moid = user.isServiceDomainAdmin ? user.serviceDomainMoid : ( user.isUserDomainAdmin ? user.userDomainMoid : user.moid);

        datagridInit({ moid, user })

        fetchState.cache({ moid, user, dom }).start(({ moid, user , dom }) => fetchLoad({ moid, user }, dom))
        
    },
    startfetch(){
        fetchState.start()
    },
    stopfetch(){
        fetchState.stop()
    },
    show(){
        $('#past_meeting_container').show()
    },
    hide(){
        $('#past_meeting_container').hide()
    },
}