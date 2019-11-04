import Store from '@/store';
import { Times } from '@/utils/utils';
import { getMinMaxValue, getAverageValue, echartBtnVisiable, fetchLoop } from '../../utils';
import TemplateChart from './chart.art';
import TemplateBottom from './bottom.art';
import TemplateHeader from './header.art';

import { echartOption } from '@/pages/home/tpl/draw';
import echarts from 'echarts';

let myChart = null;

let echartsOpt = {
    xName:'时间',
    xData:'',
    yName:'数量',
    yData:'',
    color:['#5eb9ef','#09a206','#db4c4c'],
    toolTipSeriesName1:'',
    toolTipSeriesName2:'',
    toolTipSeriesName3:'',
    animationAttr:false,
    num:13,
    start:0,
    end:0,
    startIndex:0,
    endIndex:0,

    lineMaxValue:100,
    lineMarkLineNum: 5
}


let fetchState = {
    concurrentCount: new fetchLoop(),
    concurrentTerminalCount:  new fetchLoop(),
    terminalCount:  new fetchLoop(),
}

let decriptionsOfMeeting = {
    "concurrentCount":{
        id:"concurrent-meeting",
        title:{
            name1:"多点会议",
            name2:"点对点会议"
        },
        maxData:{
            name:'最大并发会议数量',
            value1:0,
            value2:0,
        },
        minData:{
            name:'最小并发会议数量',
            value1:0,
            value2:0,
        },
        averageData:{
            name:'平均并发会议数量',
            value1:0,
            value2:0,
        }
    },
    "concurrentTerminalCount": {
        id:"concurrent-meeting-terminal",
        title:{
            name1:"多点会议",
            name2:"点对点会议"
        },
        maxData:{
            name:'最大并发终端数量',
            value1:0,
            value2:0,
        },
        minData:{
            name:'最小并发终端数量',
            value1:0,
            value2:0,
        },
        averageData:{
            name:'平均并发终端数量',
            value1:0,
            value2:0,
        }
    },
    "terminalCount": {
        id:"terminal",
        title:{
            name1:"SIP",
            name2:"H.323",
            name3:"总和"
        },
        maxData:{
            name:'最大在线终端数量',
            value1:0,
            value2:0,
            value3:0,
        },
        minData:{
            name:'最小在线终端数量',
            value1:0,
            value2:0,
            value3:0,
        },
        averageData:{
            name:'平均在线终端数量',
            value1:0,
            value2:0,
            value3:0,
        }
    }
}

let terminalTemp = {//记录当前用户观看并发会议统计、并发会议在线终端统计、终端在线统计的开始和结束时间位置
    concurrentCount:{//并发会议统计
        startIndex:null,
        endIndex:null,
        startValue:null,
        endValue:null
    },
    concurrentTerminalCount:{//并发会议在线终端统计
        startIndex:null,
        endIndex:null,
        startValue:null,
        endValue:null
    },
    terminalCount:{//终端在线统计
        startIndex:null,
        endIndex:null,
        startValue:null,
        endValue:null
    }
}

let readyData = {
    concurrentCount: {
        data_name:"concurrentMeetingCountData",//并发会议统计
        value:null,
        toolTipSeriesName1:'并发会议数量',
        toolTipSeriesName2:'并发会议数量',

    },
    concurrentTerminalCount: {
        data_name:"concurrentMeetingTerminalCountData",//并发会议在线终端统计
        value:null,
        toolTipSeriesName1:'并发终端数量',
        toolTipSeriesName2:'并发终端数量',
    },
    terminalCount: {
        data_name:"meetingTerminalCountData",//在线终端统计
        value:null,
        toolTipSeriesName1:'SIP终端在线数',
        toolTipSeriesName2:'H.323终端在线数',
        toolTipSeriesName3:'终端在线总数',
    }
}


function getTabName(){
    let activeName = $(".meeting_count .active .title").text();
    let tabName = '';
    if(activeName == '并发会议统计'){//并发会议统计
        tabName = 'concurrentCount';
    }
    if(activeName == '并发会议在线终端统计'){//并发会议在线终端统计
        tabName = 'concurrentTerminalCount';
    }
    if(activeName == '在线终端统计'){//在线终端统计
        tabName = 'terminalCount';
    }
    return { tabName }
}


function getNoDataEchartsOpt() {
    let data= {//渲染空数据
        'time':[],
        'values':[[],[],[]]
    };
    for(let i = 0; i < 24; i++){
        let currentTime = Times.formatTimeHour(new Date(Times.formatTimeHour(new Date(new Date().getTime()-i * Times.oneHour))));
        currentTime = currentTime.replace(new RegExp( '/' , "g" ),"-");
        currentTime = currentTime.slice(5,-3);
        data['time'].unshift(currentTime);
    }
    return data
};

function echartRender(data){
    let { tabName } = getTabName()
    let currntTab = terminalTemp[tabName]

    if(currntTab.startIndex != null) {
        let startIndex = data.time.lastIndexOf(currntTab.startValue);
        let endIndex = data.time.lastIndexOf(currntTab.endValue);
        if(startIndex == -1){
            echartsOpt.startIndex = data.time.length - echartsOpt.num;
        }else {
            echartsOpt.startIndex = startIndex;
        }
        if(endIndex == -1) {
            echartsOpt.endIndex = data.time.length - 1;
        }else {
            echartsOpt.endIndex = endIndex;
        }
    }else {
        echartsOpt.startIndex = data.time.length - echartsOpt.num;
        echartsOpt.endIndex = data.time.length - 1;
    }
    echartsOpt.start = echartsOpt.startIndex / (data.time.length - 1) * 100;
    echartsOpt.end = echartsOpt.endIndex / (data.time.length - 1) * 100;

    echartsOpt.xData = data.time;
    echartsOpt.yData = data.values;

    //begin:Edge浏览器----解决“终端在线统计”刷新一段时间红色线条和其他线条互换颜色
    $("#meeting_count-graph").empty()
    $("#meeting_count-graph").removeAttr("style");
    $("#meeting_count-graph").removeAttr("_echarts_instance_");
    //end:Edge浏览器----解决“终端在线统计”刷新一段时间红色线条和其他线条互换颜色

    myChart = echarts.init(document.getElementById("meeting_count-graph"),"");
    
    
    let opts = echartOption.getDotLineOption(echartsOpt);

    //begin:Edge浏览器----解决“并发会议统计、并发会议在线终端统计”刷新一段时间，蓝色线条变成红色线条
    opts.color = echartsOpt.yData.length == 3 ? echartsOpt.color : echartsOpt.color.slice(0,2)
    //end:Edge浏览器----解决“并发会议统计、并发会议在线终端统计”刷新一段时间，蓝色线条变成红色线条

    opts.yAxis[0].max = echartsOpt.lineMaxValue;
    opts.yAxis[0].interval = echartsOpt.lineMaxValue / echartsOpt.lineMarkLineNum
    opts.series[0].markLine.data[0].yAxis = 0;
    
    for(let i = 0; i < echartsOpt.lineMarkLineNum - 1; i++){
        opts.series[0].markLine.data[i].yAxis = opts.yAxis[0].interval * (i + 1);
    }
    
    myChart.clear();
    myChart.setOption(opts, true);

}

function setConcurrentMeetingDes(detailOfMeetingTerminal, yData, startIndex, endIndex){//并发会议统计的 描述信息计算  最大值  最小值 平均值
    let graphMultiValues = yData[0].slice(startIndex,endIndex + 1); //返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
    let graphP2pValues = yData[1].slice(startIndex,endIndex+1);
    
    if(graphMultiValues.length>0){
        let minMaxData = getMinMaxValue(graphMultiValues);
        detailOfMeetingTerminal.averageData.value1 = getAverageValue(graphMultiValues);
        detailOfMeetingTerminal.minData.value1 = minMaxData.minData;
        detailOfMeetingTerminal.maxData.value1 =  minMaxData.maxData;
    }
    if(graphP2pValues.length>0){
        let minMaxData = getMinMaxValue(graphP2pValues);
        detailOfMeetingTerminal.averageData.value2 = getAverageValue(graphP2pValues);
        detailOfMeetingTerminal.minData.value2 = minMaxData.minData;
        detailOfMeetingTerminal.maxData.value2 = minMaxData.maxData;
    }
    if (yData.length > 2) {
        let graphTotalValues = yData[2].slice(startIndex, endIndex + 1);
        if (graphTotalValues.length > 0) {
            let minMaxData = getMinMaxValue(graphTotalValues);
            detailOfMeetingTerminal.averageData.value3 = getAverageValue(graphTotalValues);
            detailOfMeetingTerminal.minData.value3 = minMaxData.minData;
            detailOfMeetingTerminal.maxData.value3 = minMaxData.maxData;
        }
    }
    return detailOfMeetingTerminal;
    
}

function setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, startIndex, endIndex){//并发会议在线终端统计 描述信息计算  最大值  最小值 平均值
    let graphMultiValues = yData[0].slice(startIndex,endIndex+1);//返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。
    let graphP2pValues = yData[1].slice(startIndex,endIndex+1);
    
    if(graphMultiValues.length>0){
        let minMaxData = getMinMaxValue(graphMultiValues);
        detailOfMeetingTerminal.averageData.value1 = getAverageValue(graphMultiValues);
        detailOfMeetingTerminal.minData.value1 = minMaxData.minData;
        detailOfMeetingTerminal.maxData.value1 =  minMaxData.maxData;
    }
    if(graphP2pValues.length>0){
        let minMaxData = getMinMaxValue(graphP2pValues);
        detailOfMeetingTerminal.averageData.value2 = getAverageValue(graphP2pValues);
        detailOfMeetingTerminal.minData.value2 = minMaxData.minData;
        detailOfMeetingTerminal.maxData.value2 = minMaxData.maxData;
    }
    return detailOfMeetingTerminal;
    
    
}

function setTerminalDes(detailOfMeetingTerminal, yData, startIndex, endIndex){//终端在线统计的 描述信息计算  最大值  最小值 平均值
    let sipValues = yData[0].slice(startIndex,endIndex+1);
    let h323Values = yData[1].slice(startIndex,endIndex+1);
    let allValues = yData[2].slice(startIndex,endIndex+1);
    
    if(sipValues.length>0){
        let minMaxData = getMinMaxValue(sipValues);
        detailOfMeetingTerminal.averageData.value1 = getAverageValue(sipValues);
        detailOfMeetingTerminal.minData.value1 = minMaxData.minData;
        detailOfMeetingTerminal.maxData.value1 =  minMaxData.maxData;
    }
    if(h323Values.length>0){
        let minMaxData = getMinMaxValue(h323Values);
        detailOfMeetingTerminal.averageData.value2 = getAverageValue(h323Values);
        detailOfMeetingTerminal.minData.value2 = minMaxData.minData;
        detailOfMeetingTerminal.maxData.value2 = minMaxData.maxData;
    }
    if(allValues.length>0){
        let minMaxData = getMinMaxValue(allValues);
        detailOfMeetingTerminal.averageData.value3 = getAverageValue(allValues);
        detailOfMeetingTerminal.minData.value3 = minMaxData.minData;
        detailOfMeetingTerminal.maxData.value3 = minMaxData.maxData;
    }
    return detailOfMeetingTerminal;
    
    
}

function setEchartsLineMaxValue(maxValue){
    let val = 100
    if(maxValue <= 10){
        val = 10;	
    }
    if(maxValue>10 && maxValue<=20){
        val = 20;	
    }
    if(maxValue>20 && maxValue<=50){
        val = 50;	
    }
    if(maxValue>50 && maxValue<=100){
        val = 100;	
    }
    if(maxValue>100){
        val = Math.ceil(maxValue/100)*100;
    }
    val = val == 0 ? 100 : val;

    return val
}

function renderData(dom){
    let { tabName } = getTabName()

    let data = getNoDataEchartsOpt()
    let detailOfMeetingTerminal = decriptionsOfMeeting[tabName];

    if (readyData[tabName] && readyData[tabName].value != null) {//存在缓存数据
        data = readyData[tabName].value
        //begin:<记录下标>记录当前时间轴的开始下标和结束下标
        let endIndex = terminalTemp[tabName].endIndex == null ? data['time'].length - 1 : terminalTemp[tabName].endIndex;
        let startIndex = terminalTemp[tabName].startIndex == null ? data['time'].length - echartsOpt.num : terminalTemp[tabName].startIndex;
        //end:<记录下标>
        
        //begin:<最大值设置>根据当前时间轴（startIndex~endIndex）显示的数据设置描述信息的最大值和最小值，并根据最大值来设置图表中y轴的最大值
        detailOfMeetingTerminal = setConcurrentMeetingDes(detailOfMeetingTerminal, data.values, startIndex, endIndex)
        let maxValue = 0;
        if (detailOfMeetingTerminal.maxData.value3) {
            maxValue = Math.max(detailOfMeetingTerminal.maxData.value1, detailOfMeetingTerminal.maxData.value2, detailOfMeetingTerminal.maxData.value3
            );
        } else {
            maxValue = Math.max(detailOfMeetingTerminal.maxData.value1, detailOfMeetingTerminal.maxData.value2);
        }
        echartsOpt.lineMaxValue = setEchartsLineMaxValue(maxValue);
        //end:<最大值设置>
    }

    echartsOpt.toolTipSeriesName1 = readyData[tabName].toolTipSeriesName1;
    echartsOpt.toolTipSeriesName2 = readyData[tabName].toolTipSeriesName2;
    echartsOpt.toolTipSeriesName3 = readyData[tabName].toolTipSeriesName3 == undefined ? "" : readyData[tabName].toolTipSeriesName3;

    echartRender(data)

    $(".meeting-count-data-description").remove();
    $(dom).append($(TemplateBottom(detailOfMeetingTerminal)).localize())
}


function eventBindChart(dom){
    let $chartDom = $(dom).find('.graph-wrapper')
    $chartDom.find('.minus').on('click',function(e){
        let data = echartsOpt.xData;
        let lineOption = myChart.getOption()

        let length = data.length;
        if (echartsOpt.startIndex > 0 || echartsOpt.endIndex < length - 1) {
            let delta = 1 / length * 100;
            if (echartsOpt.startIndex > 0) {
                echartsOpt.startIndex -= 1;
                lineOption.dataZoom[0].start -= delta;
            }
            if (echartsOpt.endIndex < length - 1) {
                echartsOpt.endIndex += 1;
                lineOption.dataZoom[0].end += delta;
            }
            let yData = echartsOpt.yData;

            let { tabName } = getTabName()
            let detailOfMeetingTerminal = decriptionsOfMeeting[tabName];

            lastStatusTerminalTemp(tabName,echartsOpt,data)

            let maxValue = 100;
            if(tabName == 'concurrentCount'){
                detailOfMeetingTerminal =  setConcurrentMeetingDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2)
            }
            if(tabName == 'concurrentTerminalCount'){
                detailOfMeetingTerminal =  setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2)
            }
            if(tabName == 'terminalCount'){
                detailOfMeetingTerminal =  setTerminalDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2, value3 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2, value3)
            }

            $(".meeting-count-data-description").remove();
            $(dom).append($(TemplateBottom(detailOfMeetingTerminal)).localize())
            
        
            echartsOpt.lineMaxValue = setEchartsLineMaxValue(maxValue);

            lineOption.yAxis[0].max = echartsOpt.lineMaxValue;
            lineOption.yAxis[0].interval = echartsOpt.lineMaxValue / echartsOpt.lineMarkLineNum;
            for(let i = 0;i < echartsOpt.lineMarkLineNum - 1; i++){
                lineOption.series[0].markLine.data[i].yAxis = lineOption.yAxis[0].interval * (i + 1);
            }
            myChart.setOption(lineOption)
        }

        echartBtnVisiable($chartDom, echartsOpt, length - 1);
    })
    $chartDom.find('.plus').on('click',function(e){
        let data = echartsOpt.xData;
        let lineOption = myChart.getOption()

        let length = data.length;
        if(echartsOpt.endIndex > 0
            && echartsOpt.endIndex > echartsOpt.startIndex
            && echartsOpt.endIndex - echartsOpt.startIndex > 2
            ){
            let delta = 1 / length * 100;
            echartsOpt.startIndex += 1;
            lineOption.dataZoom[0].start += delta;
            echartsOpt.endIndex -= 1;
            lineOption.dataZoom[0].end -= delta;
            let yData = echartsOpt.yData;
            
            let { tabName } = getTabName()
            let detailOfMeetingTerminal = decriptionsOfMeeting[tabName];
            lastStatusTerminalTemp(tabName,echartsOpt,data)

            let maxValue = 100;
            if(tabName == 'concurrentCount'){//并发会议统计
                detailOfMeetingTerminal =  setConcurrentMeetingDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2)  
            }
            if(tabName == 'concurrentTerminalCount'){//并发会议在线终端统计
                detailOfMeetingTerminal =  setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2)  
            }
            if(tabName == 'terminalCount'){//终端在线统计
                detailOfMeetingTerminal =  setTerminalDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2, value3 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2, value3)
            }
            
            $(".meeting-count-data-description").remove();
            $(dom).append($(TemplateBottom(detailOfMeetingTerminal)).localize())

            echartsOpt.lineMaxValue = setEchartsLineMaxValue(maxValue);

            lineOption.yAxis[0].max = echartsOpt.lineMaxValue;
            lineOption.yAxis[0].interval = echartsOpt.lineMaxValue / echartsOpt.lineMarkLineNum;
            for(let i = 0; i< echartsOpt.lineMarkLineNum - 1; i++){
                lineOption.series[0].markLine.data[i].yAxis = lineOption.yAxis[0].interval * (i + 1);
            }
            myChart.setOption(lineOption)
        }
        echartBtnVisiable($chartDom, echartsOpt, length - 1);
    })

    $chartDom.find('.leftMove').on('click',function(e){
        let data = echartsOpt.xData;
        let lineOption =  myChart.getOption();
        
        let length = data.length;
        if(echartsOpt.startIndex > 0){
            echartsOpt.startIndex = echartsOpt.startIndex-1;
            echartsOpt.endIndex = echartsOpt.endIndex-1;
            lineOption.dataZoom[0].start = echartsOpt.startIndex / (length - 1) * 100;
            lineOption.dataZoom[0].end = echartsOpt.endIndex / (length - 1) * 100;
            let yData = echartsOpt.yData;

            let { tabName } = getTabName()
            let detailOfMeetingTerminal = decriptionsOfMeeting[tabName];
            lastStatusTerminalTemp(tabName,echartsOpt,data)

            let maxValue = 100;
            if(tabName == 'concurrentCount'){//并发会议统计
                detailOfMeetingTerminal =  setConcurrentMeetingDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2)  
            }
            if(tabName == 'concurrentTerminalCount'){//并发会议在线终端统计
                detailOfMeetingTerminal =  setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2)  
            }
            if(tabName == 'terminalCount'){//终端在线统计
                detailOfMeetingTerminal =  setTerminalDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2, value3 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2, value3)
            }
            
            $(".meeting-count-data-description").remove();
            $(dom).append($(TemplateBottom(detailOfMeetingTerminal)).localize())

            echartsOpt.lineMaxValue = setEchartsLineMaxValue(maxValue);

            lineOption.yAxis[0].max = echartsOpt.lineMaxValue;
            lineOption.yAxis[0].interval = echartsOpt.lineMaxValue / echartsOpt.lineMarkLineNum;
            for(let i = 0; i< echartsOpt.lineMarkLineNum - 1; i++){
                lineOption.series[0].markLine.data[i].yAxis = lineOption.yAxis[0].interval * (i + 1);
            }
            myChart.setOption(lineOption)
        }
        echartBtnVisiable($chartDom, echartsOpt, length - 1);
    })

    $chartDom.find('.rightMove').on('click',function(e){
        let data = echartsOpt.xData;
        let lineOption =  myChart.getOption();
        
        let length = data.length;

        if(echartsOpt.endIndex<length-1){
            echartsOpt.startIndex = echartsOpt.startIndex + 1;
            echartsOpt.endIndex = echartsOpt.endIndex + 1;
            lineOption.dataZoom[0].start = echartsOpt.startIndex/(length-1) * 100;
            lineOption.dataZoom[0].end = echartsOpt.endIndex/(length-1) * 100;
            let yData = echartsOpt.yData;

            let { tabName } = getTabName()
            let detailOfMeetingTerminal = decriptionsOfMeeting[tabName];
            lastStatusTerminalTemp(tabName,echartsOpt,data)

            let maxValue = 100;
            if(tabName == 'concurrentCount'){//并发会议统计
                detailOfMeetingTerminal =  setConcurrentMeetingDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2)  
            }
            if(tabName == 'concurrentTerminalCount'){//并发会议在线终端统计
                detailOfMeetingTerminal =  setConcurrentMeetingTerminalDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2)  
            }
            if(tabName == 'terminalCount'){//终端在线统计
                detailOfMeetingTerminal =  setTerminalDes(detailOfMeetingTerminal, yData, echartsOpt.startIndex, echartsOpt.endIndex);
                let { value1, value2, value3 } = detailOfMeetingTerminal.maxData
                maxValue = Math.max(value1, value2, value3)
            }
            
            $(".meeting-count-data-description").remove();
            $(dom).append($(TemplateBottom(detailOfMeetingTerminal)).localize())

            echartsOpt.lineMaxValue = setEchartsLineMaxValue(maxValue);

            lineOption.yAxis[0].max = echartsOpt.lineMaxValue;
            lineOption.yAxis[0].interval = echartsOpt.lineMaxValue / echartsOpt.lineMarkLineNum;
            for(let i = 0; i< echartsOpt.lineMarkLineNum - 1; i++){
                lineOption.series[0].markLine.data[i].yAxis = lineOption.yAxis[0].interval * (i + 1);
            }
            myChart.setOption(lineOption)
        }
        echartBtnVisiable($chartDom, echartsOpt, length - 1);
    })
}


function eventBindTitle(dom, moid){
    let $containerDom = $(".meeting_count");
    let url = {
        concurrentCount: "/nms/home/?path=history_meeting&type=multi&domainMoid=" + moid,
        concurrentTerminalCount: "/nms/home/?path=terminalstatics&type=meeting&domainMoid=" + moid,
        terminalCount: "/nms/home/?path=terminalstatics&type=online&domainMoid=" + moid
    }
    $containerDom.find('.tab .header-title').on('click',function(){
        if($(this).hasClass('active')) return;
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        let { tabName } = getTabName()
        $containerDom.find('.leftMove').removeClass("hidden");
        $containerDom.find('.rightMove').addClass("hidden");

        renderData(dom)

        $containerDom.find(".header-more a").attr("href",url[tabName]);
    })
}


function lastStatusTerminalTemp(tabName, opt, data){
    terminalTemp[tabName]={
        startIndex:  opt.startIndex,
        endIndex: opt.endIndex,
        startValue: data[opt.startIndex],
        endValue: data[opt.endIndex]
    }
}

function fetchConcurrentCount({ moid, dom }){
    const { BASE_URL } = Store.getState()

    let end_time = Times.formatTime(new Date());
    let start_time = Times.formatTime(new Date(new Date(end_time).getTime() - 30 * 24 * 60 * 60 * 1000));

    return $.get(BASE_URL + "/nms/getMeetingStatistic",{
        moid,
        start_time,
        end_time
    },function(t){
        let { tabName } = getTabName()
        let canRender = tabName === 'concurrentCount';

        if(t.success){
            let data= {
                'time':[],
                'values':[[],[]]
            };
            let statistic = t.data.statistic;

            data.time = statistic.multi.time;
            data.values[0] = statistic.multi.values;
            data.values[1] = statistic.p2p.values;

            let timeLength = data.time.length;
            if (data.values[0][timeLength - 1] == null || data.values[1][timeLength - 1] == null) {
                data.values[0].pop(); //删除最后一个空数据
                data.values[1].pop();
                data.time.pop();
                timeLength--;
            }
            for(let i = 0; i< timeLength; i++){
                //修正中间可能未统计到的数据
                data.values[0][i] = data.values[0][i] || 0;
                data.values[1][i] = data.values[1][i] || 0;

                let timeStr = data.time[i];
                timeStr = timeStr.replace(/\//g,"-");
                data.time[i] = timeStr.slice(5, -3)
            }

            readyData['concurrentCount'].value = data;
        }
        if(canRender){
            renderData(dom)
        }

    },'json').error(function(){

    }).complete(function(){
        fetchState['concurrentCount'].loop()
    })
}

function fetchConcurrentTerminalCount({ moid, dom }){
    const { BASE_URL } = Store.getState()

    let end_time = Times.formatTime(new Date());
    let start_time = Times.formatTime(new Date(new Date(end_time).getTime() - 30 * 24 * 60 * 60 * 1000));

    return $.get(BASE_URL + "/nms/getTerminalStatistic",{
        moid,
        start_time,
        end_time
    },function(t){
        let { tabName } = getTabName()
        let canRender = tabName === 'concurrentTerminalCount';

        if(t.success){
            let data= {
                'time':[],
                'values':[[],[]]
            };
            let statistic = t.data.statistic;

            data.time = statistic.multi.time;
            data.values[0] = statistic.multi.values;
            data.values[1] = statistic.p2p.values;

            let timeLength = data.time.length;
            if (data.values[0][timeLength - 1] == null || data.values[1][timeLength - 1] == null) {
                data.values[0].pop(); //删除最后一个空数据
                data.values[1].pop();
                data.time.pop();
                timeLength--;
            }
            for(let i = 0; i < timeLength; i++){
                //修正中间可能未统计到的数据
                data.values[0][i] = data.values[0][i] || 0;
                data.values[1][i] = data.values[1][i] || 0;

                let timeStr = data.time[i];
                timeStr = timeStr.replace(/\//g,"-");
                data.time[i] = timeStr.slice(5,-3)
            }

            readyData['concurrentTerminalCount'].value = data;
        }
        if(canRender){
            renderData(dom)
        }
        
    },'json').error(function(){
       
    }).complete(function(){
        fetchState['concurrentTerminalCount'].loop()
    })
}

function fetchTerminalCount({ moid, dom }){
    const { BASE_URL } = Store.getState()

    let end_time = Times.formatTime(new Date());
    let start_time = Times.formatTime(new Date(new Date(end_time).getTime() - 30 * 24 * 60 * 60 * 1000));

    return $.get(BASE_URL +"/nms/getOnlineStatistic",{
        moid,
        start_time,
        end_time
    },function(t){
        let { tabName } = getTabName()
        let canRender = tabName === 'terminalCount';

        if(t.success){
            let data= {
                'time':[],
                'values':[[],[]]
            };
            let statistic = t.data.statistic;

            data.time = statistic.sip.time;
            data.values[0] = statistic.sip.values;
            data.values[1] = statistic.h323.values;
            data.values[2] = statistic.all.values;

            let timeLength = data.time.length;
            if (data.values[0][timeLength - 1] == null || data.values[1][timeLength - 1] == null || data.values[2][timeLength - 1] == null) {
                data.values[0].pop(); //删除最后一个空数据
                data.values[1].pop();
                data.values[2].pop();
                data.time.pop();
                timeLength--;
            }
            for(let i = 0; i< timeLength; i++){
                //修正中间可能未统计到的数据
                data.values[0][i] = data.values[0][i] || 0;
                data.values[1][i] = data.values[1][i] || 0;
                data.values[2][i] = data.values[2][i] || 0;

                let timeStr = data.time[i];
                timeStr = timeStr.replace(/\//g,"-");
                data.time[i] = timeStr.slice(5,-3)
            }

            readyData['terminalCount'].value = data;

        }

        if(canRender){
            renderData(dom)
        }
        
    },'json').error(function(){
        
    }).complete(function(){
        fetchState['terminalCount'].loop()
    })
}


const output = {
    render(dom, { user }){
        const moid = user.serviceDomainAdmin ? user.serviceDomainMoid : ( user.userDomainAdmin ? user.userDomainMoid : user.moid);

        this.renderHeader(`${dom}-header`, user, moid)
        this.renderContent(dom, moid)
    },
    renderHeader(dom, { enableNM } , moid) {
        const data = {
            head_titles:["并发会议统计","并发会议在线终端统计","在线终端统计"],
            head_more:(() => {
                let moreList = [
                    { more:"更多", url:`/nms/home/?path=history_meeting&type=multi&domainMoid=${moid}`}
                ]
                //没有网管权限不显示更多
                if (!enableNM) {
                    moreList = moreList.filter(x => x !== '更多')
                }
                return moreList
            })(),
        }

        $(dom).empty().append($(TemplateHeader(data)).localize())
        eventBindTitle(dom, moid)
    },  
    renderContent(dom, moid) {
        $(dom).empty()
            .append($(TemplateChart({})).localize())
            .append($(TemplateBottom(decriptionsOfMeeting['concurrentCount'])).localize())
        //初始显示无数据
        echartRender(getNoDataEchartsOpt());
        eventBindChart(dom)

        fetchState['concurrentCount'].cache({ moid, dom }).start(({ moid, dom }) => fetchConcurrentCount({ moid, dom }))
        fetchState['concurrentTerminalCount'].cache({ moid, dom }).start(({ moid, dom }) => fetchConcurrentTerminalCount({ moid, dom }))
        fetchState['terminalCount'].cache({ moid, dom }).start(({ moid, dom }) => fetchTerminalCount({ moid, dom }))
      
    },
    startfetch(tab){
        fetchState['concurrentCount'].start();
        fetchState['concurrentTerminalCount'].start();
        fetchState['terminalCount'].start();
    },
    stopfetch(){
        fetchState['concurrentCount'].stop();
        fetchState['concurrentTerminalCount'].stop();
        fetchState['terminalCount'].stop();
    }
}

export default output
