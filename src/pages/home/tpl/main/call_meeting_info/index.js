import Store from '@/store';
import { Times } from '@/utils/utils';
import { fetchLoop } from '../utils';
import TemplateIndex from './index.art';
import '@/lib/artDialog/4.1.7/jquery.artDialog.min';
import '@/lib/artDialog/4.1.7/skins/simple.css';
import '@/styles/reset-artDialog.scss';



function datagridInit(dom, user){
    const { BASE_URL } = Store.getState()
    const url = user.domainType == "coreDomain" 
            ? BASE_URL + "/nms/getCallMeetingList"
            : BASE_URL + "/meeting/listMeetingByCondition";
    $(dom).datagrid({
        idField : "id",
        pagination:true,
        pageNumber: 1,//初始化页面数量
        pageSize: 5,//初始化显示条数
        pageList:[5],
        method:'get',
        loadMsg:"",
        url,
        onBeforeLoad:function(params){
            var startTime = Times.getCurrentTime();
            var endTime = null;
            onBeforeLoadFun(that,params,startTime,endTime,3,1);//that,params,startTime,endTime,type,order
        },
        loadFilter:function(loadData){
            return loadFilterFun(loadData)
        },
        columns:[[
            {field:'id',hidden:true},
            {field:'name',width:311,align:'left',formatter:function(val,row){
                    var rowTemp  = $.extend( false,row  )
                    rowTemp.subject = rowTemp.isVideoMeeting=="1"?"["+rowTemp.meetingResourceVO.multi+"方"+rowTemp.meetingResourceVO.resolution+"]"+rowTemp.subject:rowTemp.subject
                    var rooms = [];
                    for(var i = 0;i<rowTemp.rooms.length;i++){
                        rooms.push(rowTemp.rooms[i].name);
                    }
                    rowTemp.rooms = rooms.toLocaleString();
                    rowTemp.rooms = rowTemp.rooms.length==0?"无会议室信息":rowTemp.rooms;
                    var meetingDetailUrl = '';
                    if(!that.readyData.isCoreDomain){
                        meetingDetailUrl = 'href="/meeting/mcc/manager/'+rowTemp.id+'"';
                    }
                    var videoStr = '"></a><a '+meetingDetailUrl+' class="meeting-name ';
                    var leftStr = '<div class="grid-item-wrapper">' +
                        '<div class="grid_td-item " title="'+ rowTemp.subject +'"><a class="mo-icons-bg video_icon ';
                    var rightStr = '">'+ rowTemp.subject +'</a></div>' +
                        '<div class="grid_td-item meeting-rooms" title="'+ rowTemp.rooms +'">'+ rowTemp.rooms +'</div>' +
                        '</div>'
                    var htmlStr = leftStr+videoStr+rightStr
                    if(rowTemp.isVideoMeeting=="1"){
                        videoStr = videoStr +'video'
                        htmlStr = leftStr+videoStr+rightStr
                        return htmlStr;
                    }else{
                        videoStr = "hidden"+videoStr;
                        htmlStr = leftStr+videoStr+rightStr
                        return htmlStr;
                    }
                }},
            {field:'date',width:198,align:'right',formatter:function(val,row){
                    var rowTemp = $.extend( false,row  )
                    var startTimeDate = new Date(rowTemp.startTime.replace(new RegExp( '-' , "g" ),"/"))
                    var startTimeDateStr = startTimeDate.toDateString();
                    var meetingTime = '手动结束';
                    if(rowTemp.endTime!=""){
                        var endTimeDate = new Date(rowTemp.endTime.replace(new RegExp( '-' , "g" ),"/"))
                        var diffTime = endTimeDate.getTime()-startTimeDate.getTime();
                        var onehour = 60;
                        diffTime = Math.floor(diffTime/1000/60);
                        var hour = Math.floor(diffTime/onehour);
                        var minute = diffTime%onehour;
                        meetingTime= "时长"+hour+'小时';
                        meetingTime = minute==0?meetingTime:meetingTime+minute+'分钟';
                    }

                    if(startTimeDateStr==currentDateStr){//同一天不显示日期
                        var hour = startTimeDate.getHours()<10?'0'+startTimeDate.getHours():startTimeDate.getHours();
                        var miniute = startTimeDate.getMinutes()<10?'0'+startTimeDate.getMinutes():startTimeDate.getMinutes()
                        rowTemp.time = hour+":"+miniute+"开始 "+meetingTime;
                    }else{
                        rowTemp.time = rowTemp.startTime.replace(new RegExp( '/' , "g" ),"-").substring(0,rowTemp.startTime.length-3)+"开始 "+meetingTime;
                    }
                    rowTemp.telephone = rowTemp.telephone==''?'(':'('+rowTemp.telephone;
                    rowTemp.mobile = rowTemp.mobile==''?')':rowTemp.mobile+')';
                    if(rowTemp.mobile.length!=1&&rowTemp.telephone.length!=1){
                        rowTemp.creator = rowTemp.creator+rowTemp.telephone+'/'+rowTemp.mobile;
                    }else{
                        if(rowTemp.mobile.length==1&&rowTemp.telephone.length==1){
                            rowTemp.creator = rowTemp.creator
                        }else{
                            rowTemp.creator = rowTemp.creator+rowTemp.telephone+rowTemp.mobile
                        }
                    }
                    return '<div class="grid-item-wrapper call-meeting-item">' +
                        '<div class="grid_td-item meeting-status" title="'+ rowTemp.time +'">'+ rowTemp.time +'</div>' +
                        '<div class="grid_td-item meeting-user" title="'+ rowTemp.creator +'">'+ rowTemp.creator +'</div>' +
                        '</div>'
                }}
        ]],
        onLoadSuccess:function (data) {
            var className={
                addClass:'call-meeting',
                removeClass:'book-meeting past-meeting'
            }
            var $dom=$("#call_meeting_container");
            onLoadSuccessFun(that,data,className,$dom,0);
        }
    });
    paginationFun(that);
}


export default {
    render(dom, { user }){
        
        $(dom).empty().append($(TemplateIndex({})).localize())
        $(dom).siblings('.no-data-wrapper').removeClass("hidden").find('.warm-text').text('今日无会议安排，点击“创建会议”开始创会吧。');
        
        
        datagridInit()
        
        const moid = user.isServiceDomainAdmin ? user.serviceDomainMoid : ( user.isUserDomainAdmin ? user.userDomainMoid : user.moid);

        fetchState.cache({ moid, dom }).start(({ moid, dom }) => fetchLoad(moid, dom))
        
    },
    startfetch(){
        fetchState.reStart()
    },
    stopfetch(){
        fetchState.stop()
    }
}
