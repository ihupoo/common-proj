import Store from '@/store';
import { Times } from '@/utils/utils';
import TemplateIndex from './index.art';
import echarts from 'echarts'
import { echartOption, percentCount } from '@/pages/home/js/draw';
import { fetchPersonal } from './personalServer';


let fetchState = {
    cache: null,
    ajaxId: null,
    poll : true
}

let echartDom = null;

let echartsOpt = {
    title:'服务器1',
    xName:'时间',
    xData:'',
    yName:'%',
    seriesName:'占用比',
    yData:'',
    color:['#5eb9ef'],
    areaColor:'rgba(94, 185, 239, 0.2)',
    animationAttr: false,
    num:15,
    start:0,
    end:0,
    startIndex:0,
    endIndex:0
}

let resourceTemp = {//记录当前用户观看平台域资源详情的开始和结束时间位置
    platCup:{//平台cpu资源
        startIndex:null,
        endIndex:null,
        startValue:null,
        endValue:null
    },
    platMemory:{//平台内存资源
        startIndex:null,
        endIndex:null,
        startValue:null,
        endValue:null
    }
}

let readyData = {
    cpu: {
        name:"cpu",
        currentMoidListIndex:0,
        personalMoidList: null,//cpu的自定义服务器moid列表
        personalServerList:[],//自定义服务器列表
        serverList: [],//cpu的服务器列表-----定时更新
        value: {},//cpu的图表数据----定时更新
    }, 
    memory: {
        name:"memory",
        currentMoidListIndex:0,
        personalMoidList: null,//memory的自定义服务器moid
        personalServerList:[],
        serverList: [],//memory的服务器列表-----定时更新
        value: {},//memory的图表数据-----定时更新

    }
}


function echartRender(data){
    let platformResourceTerminalName = $(".platform_resource .active .title").text();
    let cur = {};
    if(platformResourceTerminalName == '平台CPU资源'){//平台cpu资源
        cur = resourceTemp.platCpu;
    }
    if(platformResourceTerminalName == '平台内存资源'){//平台内存资源
        cur = resourceTemp.platMemory;
    }
    if(cur.startIndex != null){
        let startIndex = data.time.lastIndexOf(cur.startValue);
        let endIndex = data.time.lastIndexOf(cur.endValue);
        if(startIndex == -1){
            echartsOpt.startIndex = data.time.length - echartsOpt.num;
        }else {
            echartsOpt.startIndex = startIndex;
        }
        if(endIndex == -1){
            echartsOpt.endIndex = data.time.length - 1;
        }else {
            echartsOpt.endIndex = endIndex
        }
    }else{
        echartsOpt.startIndex = data.time.length - echartsOpt.num;
        echartsOpt.endIndex = data.time.length-1;
    }
    echartsOpt.start = echartsOpt.startIndex / (data.time.length - 1) * 100;
    echartsOpt.end = echartsOpt.endIndex / (data.time.length - 1) * 100;

    echartsOpt.title = data.name;
    echartsOpt.xData = data.time;
    echartsOpt.yData = data.values;

    let platformResourceChart = echarts.init(document.getElementById("platform_resource-graph"),"");
    
    let platformResourceOption = echartOption.getStakedAreaLineOption(echartsOpt);
    platformResourceChart.clear();
    platformResourceChart.setOption(platformResourceOption, true);

    return platformResourceChart
}

//服务器详情显示空数据
function getNoDataEchartsOpt() {
    let data = {
        'name': '',
        'time': [],
        'values': [],
    };
    let date = new Date();
    let time = date.getTime();
    for (let i = 0; i < 15; i = i + 1) {
        let time = time - Times.tenSeconds;
        let newDate = new Date(time);
        let strTime = (newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours()) + ":" + (newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes()) + ":" + (newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds());
        data.time.unshift(strTime)
    }
    return data
}

//默认无数据情况
function renderNoData(dom, personal = ''){
    $(dom).find(".wheel-btn").remove();
    $(dom).find(".item-resource-wrapper").removeClass("active");
    $(dom).find(".resource-wrapper").addClass("none-visible");

    //勾选了显示自定义服务器，但是实际没设置自定义服务器
    let warningText = personal === 'personal' ? '尚未自定义所需显示的服务器，请先设置。' : '暂无服务器信息'
    $(dom).siblings('.no-data-wrapper').removeClass('hidden').find('.warm-text').text(warningText);
    echartDom = echartRender(getNoDataEchartsOpt());
}


function eventBind(){
   
}

/** 
 *  请求
  */
function fetchLoad() {
    const { BASE_URL } = Store.getState()

}

function fetchServer({ tab, user: {} }, render = true){
    const { BASE_URL } = Store.getState()

    if(tab === 'cpu'){
        url = BASE_URL + "/nms/getCpuPhysical";
    }else{
        url = BASE_URL + "/nms/getMemPhysical";
    }

    const isPersonal = !$(".isPersonalSetting").hasClass("no-checked")

    let moidList = "";
    if(isPersonal){
        let currentMoidListIndex = readyData[tab].currentMoidListIndex
        moidList = readyData[tab].personalMoidList == null ? "" : readyData[tab].personalMoidList[currentMoidListIndex]
    }

    let requestGet = $.get(url, {
        moid: moid,
        num: 5,
        moidList
    }, function (t) {
        if (t.success) {
            let physicals = t.data.physicals;

            let tmpData = []
            for (let i = 0; i < physicals.length; i++) {
                let dataItem = {name: '', moid: '', percent: '', ip: ''};
                dataItem.name = physicals[i].name;
                dataItem.moid = physicals[i].moid;
                dataItem.percent = physicals[i][readyData[index].name];
                dataItem.ip = physicals[i].ip;
                dataItem.machineRoomName = physicals[i].machine_room_name;
                dataItem.type = physicals[i].type;
                dataItem.frameName = physicals[i].frame_name;

                tmpData.push(dataItem)
            }

            if(isPersonal && moidList!=""){
                readyData[index].personalServerList[currentMoidListIndex] = tmpData;
            }else if(!isPersonal){
                readyData[index].serverList = tmpData;
            }else if(isPersonal && moidList==""){
                readyData[index].personalServerList = [];
            }
            let currentResourceMoid = "";
            if(render){//服务器列表渲染
                that.drawResourceServerFun(index);

                if(moidList!=""){
                    readyData[index].currentMoidListIndex +=  + 1;
                    readyData[index].currentMoidListIndex = readyData[index].currentMoidListIndex % platformResourcePersonalFunctions.moidList.length;
                }
                currentResourceMoid = $(".resourceMoid", $(".item-resource-wrapper.active", $(".resource-wrapper", "#platform_resource"))).text();
            }else{
                currentResourceMoid = tmpData.length>0?tmpData[0].moid:"";
            }

            that.storePlatformResourceInfo(index,currentResourceMoid)
        }else{
            readyData[index].personalServerList = [];
            readyData[index].serverList = [];
            if(index==currentTab){
                that.drawResourceServerFun(index);
            }
        }
    }, 'json').error(function () {

    });
}


export default {
    async render(dom, { user,  }){
        //初始显示无数据
        renderNoData(dom)
        
        const moidList = await fetchPersonal()
        
        readyData['cpu'].currentMoidListIndex = 0;
        readyData['cpu'].personalMoidList = moidList;
        readyData['memory'].currentMoidListIndex = 0;
        readyData['memory'].personalMoidList = moidList;


        storePanelData();
      
    },
    startfetch(){

    },
    stopfetch(){

    }
}
