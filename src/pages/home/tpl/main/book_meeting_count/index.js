import Store from '@/store';
import echarts from 'echarts';
import { Times } from '@/utils/utils';
import { getMinMaxValue, getAverageValue, fetchLoop } from '../../utils';
import TemplateIndex from './index.art';
import TemplateHeader from './header.art';
import { echartOption } from '@/pages/home/tpl/draw';


let fetchState = new fetchLoop();

let myChart = null;

let echartsOpt = {
    xName:'时间',
    xData:'',
    yName:'数量（预约会议个数）',
    yData:'',
    animationAttr:false,
    num:24,

    barMaxValue: 50,
    barMarkLineNum: 5
}

function getNoDataEchartsOpt() {
    let data= {//渲染空数据
        'time':[],
        'values':[]
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
    echartsOpt.xData = data.time;
    echartsOpt.yData = data.values;
    myChart = echarts.init(document.getElementById("book_meeting_count-graph"),"")
    
    let opts = echartOption.getBarOption(echartsOpt);
    opts.yAxis[0].max = echartsOpt.barMaxValue;
    opts.yAxis[0].interval = echartsOpt.barMaxValue / echartsOpt.barMarkLineNum;
    opts.series[0].markLine.data[0].yAxis = 0;
    
    for(let i = 0;i< echartsOpt.barMarkLineNum - 1; i++){
        opts.series[0].markLine.data[i].yAxis = opts.yAxis[0].interval * (i + 1);
    }
    myChart.clear();
    myChart.setOption(opts, true);
}

function setEchartsBarMaxValue(maxValue){
    let val = 50;
    if(maxValue<=50){
        val = 50;	
    }
    if(maxValue>50 && maxValue<=100){
        val = 100;	
    }
    if(maxValue>100){
        val = Math.ceil(maxValue/100)*100;
    }
    val = val == 0 ? 50 : val;
    return val
}

function fetchLoad(moid, dom){//ajax从后端获取预约会议
    const { BASE_URL } = Store.getState()

    let start_time = Times.formatTime(new Date());
    let end_time = Times.formatTime(new Date(new Date(start_time).getTime() + Times.oneDay));

    return $.get(BASE_URL + "/nms/getAppointmentHistory",{
        moid,
        start_time,
        end_time
    },function(t){
        if(t.success){
            let data = t.data.statistic;
            for(let i = 0; i < data['time'].length; i++){
                data['time'][i] = data['time'][i].replace(new RegExp( '/' , "g" ),"-");
                data['time'][i] = data['time'][i].slice(5,-3)
            }
            
            let testData = data.values.filter(x => x > 0);

            let minMax = getMinMaxValue(testData)//minData  maxData
            let average = getAverageValue(testData)

            $(dom).find('.maxValue').text(minMax.maxData)
            $(dom).find('.minValue').text(minMax.minData)
            $(dom).find('.averageValue').text(average)

            echartsOpt.barMaxValue = setEchartsBarMaxValue(data.max);
            echartRender(data);
        }else{
            $(dom).find('.maxValue').text(0)
            $(dom).find('.minValue').text(0)
            $(dom).find('.averageValue').text(0)

            echartRender(getNoDataEchartsOpt());
        }
       
    },'json').error(function(){
       
    }).complete(function() {
        fetchState.loop()
    });
}

export default {
    render(dom, { user }){
        const moid = user.serviceDomainAdmin ? user.serviceDomainMoid : ( user.userDomainAdmin ? user.userDomainMoid : user.moid);

        this.renderHeader(`${dom}-header`)
        this.renderContent(dom, moid)
        
    },
    renderHeader(dom ) {
        const data = {
            head_titles:["预约会议并发统计"],
            head_more:[],
        }

        $(dom).empty().append($(TemplateHeader(data)).localize())
    },  
    renderContent(dom, moid) {
        $(dom).empty().append($(TemplateIndex({})).localize());
        //初始显示无数据
        echartRender(getNoDataEchartsOpt());
        
        fetchState.cache({ moid, dom }).start(({ moid, dom }) => fetchLoad(moid, dom))
    },
    startfetch(){
        fetchState.start()
    },
    stopfetch(){
        fetchState.stop()
    }
}
