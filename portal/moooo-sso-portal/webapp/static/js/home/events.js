/**
 * Created by xiaol on 2018/1/31.
 */

/*图表点击事件*/
function minusTime(contentId){
    if(contentId=='platform_resource'){
        cpuMinusTime();
    }
    if(contentId=='meeting_count'){
        meetingTerminalCountMinusTime();
    }
}
function plusTime(contentId){
    if(contentId=='platform_resource'){
        cpuPlusTime();
    }
    if(contentId=='meeting_count'){
        meetingTerminalCountPlusTime();
    }
}
function leftMoveTime(contentId){
    if(contentId=='platform_resource'){
        cpuLeftMoveTime();
    }
    if(contentId=='meeting_count'){
        meetingTerminalCountLeftMoveTime();
    }
}
function rightMoveTime(contentId){
    if(contentId=='platform_resource'){
        cpuRightMoveTime();
    }
    if(contentId=='meeting_count'){
        meetingTerminalCountRightMoveTime();
    }
}
function cpuMinusTime(){
	var platformResourceOption = graphOption.platformResourceOption
    var data = platformResourceOption.xData;
    var lineAreaOption = echartOption.lineAreaOption;
    var lineChart = drawGraph.platformResourceChart;
    var length = data.length;
    if (platformResourceOption.startIndex > 0 || platformResourceOption.endIndex < length - 1) {
        var delta = 1 / length * 100;
        if (platformResourceOption.startIndex > 0) {
            platformResourceOption.startIndex -= 1;
            lineAreaOption.dataZoom[0].start -= delta;
        }
        if (platformResourceOption.endIndex < length - 1) {
            platformResourceOption.endIndex += 1;
            lineAreaOption.dataZoom[0].end += delta;
        }
        lastStatusResourceTemp(platformResourceOption,data);
        lineChart.setOption(lineAreaOption)
    }
    showHideLeftMove('platform_resource', platformResourceOption.startIndex);
    showHideRightMove('platform_resource', platformResourceOption.endIndex,length-1);
}
// 减
function meetingTerminalCountMinusTime(){
	var meetingTerminalCountOption = graphOption.meetingTerminalCountOption
    var data = meetingTerminalCountOption.xData;
    var lineOption = echartOption.lineOption;
    var lineChart = drawGraph.meetingTerminalCountChart
    var length = data.length;
    if (meetingTerminalCountOption.startIndex > 0 || meetingTerminalCountOption.endIndex < length - 1) {
        var delta = 1 / length * 100;
        if (meetingTerminalCountOption.startIndex > 0) {
            meetingTerminalCountOption.startIndex -= 1;
            lineOption.dataZoom[0].start -= delta;
        }
        if (meetingTerminalCountOption.endIndex < length - 1) {
            meetingTerminalCountOption.endIndex += 1;
            lineOption.dataZoom[0].end += delta;
        }
        var yData = meetingTerminalCountOption.yData;
        var meetingTerminalName = $(".title",$(".active",".meeting_count")).text()
        var detailOfMeetingTerminal = decriptionsOfMeeting[meetingTerminalName];
        var maxValue = 100;
        if(meetingTerminalName==panelData.meeting_count.head_titles[0]){
            lastStatusTerminalTemp('bfMeeting',meetingTerminalCountOption,data)
        	detailOfMeetingTerminal =  controller.setConcurrentMeetingDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        }
        if(meetingTerminalName==panelData.meeting_count.head_titles[1]){
            lastStatusTerminalTemp('bfOnlineMeeting',meetingTerminalCountOption,data)
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        	detailOfMeetingTerminal =  controller.setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        }
        if(meetingTerminalName==panelData.meeting_count.head_titles[2]){
            lastStatusTerminalTemp('zdOnline',meetingTerminalCountOption,data)
        	detailOfMeetingTerminal =  controller.setTerminalDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        	maxValue = detailOfMeetingTerminal.maxData.value3>maxValue?detailOfMeetingTerminal.maxData.value3:maxValue;
        }
        $(".meeting-count-data-description").remove();
    	var meetingCountInfoHtml = template('meeting-count-info',detailOfMeetingTerminal);
    	$("#meeting_count").append(meetingCountInfoHtml);
    	
    	
        controller.setEchartsLineMaxValue(maxValue);
    	lineOption.yAxis[0].max = echartOption.lineMaxValue;
    	lineOption.yAxis[0].interval = echartOption.lineMaxValue/echartOption.lineMarkLineNum;
    	for(var i = 0;i<echartOption.lineMarkLineNum-1;i++){
    		lineOption.series[0].markLine.data[i].yAxis = lineOption.yAxis[0].interval*(i+1);
    	}
        lineChart.setOption(lineOption)
    }
    showHideLeftMove('meeting_count', meetingTerminalCountOption.startIndex);
    showHideRightMove('meeting_count', meetingTerminalCountOption.endIndex,length-1);
}

function cpuPlusTime(){
	var platformResourceOption = graphOption.platformResourceOption
    var data = platformResourceOption.xData;
    var lineAreaOption = echartOption.lineAreaOption;
    var lineAreaChart = drawGraph.platformResourceChart;
    var length = data.length;
    if(platformResourceOption.endIndex>0
        &&platformResourceOption.endIndex>platformResourceOption.startIndex
        &&platformResourceOption.endIndex - platformResourceOption.startIndex >2){
        var delta = 1 / length * 100;
        platformResourceOption.startIndex += 1;
        lineAreaOption.dataZoom[0].start += delta;
        platformResourceOption.endIndex -= 1;
        lineAreaOption.dataZoom[0].end -= delta;
        lineAreaChart.setOption(lineAreaOption)
        lastStatusResourceTemp(platformResourceOption,data);
    }
    showHideLeftMove('platform_resource', platformResourceOption.startIndex);
    showHideRightMove('platform_resource', platformResourceOption.endIndex,length-1);
    
}

// 加
function meetingTerminalCountPlusTime(){
	var meetingTerminalCountOption = graphOption.meetingTerminalCountOption
    var data = meetingTerminalCountOption.xData;
    var lineOption = echartOption.lineOption;
    var lineChart = drawGraph.meetingTerminalCountChart
    var length = data.length;
    if(meetingTerminalCountOption.endIndex>0
        &&meetingTerminalCountOption.endIndex>meetingTerminalCountOption.startIndex
        &&meetingTerminalCountOption.endIndex - meetingTerminalCountOption.startIndex > 2){
        var delta = 1 / length * 100;
        meetingTerminalCountOption.startIndex += 1;
        lineOption.dataZoom[0].start += delta;
        meetingTerminalCountOption.endIndex -= 1;
        lineOption.dataZoom[0].end -= delta;
        var yData = meetingTerminalCountOption.yData;
        var meetingTerminalName = $(".title",$(".active",".meeting_count")).text();//当前激活状态的选项卡
        var detailOfMeetingTerminal = decriptionsOfMeeting[meetingTerminalName];
        var maxValue = 100;
        if(meetingTerminalName==panelData.meeting_count.head_titles[0]){//并发会议统计
            lastStatusTerminalTemp('bfMeeting',meetingTerminalCountOption,data)
        	detailOfMeetingTerminal =  controller.setConcurrentMeetingDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        }
        if(meetingTerminalName==panelData.meeting_count.head_titles[1]){//并发会议在线终端统计
            lastStatusTerminalTemp('bfOnlineMeeting',meetingTerminalCountOption,data)
        	detailOfMeetingTerminal =  controller.setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        }
        if(meetingTerminalName==panelData.meeting_count.head_titles[2]){//终端在线统计
            lastStatusTerminalTemp('zdOnline',meetingTerminalCountOption,data)
        	detailOfMeetingTerminal =  controller.setTerminalDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        	maxValue = detailOfMeetingTerminal.maxData.value3>maxValue?detailOfMeetingTerminal.maxData.value3:maxValue;
        }
        $(".meeting-count-data-description").remove();
    	var meetingCountInfoHtml = template('meeting-count-info',detailOfMeetingTerminal);
    	$("#meeting_count").append(meetingCountInfoHtml);
        showHideLeftMove('meeting_count', meetingTerminalCountOption.startIndex);
        showHideRightMove('meeting_count', meetingTerminalCountOption.endIndex,length-1);
        controller.setEchartsLineMaxValue(maxValue);
        lineOption.yAxis[0].max = echartOption.lineMaxValue;
        lineOption.yAxis[0].interval = echartOption.lineMaxValue/echartOption.lineMarkLineNum;
    	for(var i = 0;i<echartOption.lineMarkLineNum-1;i++){
    		lineOption.series[0].markLine.data[i].yAxis = lineOption.yAxis[0].interval*(i+1);
    	}
        lineChart.setOption(lineOption)
    }
}

function cpuRightMoveTime(){
    var platformResourceOption = graphOption.platformResourceOption
    var data = platformResourceOption.xData;
    var lineAreaOption = echartOption.lineAreaOption;
    var lineAreaChart = drawGraph.platformResourceChart;
    var length = data.length;
    if(platformResourceOption.endIndex<length-1){
        platformResourceOption.startIndex = platformResourceOption.startIndex+1;
        platformResourceOption.endIndex = platformResourceOption.endIndex+1;
        lineAreaOption.dataZoom[0].start = platformResourceOption.startIndex/(length-1)*100;
        lineAreaOption.dataZoom[0].end = platformResourceOption.endIndex/(length-1)*100;
        lastStatusResourceTemp(platformResourceOption,data);
        lineAreaChart.setOption(lineAreaOption)
    }
    showHideLeftMove('platform_resource', platformResourceOption.startIndex);
    showHideRightMove('platform_resource', platformResourceOption.endIndex,length-1);
}

// 右移
function meetingTerminalCountRightMoveTime(){
    var meetingTerminalCountOption = graphOption.meetingTerminalCountOption
    var data = meetingTerminalCountOption.xData;
    var lineOption = echartOption.lineOption;
    var lineChart = drawGraph.meetingTerminalCountChart
    var length = data.length;
    if(meetingTerminalCountOption.endIndex<length-1){
        meetingTerminalCountOption.startIndex = meetingTerminalCountOption.startIndex+1;
        meetingTerminalCountOption.endIndex = meetingTerminalCountOption.endIndex+1;
        lineOption.dataZoom[0].start = meetingTerminalCountOption.startIndex/(length-1)*100;
        lineOption.dataZoom[0].end = meetingTerminalCountOption.endIndex/(length-1)*100;
        var yData = meetingTerminalCountOption.yData;
        var meetingTerminalName = $(".title",$(".active",".meeting_count")).text();
        var detailOfMeetingTerminal = decriptionsOfMeeting[meetingTerminalName];
        var maxValue = 100;
        if(meetingTerminalName==panelData.meeting_count.head_titles[0]){
            lastStatusTerminalTemp('bfMeeting',meetingTerminalCountOption,data);
        	detailOfMeetingTerminal =  controller.setConcurrentMeetingDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        }
        if(meetingTerminalName==panelData.meeting_count.head_titles[1]){
            lastStatusTerminalTemp('bfOnlineMeeting',meetingTerminalCountOption,data)
        	detailOfMeetingTerminal =  controller.setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        }
        if(meetingTerminalName==panelData.meeting_count.head_titles[2]){
            lastStatusTerminalTemp('zdOnline',meetingTerminalCountOption,data);
        	detailOfMeetingTerminal =  controller.setTerminalDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        	maxValue = detailOfMeetingTerminal.maxData.value3>maxValue?detailOfMeetingTerminal.maxData.value3:maxValue;
        }
        $(".meeting-count-data-description").remove();
    	var meetingCountInfoHtml = template('meeting-count-info',detailOfMeetingTerminal);
    	$("#meeting_count").append(meetingCountInfoHtml);
        controller.setEchartsLineMaxValue(maxValue);
        lineOption.yAxis[0].max = echartOption.lineMaxValue;
        lineOption.yAxis[0].interval = echartOption.lineMaxValue/echartOption.lineMarkLineNum;
    	for(var i = 0;i<echartOption.lineMarkLineNum-1;i++){
    		lineOption.series[0].markLine.data[i].yAxis = lineOption.yAxis[0].interval*(i+1);
    	}
        lineChart.setOption(lineOption)
    }
    showHideLeftMove('meeting_count', meetingTerminalCountOption.startIndex);
    showHideRightMove('meeting_count', meetingTerminalCountOption.endIndex,length-1);
}

function cpuLeftMoveTime(){
    var platformResourceOption = graphOption.platformResourceOption
    var data = platformResourceOption.xData;
    var lineAreaOption = echartOption.lineAreaOption;
    var lineAreaChart = drawGraph.platformResourceChart;
    var length = data.length;
    if(platformResourceOption.startIndex>0){
        platformResourceOption.startIndex = platformResourceOption.startIndex-1;
        platformResourceOption.endIndex = platformResourceOption.endIndex-1;
        lineAreaOption.dataZoom[0].start = platformResourceOption.startIndex/(length-1)*100;
        lineAreaOption.dataZoom[0].end = platformResourceOption.endIndex/(length-1)*100;
        lastStatusResourceTemp(platformResourceOption,data);
        lineAreaChart.setOption(lineAreaOption)
    }
    showHideLeftMove('platform_resource',platformResourceOption.startIndex);
    showHideRightMove('platform_resource',platformResourceOption.endIndex,length-1);
}

// 左移动箭头
function meetingTerminalCountLeftMoveTime(){
    var meetingTerminalCountOption = graphOption.meetingTerminalCountOption
    var data = meetingTerminalCountOption.xData;
    var lineOption = echartOption.lineOption;
    var lineChart = drawGraph.meetingTerminalCountChart
    var length = data.length;
    if(meetingTerminalCountOption.startIndex>0){
        meetingTerminalCountOption.startIndex = meetingTerminalCountOption.startIndex-1;
        meetingTerminalCountOption.endIndex = meetingTerminalCountOption.endIndex-1;
        lineOption.dataZoom[0].start = meetingTerminalCountOption.startIndex/(length-1)*100;
        lineOption.dataZoom[0].end = meetingTerminalCountOption.endIndex/(length-1)*100;
        var yData = meetingTerminalCountOption.yData;
        var meetingTerminalName = $(".title",$(".active",".meeting_count")).text();
        var detailOfMeetingTerminal = decriptionsOfMeeting[meetingTerminalName];
        var maxValue = 100;
        if(meetingTerminalName==panelData.meeting_count.head_titles[0]){
            lastStatusTerminalTemp('bfMeeting',meetingTerminalCountOption,data);
        	detailOfMeetingTerminal =  controller.setConcurrentMeetingDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        }
        if(meetingTerminalName==panelData.meeting_count.head_titles[1]){
            lastStatusTerminalTemp('bfOnlineMeeting',meetingTerminalCountOption,data)
        	detailOfMeetingTerminal =  controller.setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        }
        if(meetingTerminalName==panelData.meeting_count.head_titles[2]){
            lastStatusTerminalTemp('zdOnline',meetingTerminalCountOption,data)
        	detailOfMeetingTerminal =  controller.setTerminalDes(detailOfMeetingTerminal, yData, meetingTerminalCountOption.startIndex, meetingTerminalCountOption.endIndex);
        	maxValue = detailOfMeetingTerminal.maxData.value1>detailOfMeetingTerminal.maxData.value2?detailOfMeetingTerminal.maxData.value1:detailOfMeetingTerminal.maxData.value2;
        	maxValue = detailOfMeetingTerminal.maxData.value3>maxValue?detailOfMeetingTerminal.maxData.value3:maxValue;
        }
        $(".meeting-count-data-description").remove();
    	var meetingCountInfoHtml = template('meeting-count-info',detailOfMeetingTerminal);
    	$("#meeting_count").append(meetingCountInfoHtml);
        	
        controller.setEchartsLineMaxValue(maxValue);
        lineOption.yAxis[0].max = echartOption.lineMaxValue;
        lineOption.yAxis[0].interval = echartOption.lineMaxValue/echartOption.lineMarkLineNum;
    	for(var i = 0;i<echartOption.lineMarkLineNum-1;i++){
    		lineOption.series[0].markLine.data[i].yAxis = lineOption.yAxis[0].interval*(i+1);
    	}
        lineChart.setOption(lineOption)
    }
    showHideLeftMove('meeting_count',meetingTerminalCountOption.startIndex);
    showHideRightMove('meeting_count',meetingTerminalCountOption.endIndex,length-1);
}
// 并发统计  并发会议在线统计 终端在线统计 的保留操作后的结果
function lastStatusTerminalTemp(tempName,meetingTerminalCountOption,data){
    controller.terminalTemp[tempName]={
        startIndex: meetingTerminalCountOption.startIndex,
        endIndex:meetingTerminalCountOption.endIndex,
        startValue:data[meetingTerminalCountOption.startIndex],
        endValue:data[meetingTerminalCountOption.endIndex]
    }
}
//平台CPU资源  平台内存资源 的保留操作后的结果
function lastStatusResourceTemp(platformResourceOption,data){
    var platformResourceTerminalName = $(".title",$(".active",".platform_resource")).text();
    var name= panelData.platform_resource.head_titles;
    if(platformResourceTerminalName==name[0]){//平台cpu资源
        controller.resourceTemp.platCup={
            startIndex: platformResourceOption.startIndex,
            endIndex:platformResourceOption.endIndex,
            startValue:data[platformResourceOption.startIndex],
            endValue:data[platformResourceOption.endIndex]
        }
    }
    if(platformResourceTerminalName==name[1]){//平台内存资源
        controller.resourceTemp.platMemory={
            startIndex: platformResourceOption.startIndex,
            endIndex:platformResourceOption.endIndex,
            startValue:data[platformResourceOption.startIndex],
            endValue:data[platformResourceOption.endIndex]
        }
    }
}
function showHideLeftMove(graphName,startIndex){
    if(startIndex==0){
        $(".leftMove","#"+graphName).addClass("hidden");
    }else{
        $(".leftMove","#"+graphName).removeClass("hidden");
    }
}
function showHideRightMove(graphName,endIndex,value){
    if(endIndex==value){
        $(".rightMove","#"+graphName).addClass("hidden");
    }else{
        $(".rightMove","#"+graphName).removeClass("hidden");
    }
}


function initResourceClick(){
    $(".cpu-resource-wrapper .resource-content").click(function(){
        $(".cpu-resource-wrapper .resource-content").removeClass("selected-resource")
        $(this).addClass("selected-resource")
    })
    $(".memory-resource-wrapper .resource-content").click(function(){
        $(".memory-resource-wrapper .resource-content").removeClass("selected-resource")
        $(this).addClass("selected-resource")
    })

}
