import Store from '@/store';
import { Times } from '@/utils/utils';
import { fetchLoop } from '../../utils';
import TemplateIndex from './index.art';
import TemplateHeader from './header.art';

import '@/lib/easyui'

let pages = {
    currentPage: 1,
    total: 0
}

const fetchState = new fetchLoop()

function datagridInit({ moid, user }){
    const { domainType } = Store.getState()

    $('#call_meeting_info_grid').datagrid({
        idField : "id",
        pagination:true,
        pageNumber: 1,//初始化页面数量
        pageSize: 5,//初始化显示条数
        pageList:[5],
        loadMsg:"",
        columns:[[
            {field:'id',hidden:true},
            {field:'name', width:311, align:'left',
            formatter:function(val,row){
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

                    if(domainType === 1){
                        meetingDetailUrl = 'href="/meeting/mcc/manager/'+ rowTemp.id +'"';
                    }
                    let leftStr = '<div class="grid-item-wrapper">' +
                        '<div class="grid_td-item " title="'+ rowTemp.subject +'"><a class="mo-icons-bg video_icon ';
                    let videoStr = '"></a><a '+meetingDetailUrl+' class="meeting-name ';
                    let rightStr = '">'+ rowTemp.subject +'</a></div>' +
                        '<div class="grid_td-item meeting-rooms" title="'+ rowTemp.rooms +'">'+ rowTemp.rooms +'</div>' +
                        '</div>'

                    if(rowTemp.isVideoMeeting == "1"){
                        videoStr = videoStr +'video'
                    }else{
                        videoStr = "hidden"+ videoStr;
                    }
                    return leftStr + videoStr + rightStr
                }},
            {field:'date', width:198, align:'right',
            formatter:function(val,row){
                    let rowTemp = $.extend( false,row )
                    let startTimeDate = new Date(rowTemp.startTime.replace(new RegExp( '-' , "g" ),"/"))
                    let startTimeDateStr = startTimeDate.toDateString();
                    let meetingTime = '手动结束';

                    if(rowTemp.endTime!=""){
                        let endTimeDate = new Date(rowTemp.endTime.replace(new RegExp( '-' , "g" ),"/"))
                        let diffTime = endTimeDate.getTime() - startTimeDate.getTime();
                        let onehour = 60;
                        diffTime = Math.floor(diffTime / 1000 / 60);
                        let hour = Math.floor(diffTime / onehour);
                        let minute = diffTime % onehour;
                        meetingTime= "时长" + hour + '小时';
                        meetingTime = minute == 0 ? meetingTime : meetingTime + minute + '分钟';
                    }

                    if(startTimeDateStr == new Date().toDateString()){//同一天不显示日期
                        let hour = startTimeDate.getHours() < 10 ? '0' + startTimeDate.getHours() : startTimeDate.getHours();
                        let miniute = startTimeDate.getMinutes() < 10 ? '0'+startTimeDate.getMinutes() : startTimeDate.getMinutes()
                        rowTemp.time = hour + ":" + miniute + "开始 " + meetingTime;
                    }else{
                        rowTemp.time = rowTemp.startTime.replace(new RegExp( '/' , "g" ),"-").substring(0, rowTemp.startTime.length-3)+ "开始 "+meetingTime;
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
                    return '<div class="grid-item-wrapper call-meeting-item">' +
                        '<div class="grid_td-item meeting-status" title="'+ rowTemp.time +'">'+ rowTemp.time +'</div>' +
                        '<div class="grid_td-item meeting-user" title="'+ rowTemp.creator +'">'+ rowTemp.creator +'</div>' +
                        '</div>'
                }}
        ]],
        onLoadSuccess:function () {
        }
    });
    $('#call_meeting_info_grid').datagrid('getPager').pagination({
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
        $(dom).find('.no-data-wrapper').removeClass("hidden");
        $("#call_meeting_container").addClass('none-visible')
    }else{
        $(dom).find('.no-data-wrapper').addClass("hidden");
        $("#call_meeting_container").removeClass("none-visible");
        $('#call_meeting_info_grid').datagrid('loadData', meetings);
       
    }
}

function fetchLoad({ moid, user } , dom){//获取告警信息
    const { BASE_URL, domainType } = Store.getState()

    const url = domainType === 0 
        ? BASE_URL + "/nms/getCallMeetingList"
        : BASE_URL + "/meeting/listMeetingByCondition";

    const _moid = domainType === 0 ? moid : user.moid
    const _searchType = user.userDomainAdmin ? '1' : '0'
    let params = {
        moid : _moid,
        searchType : _searchType,
        count : 5,
        start : (pages.currentPage - 1)* 5,
        startTime : Times.getCurrentTime(),
        endTime : null,
        type : 3,
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
    render(dom, { user, menu }){
        const moid = user.serviceDomainAdmin ? user.serviceDomainMoid : ( user.userDomainAdmin ? user.userDomainMoid : user.moid);

        if(user.usualUser){
            this.renderHeader(`${dom}-header`, menu)
        }

        this.renderContent(dom, user, moid)
        
    },
    renderHeader(dom, { createMeetingUrl } ) {
        const data = {
            head_titles:["正在召开的会议"],
            head_more:[{more:"创建会议",url: createMeetingUrl },{more:"更多",url:"/meeting/mcc"}],
        }

        $(dom).empty().append($(TemplateHeader(data)).localize())
    },  
    renderContent(dom, user ,moid) {
        $(dom).children('#call_meeting_container').remove().end().append($(TemplateIndex({})).localize())
        $(dom).find('.no-data-wrapper').removeClass("hidden");
        
        datagridInit({ moid, user })

        fetchState.cache({ moid, user, dom }).start(({ moid, user , dom }) => fetchLoad({ moid, user }, dom))
    },
    startfetch(){
        fetchState.start()
    },
    stopfetch(){
        fetchState.stop()
    },
}
