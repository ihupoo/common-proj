let graphOption = {
    platformResourceOption:{
        title:'服务器1',
        xName:'时间',
        xData:'',
        yName:'%',
        seriesName:'占用比',
        yData:'',
        color:['#5eb9ef'],
        areaColor:'rgba(94, 185, 239, 0.2)',
        animationAttr:false,
        num:15,
        start:0,
        end:0,
        startIndex:0,
        endIndex:0
    },
    meetingTerminalCountOption:{
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
    },
    bookMeetingOption:{
        xName:'时间',
        xData:'',
        yName:'数量（预约会议个数）',
        yData:'',
        animationAttr:false,
        num:24,
    },
}
let echartOption = {
    lineOption:'',
    barOption:'',
    lineMarkLineNum:5,
    lineMaxValue:100,
    barMaxValue:50,
    barMarkLineNum:5,
    getPieOption:function(opt){
        return {
            series : [
                {
                    type:'pie',
                    radius : [22, 30],
                    avoidLabelOverlap:false,
                    /*animation:opt.animationAttr,*/
                    animation:opt.animationAttr,
                    label: {
                        normal: {
                            show: true,
                            position:'center',
                            textStyle:{
                                color:'#4e4e4e',
                                fontSize:'12'
                            }
                        }
                    },
                    data: opt.data ,
                    cursor:"default",
                    silent:true
                }
            ],
            color:opt.color
        };
    },
    getStakedAreaLineOption:function(opt){
        return {
            color:opt.color,
            tooltip : {
                show:false
            },
            grid: {
                x:73,
                y:70,
                x2:70,
                y2:126
            },
            xAxis : [
                {
                    nameTextStyle:{
                        color:'#000000'
                    },
                    type : 'category',
                    splitNumber:8,
                    boundaryGap : false,
                    data :opt.xData,
                    axisLine:{
                        symbol:['none'],
                        symbolSize:[5,10],
                        lineStyle:{
                            color:'#999999'
                        }
                    },
                    axisTick: {
                        show: true,
                        inside:true,
                        length:4
                    },
                    axisLabel:{
                        rotate:90,
                        color:'#000000',
                        margin:12

                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            type:'dotted',
                            color:['#d0d0d0']
                        }

                    }
                }
            ],
            yAxis : [
                {
                    name:'%',
                    min:0,
                    max:100,
                    splitNumber:2,
                    nameTextStyle:{
                        color:'#b6b6b6'
                    },
                    nameGap:18,
                    type : 'value',
                    axisLine:{
                        show:false,
                        symbol:['none'],
                        symbolSize:[5,10],
                        lineStyle:{
                            color:'#999999'
                        }
                    },
                    axisTick:{
                        show:false,
                    },
                    axisLabel:{
                        margin:29,
                        color:'#b6b6b6'

                    },
                    splitLine:{
                        show:false,
                        lineStyle:{
                            type:'solid',
                            color:['#d0d0d0']
                        }

                    }
                }
            ],
            dataZoom: [{
                height:0,
                width:0,
                start:opt.start,
                end:opt.end,
                type: 'slider',
                backgroundColor:'rgba(0,0,0,0)',
                dataBackgroundColor:'#FFFFFF',
                fillerColor:'rgba(0,0,0,0)',
                handleColor:'rgba(0,0,0,0)',
            }],
            animation:opt.animationAttr,
            series : [
                {
                    name:opt.seriesName,
                    type:'line',
                    stack: '总量',
                    areaStyle: {normal: {
                            color: opt.areaColor
                        }},//面积图
                    data:opt.yData,
                    symbol:'none',
                    symbolSize:0,
                    markLine: {
                        silent: true,
                        symbol:['',''],
                        label:{
                            show:false
                        },
                        lineStyle:{
                            width:1,
                            type:'solid',
                            color:['#d0d0d0'],
                        },
                        data: [{
                            yAxis: 50
                        }]
                    }
                }
            ]
        };
    },

    getDotLineOption:function(opt){
        this.lineOption = {
            color:opt.color,
            tooltip: {
                show:false
            },
            grid: {
                top:50,
                width:427,
                height:253,
                x:70,
            },
            animation:opt.animationAttr,
            xAxis : [
                {
                    nameTextStyle:{
                        color:'#000000'
                    },
                    type : 'category',
                    boundaryGap : false,
                    data :opt.xData,
                    axisLine:{
                        lineStyle:{
                            color:'#999999'
                        }
                    },
                    axisTick: {
                        inside:true,
                        length:4

                    },
                    axisLabel:{
                        rotate:90,
                        margin:12,
                        color:'#000000'

                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            type:'dotted',
                            color:['#d0d0d0']
                        }

                    }
                }
            ],
            yAxis : [
                {
                    name:opt.yName,
                    splitNumber:5,
                    interval:20,
                    nameTextStyle:{
                        color:'#b6b6b6'
                    },
                    type : 'value',
                    axisLine:{
                        show:false,
                        lineStyle:{
                            color:'#999999'
                        }

                    },
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        show:false
                    },
                    axisLabel:{
                        margin:27,
                        color:'#b6b6b6'

                    },
                    min:0,
                    max:100
                }
            ],
            dataZoom: [{
                height:0,
                width:0,
                type: 'slider',
                start:opt.start,
                end:opt.end,
                minValueSpan:opt.num,
                backgroundColor:'rgba(0,0,0,0)',
                dataBackgroundColor:'#FFFFFF',
                fillerColor:'rgba(0,0,0,0)',
                handleColor:'rgba(0,0,0,0)',
            }],
            series : [
                {
                    name:opt.seriesName1,
                    type:'line',
                    stack: '总量1',
                    data:opt.yData[0],
                    symbol:'circle',
                    symbolSize:6,
                    animation:opt.animationAttr,
                    tooltip:{
                        show:true,
                        formatter: opt.toolTipSeriesName1+':{c}<br />日期时间:{b}',
                        textStyle:{
                            fontSize:12
                        }
                    },
                    markLine: {
                        silent: true,
                        symbol:['',''],
                        label:{
                            show:false
                        },
                        lineStyle:{
                            width:1,
                            type:'solid',
                            color:['#d0d0d0'],
                        },
                        data: [
                            {
                                yAxis: 20
                            },{
                                yAxis: 40
                            },{
                                yAxis: 60
                            },{
                                yAxis: 80
                            }
                        ]
                    },
                },
                {
                    name:opt.seriesName2,
                    type:'line',
                    stack: '总量2',
                    data:opt.yData[1],
                    symbol:'circle',
                    symbolSize:6,
                    animation:opt.animationAttr,
                    tooltip:{
                        show:true,
                        formatter: opt.toolTipSeriesName2+':{c}<br />日期时间:{b}',
                        textStyle:{
                            fontSize:12
                        }
                    }
                },
                {
                    name:opt.seriesName3,
                    type:'line',
                    stack: '总量3',
                    data:opt.yData[2],
                    symbol:'circle',
                    symbolSize:6,
                    animation:opt.animationAttr,
                    tooltip:{
                        show:true,
                        formatter: opt.toolTipSeriesName2+':{c}<br />日期时间:{b}',
                        textStyle:{
                            fontSize:12
                        }
                    }
                }

            ]
        };
    },
    getBarOption:function(opt) {//预约会议并发统计的绘图
        this.barOption = {
            color: ['#5eb9ef'],
            tooltip : {
                show:true,
                // show:false,
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:38,
                x2:68,
                width:447,
                height:255
            },
            animation:opt.animationAttr,
            xAxis : [
                {
                    name:opt.xName,
                    nameTextStyle:{
                        color:'#000000',
                        padding:[0,0,0,-7]
                    },
                    boundaryGap:true,
                    type : 'category',
                    scale:true,
                    data :opt.xData,
                    axisLine:{
                        lineStyle:{
                            color:'#999999'
                        }
                    },
                    axisTick: {
                        show: false,
                        length:4,
                        inside:true
                    },
                    axisLabel:{
                        margin:12,
                        rotate:90,
                        color:'#000000'

                    },
                    splitLine:{
                        show:false,
                        lineStyle:{
                            type:'dotted',
                            color:['#dedede','#dddddd']
                        }

                    }
                }
            ],
            yAxis : [
                {
                    name:opt.yName,
                    nameGap:15,
                    min:0,
                    max:50,
                    interval:10,
                    nameTextStyle:{
                        color:'#b6b6b6',
                        padding:[0,0,0,65]
                    },
                    type : 'value',
                    axisLine:{
                        show:false,
                        lineStyle:{
                            color:'#999999'
                        }

                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        margin:7,
                        color:'#b6b6b6'

                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            type:'solid',
                            color:['#d0d0d0']
                        }

                    }
                }
            ],
            series : [
                {
                    name:'预约会议统计数',
                    type:'bar',
                    barWidth: 10,
                    barGap:9,
                    animation:false,
                    data:opt.yData,
                    markLine: {
                        silent: true,
                        symbol:['',''],
                        label:{
                            show:false
                        },
                        lineStyle:{
                            width:1,
                            type:'solid',
                            color:['#d0d0d0'],
                        },
                        data: [
                            {
                                yAxis: 10
                            },{
                                yAxis: 20
                            },{
                                yAxis: 30
                            },{
                                yAxis: 40
                            }
                        ]
                    },
                }
            ]
        };
    }
}

let drawGraph = {
    platformResourceChart:'',
    meetingTerminalCountChart:'',
    bookMeetingChart:'',
    drawMeetingTerminalGraph:function(data){
        var option = graphOption.meetingTerminalCountOption;
        var meetingTerminalName = $(".title",$(".active",".meeting_count")).text();
        var meeting_count=panelData.meeting_count.head_titles;
        var currntTab={};
        if(meetingTerminalName==meeting_count[0]){//并发会议统计
            currntTab=controller.terminalTemp.bfMeeting;
        }
        if(meetingTerminalName==meeting_count[1]){//并发会议在线终端统计
            currntTab=controller.terminalTemp.bfOnlineMeeting;
        }
        if(meetingTerminalName==meeting_count[2]){//终端在线统计
            currntTab=controller.terminalTemp.zdOnline;
        }
        if(currntTab.startIndex != null) {
            var startIndex = data.time.lastIndexOf(currntTab.startValue);
            var endIndex = data.time.lastIndexOf(currntTab.endValue);
            if(startIndex==-1){
                option.startIndex = data.time.length-1-option.num+1;
            }else {
                option.startIndex = startIndex;
            }
            if(endIndex == -1) {
                option.endIndex = data.time.length - 1;
            }else {
                option.endIndex = endIndex;
            }
        }else {
            option.startIndex = data.time.length-1-option.num+1;
            option.endIndex = data.time.length-1;
        }
        option.start = option.startIndex/(data.time.length-1)*100;
        option.end = option.endIndex/(data.time.length-1)*100;


        // console.log("drawgraph-----endIndex",option.endIndex,"startIndex",option.startIndex)

        option.xData = data.time;
        option.yData = data.values;
        //begin:Edge浏览器----解决“终端在线统计”刷新一段时间红色线条和其他线条互换颜色
        $("#meeting_count-graph").empty()
        $("#meeting_count-graph").removeAttr("style");
        $("#meeting_count-graph").removeAttr("_echarts_instance_");
        //end:Edge浏览器----解决“终端在线统计”刷新一段时间红色线条和其他线条互换颜色

        this.meetingTerminalCountChart = echarts.init(document.getElementById("meeting_count-graph"),"");
        echartOption.getDotLineOption(option);
        
        var meetingTerminalCountOption = echartOption.lineOption


        //begin:Edge浏览器----解决“并发会议统计、并发会议在线终端统计”刷新一段时间，蓝色线条变成红色线条
        meetingTerminalCountOption.color = option.yData.length==3?option.color:option.color.slice(0,2)
        //end:Edge浏览器----解决“并发会议统计、并发会议在线终端统计”刷新一段时间，蓝色线条变成红色线条

        meetingTerminalCountOption.yAxis[0].max = echartOption.lineMaxValue;
        meetingTerminalCountOption.yAxis[0].interval = echartOption.lineMaxValue/echartOption.lineMarkLineNum
        meetingTerminalCountOption.series[0].markLine.data[0].yAxis = 0;
        
        for(var i = 0;i<echartOption.lineMarkLineNum-1;i++){
        	meetingTerminalCountOption.series[0].markLine.data[i].yAxis = meetingTerminalCountOption.yAxis[0].interval*(i+1);
        }
        
        this.meetingTerminalCountChart.clear();
        this.meetingTerminalCountChart.setOption(meetingTerminalCountOption,true);
    },
    drawBookMeetingGraph:function (data) {
        var option = graphOption.bookMeetingOption;
        option.xData = data.time;
        option.yData = data.values;
        this.bookMeetingChart = echarts.init(document.getElementById("book_meeting_count-graph"),"")
        echartOption.getBarOption(option);
        
        var bookMeetingCountOption = echartOption.barOption;
        bookMeetingCountOption.yAxis[0].max = echartOption.barMaxValue;
        bookMeetingCountOption.yAxis[0].interval = echartOption.barMaxValue/echartOption.barMarkLineNum;
        bookMeetingCountOption.series[0].markLine.data[0].yAxis = 0;
        
        for(var i = 0;i<echartOption.barMarkLineNum-1;i++){
        	bookMeetingCountOption.series[0].markLine.data[i].yAxis = bookMeetingCountOption.yAxis[0].interval*(i+1);
        }
        
        var barOption = echartOption.barOption;
        barOption.grid.height = 200;
        this.bookMeetingChart.setOption(barOption);
    }
}


//绘图用
function percentCount(used, total){
    let percent = total == 0 ? 0 : used/total;
    percent = Math.round(percent * 100);
    if(percent === 0 && used > 0) return 1;
    if(percent === 100 && used < total) return 99;
    return percent;
}

export {
    graphOption,
    echartOption,
    drawGraph,
    percentCount
}
