// document.write("<script language=javascript src='./static/js/home/panels/panel.js'></script>");
//
// document.write("<script language=javascript src='./static/js/home/controller.js'></script>");
// document.write("<script language=javascript src='./static/js/home/drawGraph.js'></script>");

/**
 * 该文件主要针对【并发会议统计】【并发会议在线终端统计】【终端在线统计】所属的panel进行优化
 * @constructor
 */
var MeetingCountPanel = function () {
    Panel.call(this)
    this.readyData = [{
        data_name:"concurrentMeetingCountData",//并发会议统计
        value:null,
        toolTipSeriesName1:'并发会议数量',
        toolTipSeriesName2:'并发会议数量',

    },{
        data_name:"concurrentMeetingTerminalCountData",//并发会议在线终端统计
        value:null,
        toolTipSeriesName1:'并发终端数量',
        toolTipSeriesName2:'并发终端数量',
    },{
        data_name:"meetingTerminalCountData",//在线终端统计
        value:null,
        toolTipSeriesName1:'SIP终端在线数',
        toolTipSeriesName2:'H.323终端在线数',
        toolTipSeriesName3:'终端在线总数',
    }];


    this.getEmptyData = function () {
        var data= {//渲染空数据
            'time':[],
            'values':[[],[],[]]
        };
        for(var i = 0;i<24;i++){
            var currentTime = times.formatTimeHour(new Date(times.formatTimeHour(new Date(new Date().getTime()-i*times.oneHour))));
            currentTime = currentTime.replace(new RegExp( '/' , "g" ),"-");
            currentTime = currentTime.slice(5,-3);
            data['time'].unshift(currentTime);
        }
        return data
    };




    this.end_time = times.formatTime(new Date());//获取数据的终止时间
    this.start_time = times.formatTime(new Date(new Date(this.end_time).getTime()-30*24*60*60*1000));//获取数据的起始时间

    this.noDataFun = function () {
        var meetingGraphHtml = template('graph-wrapper',panelData.meeting_count);//渲染图表数据
        $("#"+panelData.meeting_count.contentId).append(meetingGraphHtml);

        var data = this.getEmptyData()
        drawGraph.drawMeetingTerminalGraph(data);

        $(".meeting-count-data-description").remove();
        var meetingCountInfoHtml = template('meeting-count-info',decriptionsOfMeeting[panelData.meeting_count.head_titles[0]]);
        $("#meeting_count").append(meetingCountInfoHtml);
    }
    this.storePanelDataFun = function () {
        this.storeConcurrentMeetingCount();
        this.storeConcurrentMeetingTerminalCount();
        this.storeMeetingTerminalCount();
    }
    this.refreshFun = function () {
        this.storePanelDataFun();
    }
    this.storeConcurrentMeetingCount = function(){
        var that = this;

        var url = Mo.Config.appUrl+"/nms/getMeetingStatistic";

        var requestGet = $.get(url,{'moid':moid,'start_time':this.start_time,'end_time':this.end_time},function(t){
            if(t.success){
                var data= {
                    'time':[],
                    'values':[[],[]]
                };
                statistic = t.data.statistic;
                data.time = statistic.multi.time;
                data.values[0] = statistic.multi.values;
                data.values[1] = statistic.p2p.values;
                var timeLength = data.time.length;
                if (data.values[0][timeLength - 1] == null || data.values[1][timeLength - 1] == null) {
                    data.values[0].pop(); //删除最后一个空数据
                    data.values[1].pop();
                    data.time.pop();
                    timeLength--;
                }
                for(var i = 0;i<timeLength;i++){
                    //修正中间可能未统计到的数据
                    if (data.values[0][i] == null) {
                        data.values[0][i] = 0;
                    }
                    if (data.values[1][i] == null) {
                        data.values[1][i] = 0;
                    }
                    var timeStr = data.time[i];
                    timeStr = timeStr.replace(/\//g,"-");
                    data.time[i] = timeStr.slice(5,-3)
                }

                that.readyData[0].value = data;
                var meetingHeaderTitle = $(".meeting_count .tab .header-title.active").text()
                var headTitleIndex = panelData.meeting_count.head_titles.indexOf(meetingHeaderTitle)
                if(headTitleIndex==0){
                    that.drawPanelByDataFun()
                }


            }

        },'json').error(function(){

        });
        controller.ajaxRequestArray.getConcurrentMeetingCount = requestGet
    }
    this.storeConcurrentMeetingTerminalCount = function(){
        var that = this;
        var url = Mo.Config.appUrl+"/nms/getTerminalStatistic";
        var requestGet = $.get(url,{'moid':moid,'start_time':this.start_time,'end_time':this.end_time},function(t){
            if(t.success){
                var data= {
                    'time':[],
                    'values':[[],[]]
                };
                statistic = t.data.statistic;
                data.time = statistic.multi.time;
                data.values[0] = statistic.multi.values;
                data.values[1] = statistic.p2p.values;
                var timeLength = data.time.length;
                if (data.values[0][timeLength - 1] == null || data.values[1][timeLength - 1] == null) {
                    data.values[0].pop(); //删除最后一个空数据
                    data.values[1].pop();
                    data.time.pop();
                    timeLength--;
                }
                for(var i = 0;i<timeLength;i++){
                    //修正中间可能未统计到的数据
                    if (data.values[0][i] == null) {
                        data.values[0][i] = 0;
                    }
                    if (data.values[1][i] == null) {
                        data.values[1][i] = 0;
                    }
                    var timeStr = data.time[i];
                    timeStr = timeStr.replace(/\//g,"-");
                    data.time[i] = timeStr.slice(5,-3)
                }

            }


            //存储缓存数据
            that.readyData[1].value = data;
            var meetingHeaderTitle = $(".meeting_count .tab .header-title.active").text()
            var headTitleIndex = panelData.meeting_count.head_titles.indexOf(meetingHeaderTitle)
            if(headTitleIndex==1){
                that.drawPanelByDataFun()
            }


        },'json').error(function(){

        });
        controller.ajaxRequestArray.getConcurrentMeetingTerminalCount = requestGet;
    }
    this.storeMeetingTerminalCount = function(){
        var that = this;
        var url = Mo.Config.appUrl+"/nms/getOnlineStatistic";
        var requestGet = $.get(url,{'moid':moid,'start_time':this.start_time,'end_time':this.end_time},function(t){
            if(t.success){
                var data= {
                    'time':[],
                    'values':[[],[]]
                };
                statistic = t.data.statistic;
                data.time = statistic.sip.time;
                data.values[0] = statistic.sip.values;
                data.values[1] = statistic.h323.values;
                data.values[2] = statistic.all.values;
                var timeLength = data.time.length;
				if (data.values[0][timeLength - 1] == null || data.values[1][timeLength - 1] == null || data.values[2][timeLength - 1] == null) {
                    data.values[0].pop(); //删除最后一个空数据
                    data.values[1].pop();
                    data.values[2].pop();
                    data.time.pop();
                    timeLength--;
                }
                for(var i = 0;i<timeLength;i++){
                    //修正中间可能未统计到的数据
                    if (data.values[0][i] == null) {
                        data.values[0][i] = 0;
                    }
                    if (data.values[1][i] == null) {
                        data.values[1][i] = 0;
					}
					if (data.values[2][i] == null) {
                        data.values[2][i] = 0;
                    }
                    var timeStr = data.time[i];
                    timeStr = timeStr.replace(/\//g,"-");
                    data.time[i] = timeStr.slice(5,-3)
                }

            }

            that.readyData[2].value = data;
            var meetingHeaderTitle = $(".meeting_count .tab .header-title.active").text()
            var headTitleIndex = panelData.meeting_count.head_titles.indexOf(meetingHeaderTitle)
            if(headTitleIndex==2){
                that.drawPanelByDataFun()
            }


        },'json').error(function(){

        });
        controller.ajaxRequestArray.getMeetingTerminalCount = requestGet
    }
    this.drawPanelByDataFun= function () {
        var meetingHeaderTitle = $(".meeting_count .tab .header-title.active").text()
        var headTitleIndex = panelData.meeting_count.head_titles.indexOf(meetingHeaderTitle)
        if (headTitleIndex >= 0) {
            var data = this.getEmptyData()
            var detailOfMeetingTerminal = decriptionsOfMeeting[panelData.meeting_count.head_titles[headTitleIndex]];
            var readyData = this.readyData
            if (readyData[headTitleIndex].value != null) {//存在缓存数据
                data = readyData[headTitleIndex].value
                //begin:<记录下标>记录当前时间轴的开始下标和结束下标
                var tempName=['bfMeeting','bfOnlineMeeting','zdOnline'][headTitleIndex];
                var endIndex = controller.terminalTemp[tempName].endIndex == null ? data['time'].length - 1 : controller.terminalTemp[tempName].endIndex;
                var startIndex = controller.terminalTemp[tempName].startIndex == null ? data['time'].length - 1 - graphOption.meetingTerminalCountOption.num + 1 : controller.terminalTemp[tempName].startIndex;
                //end:<记录下标>
                //begin:<最大值设置>根据当前时间轴（startIndex~endIndex）显示的数据设置描述信息的最大值和最小值，并根据最大值来设置图表中y轴的最大值
                detailOfMeetingTerminal = controller.setConcurrentMeetingDes(decriptionsOfMeeting[panelData.meeting_count.head_titles[headTitleIndex]], data.values, startIndex, endIndex)
                var maxValue = 0;
                if (detailOfMeetingTerminal.maxData.value3) {
                    maxValue = Math.max(detailOfMeetingTerminal.maxData.value1, detailOfMeetingTerminal.maxData.value2, detailOfMeetingTerminal.maxData.value3
                    );
                } else {
                    maxValue = Math.max(detailOfMeetingTerminal.maxData.value1, detailOfMeetingTerminal.maxData.value2);
                }
                controller.setEchartsLineMaxValue(maxValue);
                //end:<最大值设置>
            }
            graphOption.meetingTerminalCountOption.toolTipSeriesName1 = this.readyData[headTitleIndex].toolTipSeriesName1;
            graphOption.meetingTerminalCountOption.toolTipSeriesName2 = this.readyData[headTitleIndex].toolTipSeriesName2;
            graphOption.meetingTerminalCountOption.toolTipSeriesName3 = this.readyData[headTitleIndex].toolTipSeriesName3 == undefined ? "" : this.readyData[headTitleIndex].toolTipSeriesName3;

            drawGraph.drawMeetingTerminalGraph(data)

            $(".meeting-count-data-description").remove();

            var meetingCountInfoHtml = template('meeting-count-info', detailOfMeetingTerminal);
            $("#meeting_count").append(meetingCountInfoHtml);
        }
    }
}
MeetingCountPanel.prototype = new Panel()






