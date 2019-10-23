/**
 * 该文件主要针对【正在召开的会议】【预约的会议】【历史会议】所属的panel进行优化
 * @constructor
 */
var MeetingCalendarPanel = function () {
    this.idStr = panelData.meeting_info.contentId;
    this.dataGridIdStr = 'meeting_info_grid';
    this.callMeetingPanel = new CallMeetingPanel("call_meeting_grid")
    this.bookMeetingPanel = new BookMeetingPanel("book_meeting_grid")
    this.pastMeetingPanel = new PastMeetingPanel("past_meeting_grid")

    this.noDataFun = function () {
        $("#"+this.idStr).append('<div id="'+this.dataGridIdStr+'">' +
            '<div id="call_meeting_container"><div id="call_meeting_grid"></div></div>' +
            '<div id="book_meeting_container"><div id="book_meeting_grid"></div></div>' +
            '<div id="past_meeting_container"><div id="past_meeting_grid"></div></div>'+
            '</div>');

        $(".no-data","#"+this.idStr).removeClass("hidden");//空数据渲染
        $(".no-data","#"+this.idStr).addClass("call-meeting");
        $(".warm-text","#"+this.idStr).text("今日无会议安排，点击“创建会议”开始创会吧。");
    }

    this.refreshFun = function () {
        if(panelData.meeting_info.datagridIds.indexOf("call_meeting_info")>=0){
            this.callMeetingPanel.initDataGrid();
        }
        if(panelData.meeting_info.datagridIds.indexOf("boook_meeting_info")>=0){
            this.bookMeetingPanel.initDataGrid();
        }
        if(panelData.meeting_info.datagridIds.indexOf("past_meeting_info")>=0) {
            this.pastMeetingPanel.initDataGrid();
        }

    }
    this.drawDataGrid = function () {
        var headerTitle = $(".title", ".meeting_info .header-title.active ").text()
        var index = panelData.meeting_info.head_titles.indexOf(headerTitle)
        $(".no-data","#"+this.idStr).addClass("hidden");
        if(index == 0){
            $("#call_meeting_container").show();
            $("#book_meeting_container").hide();
            $("#past_meeting_container").hide();

            this.callMeetingPanel.initDataGrid();
        }else if(index == 1 ){
            $("#call_meeting_container").hide();
            $("#book_meeting_container").show();
            $("#past_meeting_container").hide();
            this.bookMeetingPanel.initDataGrid();
        }else if(index == 2){
            $("#call_meeting_container").hide();
            $("#book_meeting_container").hide();
            $("#past_meeting_container").show();
            this.pastMeetingPanel.initDataGrid();
        }
    }
    this.initDataGrid = function () {
        if(panelData.meeting_info.datagridIds.indexOf("call_meeting_info")>=0){
            $("#call_meeting_container").show();
            this.callMeetingPanel.initDataGrid();
        }
        if(panelData.meeting_info.datagridIds.indexOf("book_meeting_info")>=0){
            $("#book_meeting_container").show();
            this.bookMeetingPanel.initDataGrid();
        }
        if(panelData.meeting_info.datagridIds.indexOf("past_meeting_info")>=0) {
            $("#past_meeting_container").show();
            this.pastMeetingPanel.initDataGrid();
        }
    }



}
MeetingCalendarPanel.prototype = new Panel();

// 正在召开的会议
var CallMeetingPanel = function (id) {
    Panel.call(this);
    this.emptyMsg='今日无会议安排，点击“创建会议”开始创会吧。';
    this.readyData = {
        url:domainType=="coreDomain"?Mo.Config.appUrl+"/nms/getCallMeetingList":Mo.Config.appUrl+"/meeting/listMeetingByCondition",
        moid:domainType=="coreDomain"?moid:userMoid,
        searchType:isUserDomainAdmin?"1":"0",
        idStr:(panelData.call_meeting_info||panelData.meeting_info).contentId,
        dataGridIdStr:id==undefined?"call_meeting_info_grid":id,
        data:null,
        dataGrid:false,
    };
    this.noDataFun = function () {
        var id="call_meeting_container";
        var className="call-meeting";
        noDataStyleFun(this,id,className,this.emptyMsg);
    };
    this.refreshFun = function () {
        this.initDataGrid();
    }
    this.initDataGrid = function () {
        var that = this;
        if(that.readyData.dataGrid){
            $("#"+that.readyData.dataGridIdStr).datagrid("reload");
            return;
        }
        that.readyData.dataGrid = $("#" + that.readyData.dataGridIdStr).datagrid({
            idField : "id",
            pagination:true,
            pageNumber: 1,//初始化页面数量
            pageSize: 5,//初始化显示条数
            pageList:[5],
            //data:that.readyData.data,
            method:'get',
            loadMsg:"",
            url:that.readyData.url,
            onBeforeLoad:function(params){
                var startTime=times.getCurrentTime();
                var endTime=null;
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
}
CallMeetingPanel.prototype = new Panel();
// 预约的会议
var BookMeetingPanel = function (id) {
    Panel.call(this);
    this.emptyMsg='暂无预约的会议';
    this.readyData = {
        url:domainType=='coreDomain'?Mo.Config.appUrl+"/nms/getAppointmentList":Mo.Config.appUrl+"/meeting/listMeetingByCondition",
        moid:domainType=='coreDomain'?moid:userMoid,
        searchType:isUserDomainAdmin?'1':'0',
        idStr:(panelData.book_meeting_info||panelData.meeting_info).contentId,
        dataGridIdStr:id==undefined?"book_meeting_info_grid":id,
        data:null,
        dataGrid:false,
    };
    this.initBookMeetingPanel = function () {
        this.noDataFun();
        this.initDataGrid();
    }
    this.noDataFun = function () {
        var id="book_meeting_container";
        var className="book-meeting";
        noDataStyleFun(this,id,className,this.emptyMsg);
    };
    this.refreshFun = function () {
        this.initDataGrid();
    }
    this.initDataGrid = function () {
        var that = this;
        var startTime = new Date();
        var endTime = new Date(startTime.getTime());
        endTime.setDate(endTime.getDate() + 1);
        if(that.readyData.dataGrid){
            $("#"+that.readyData.dataGridIdStr).datagrid("reload");
            return;
        }
        that.readyData.dataGrid =  $("#"+that.readyData.dataGridIdStr).datagrid({
            idField : "id",
            pagination:true,
            pageNumber: 1,//初始化页面数量
            pageSize: 5,//初始化显示条数
            pageList:[5],
            //data:that.readyData.data,
            method:'get',
            loadMsg:"",
            url:that.readyData.url,
            onBeforeLoad:function(params){
                var startTime1=times.getCurrentTime(startTime);
                var endTime1=times.getCurrentTime(endTime);
                onBeforeLoadFun(that,params,startTime1,endTime1,1,0);//that,params,startTime,endTime,type,order
            },
            loadFilter:function(loadData){
                return loadFilterFun(loadData)
            },
            columns:[[
                {field:'id',hidden:true},
                {field:'name',width:311,align:'left',formatter:function(val,row){
                        var rowTemp = $.extend( false,row  );
                        rowTemp.subject = rowTemp.isVideoMeeting=="1"?"["+rowTemp.meetingResourceVO.multi+"方"+rowTemp.meetingResourceVO.resolution+"]"+rowTemp.subject:rowTemp.subject
                        var rooms = [];
                        for(var i = 0;i<rowTemp.rooms.length;i++){
                            rooms.push(rowTemp.rooms[i].name);
                        }
                        rowTemp.rooms = rooms.toLocaleString();
                        rowTemp.rooms = rowTemp.rooms.length==0?"无会议室信息":rowTemp.rooms;
                        var meetingDetailUrl = '';
                        if (isUsualUser) {
                            meetingDetailUrl = 'href="/meeting/meeting/detail/'+rowTemp.id+'"';
                        }
                        var videoStr = '"></a><a '+meetingDetailUrl+' class="meeting-name ';
                        var leftStr = '<div class="grid-item-wrapper">' +
                            '<div class="grid_td-item " title="'+ rowTemp.subject +'"><a class="mo-icons-bg video_icon ';
                        var conflictStr = '">'+ rowTemp.subject +'</a>'
                        var rightStr = ' </div>' +
                            '<div class="grid_td-item meeting-rooms" title="'+ rowTemp.rooms +'">'+ rowTemp.rooms +'</div>' +
                            '</div>'
                        var htmlStr = leftStr+videoStr+rightStr
                        if(row.isVideoMeeting=="1"){
                            videoStr = videoStr +'video '

                        }else{
                            videoStr = "hidden"+videoStr;
                        }
                        if(rowTemp.isConflict&&rowTemp.isConflict!=undefined&&rowTemp.isConflict!=null){
                            conflictStr = "meeting-name-conflict"+conflictStr+'<span class="meeting-conflict">会议冲突</span>'
                        }
                        htmlStr = leftStr+videoStr+conflictStr+rightStr;
                        return htmlStr;
                    }},
                {field:'date',width:198,align:'right',formatter:function(val,row){
                        var rowTemp = $.extend( false,row  );;
                        var startTimeDate = new Date(rowTemp.startTime.replace(new RegExp( '-' , "g" ),"/"))
                        var startTimeDateStr = startTimeDate.toDateString();
                        var meetingTime = '手动结束'
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
                        return '<div class="grid-item-wrapper book-meeting-item">' +
                            '<div class="grid_td-item meeting-status" title="'+ rowTemp.time +'">'+ rowTemp.time +'</div>' +
                            '<div class="grid_td-item meeting-user" title="'+ rowTemp.creator +'">'+ rowTemp.creator +'</div>' +
                            '</div>'
                    }}
            ]],
            onLoadSuccess:function (data) {
                var className={
                    addClass:'book-meeting',
                    removeClass:'call-meeting past-meeting'
                }
                var $dom=$("#book_meeting_container");
                onLoadSuccessFun(that,data,className,$dom,1);
            }
        });
        paginationFun(that);
    }
}
BookMeetingPanel.prototype = new Panel();
// 历史会议
var PastMeetingPanel = function (id) {
    Panel.call(this);
    this.emptyMsg='暂无历史会议记录';
    this.readyData = {
        url:domainType=='coreDomain'?Mo.Config.appUrl+"/nms/getHistoryMeetingList":Mo.Config.appUrl+"/meeting/listMeetingByCondition",
        moid:domainType=='coreDomain'?moid:userMoid,
        searchType:isUserDomainAdmin?'1':'0',
        idStr:(panelData.past_meeting_info||panelData.meeting_info).contentId,
        dataGridIdStr:id==undefined?"past_meeting_info_grid":id,
        data:null,
        dataGrid:false,
    };
    this.noDataFun = function () {
        var id="past_meeting_container";
        var className="past-meeting";
        noDataStyleFun(this,id,className,this.emptyMsg);
    };
    this.refreshFun = function () {
        this.initDataGrid();
    }
    this.initDataGrid = function () {
        var that = this;
        var endTime = new Date();
        var startTime = new Date(endTime.getTime());
        startTime.setDate(startTime.getDate() - 1);
        var headerTitle = $(".title", ".meeting_info .header-title.active ").text()
        if(that.readyData.dataGrid){
            $("#"+that.readyData.dataGridIdStr).datagrid("reload");
            return;
        }
        that.readyData.dataGrid = $("#"+that.readyData.dataGridIdStr).datagrid({
            idField : "id",
            pagination:true,
            pageNumber: 1,//初始化页面数量
            pageSize: 5,//初始化显示条数
            pageList:[5],
            //data:that.readyData.data,
            method:'get',
            loadMsg:"",
            url:that.readyData.url,
            onBeforeLoad:function(params){
                params.startTime = times.getCurrentTime(startTime);
                params.endTime = times.getCurrentTime(endTime);
                var startTimeTemp = domainType=='coreDomain'?params.startTime.replace(new RegExp( '-' , "g" ),"/"):params.startTime;
                var endTimeTemp = domainType=='coreDomain'?params.endTime.replace(new RegExp( '-' , "g" ),"/"):params.endTime;
                onBeforeLoadFun(that,params,startTimeTemp,endTimeTemp,4,1);//that,params,startTime,endTime,type,order
            },
            loadFilter:function(loadData){
                return loadFilterFun(loadData)
            },
            columns:[[
                {field:'id',hidden:true},
                {field:'name',width:311,align:'left',formatter:function(val,row){
                        var rowTemp = $.extend( false,row  );
                        rowTemp.subject = rowTemp.isVideoMeeting=="1"?"["+rowTemp.meetingResourceVO.multi+"方"+rowTemp.meetingResourceVO.resolution+"]"+rowTemp.subject:rowTemp.subject
                        var rooms = [];
                        for(var i = 0;i<rowTemp.rooms.length;i++){
                            rooms.push(rowTemp.rooms[i].name);
                        }
                        rowTemp.rooms = rooms.toLocaleString();
                        rowTemp.rooms = rowTemp.rooms.length==0?"无会议室信息":rowTemp.rooms;
                        var meetingDetailUrl = '';
                        if (isUsualUser) {
                            meetingDetailUrl = 'href="/meeting/meeting/detail/'+row.id+'?history"';
                        }
                        var videoStr = '"></a><a '+ meetingDetailUrl +' class="meeting-name ';
                        var leftStr = '<div class="grid-item-wrapper">' +
                            '<div class="grid_td-item " title="'+ row.subject +'"><a class="mo-icons-bg video_icon ';
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
                        var rowTemp = $.extend( false,row  );
                        var startTimeDate = new Date(rowTemp.startTime.replace(new RegExp( '-' , "g" ),"/"))
                        var startTimeDateStr = startTimeDate.toDateString();
                        var meetingTime = '手动结束'
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
                        return '<div class="grid-item-wrapper past-meeting-item">' +
                            '<div class="grid_td-item meeting-status" title="'+ rowTemp.time +'">'+rowTemp.time +'</div>' +
                            '<div class="grid_td-item meeting-user" title="'+ rowTemp.creator +'">'+ rowTemp.creator +'</div>' +
                            '</div>'
                    }}
            ]],
            onLoadSuccess:function (data) {
                var className={
                    addClass:'past-meeting',
                    removeClass:'call-meeting book-meeting'
                }
                var $dom=$("#past_meeting_container");
                onLoadSuccessFun(that,data,className,$dom,2);
            }
        });
        paginationFun(that);
    }
}
PastMeetingPanel.prototype = new Panel();

// 三个小模块（正在召开的会议，预约的会议，历史会议）的公共方法
function noDataStyleFun(_this,id,className,msg){
    var idStr= "#"+_this.readyData.idStr;
    $(idStr).append('<div id="'+id+'"><div id="'+_this.readyData.dataGridIdStr+'"></div></div>')
    $(".no-data",idStr).removeClass("hidden");//空数据渲染
    $(".no-data",idStr).addClass(className);
    $(".warm-text",idStr).text(msg);
}
function paginationFun(that){
    var pager = $("#"+that.readyData.dataGridIdStr).datagrid("getPager")
    pager.pagination({
        layout: ["manual","prev", "next"],
        displayMsg:"",
        beforePageText:"",
        afterPageText:"/ {pages}"
    });
}
function loadFilterFun(loadData){
    var data = {total:0,rows:[]}
    if(loadData.success){
        data.rows = loadData.data.meetings;
        data.total = loadData.data.total;
        return data;
    }
    return data;
}
function onBeforeLoadFun(that,params,startTime,endTime,type,order){
    params.moid = that.readyData.moid;
    params.searchType = that.readyData.searchType;
    params.count = params.rows;
    params.start = (params.page-1)*params.rows;
    params.startTime = startTime;
    params.endTime = endTime;
    params.type = type;
    params.order = order;
}
function onLoadSuccessFun(that,data,className,$dom,indexNum){
    var index = - 1;
    var headerTitle = $(".title", ".meeting_info .header-title.active ").text()
    index = panelData.meeting_info==undefined?-1:panelData.meeting_info.head_titles.indexOf(headerTitle)
    $dom.hide();
    if(data.total==0){
        if(that.readyData.dataGrid&&(index==-1||index==indexNum)) {
            $(".no-data", "#" + that.readyData.idStr).addClass(className.addClass)
            $(".no-data", "#" + that.readyData.idStr).removeClass(className.removeClass)
            $(".no-data", "#" + that.readyData.idStr).removeClass("hidden")
            $(".warm-text", "#" + that.readyData.idStr).text(that.emptyMsg);
            $dom.hide();
            controller.isDataGridInit.callMeetingInfoDataGrid = null;
        }
    }else{
        if(that.readyData.dataGrid&&(index==-1||index==indexNum)) {
            $(".no-data", "#" + that.readyData.idStr).addClass("hidden")
            $dom.show();
        }
    }
}