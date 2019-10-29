import Store from '@/store';
import { Times } from '@/utils/utils';
import TemplateHeader from './header.art';
import TemplateChart from './chart.art';
import TemplateFooter from './footer.art';
import TemplateWheelBtn from './wheelBtn.art';
import echarts from 'echarts'
import { echartOption, percentCount } from '@/pages/home/js/draw';
import { fetchPersonal } from './personalServer';


let fetchState = {
    cache: null,
    ajaxServerId:  {
        cpu: null,
        memory: null
    },
    ajaxInfoId:  {
        cpu: null,
        memory: null
    },
    poll : {
        cpu: true,
        memory: true
    }
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
    cpu:{//平台cpu资源
        startIndex:null,
        endIndex:null,
        startValue:null,
        endValue:null
    },
    memory:{//平台内存资源
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
        personalMoidList: [],//cpu的自定义服务器moid列表
        personalServerList:[],//自定义服务器列表
        serverList: [],//cpu的服务器列表-----定时更新
        value: {},//cpu的图表数据----定时更新
    }, 
    memory: {
        name:"memory",
        currentMoidListIndex:0,
        personalMoidList: [],//memory的自定义服务器moid
        personalServerList:[],
        serverList: [],//memory的服务器列表-----定时更新
        value: {},//memory的图表数据-----定时更新

    }
}


function echartRender(data){
    let platformResourceTerminalName = $(".platform_resource .active .title").text();
    let cur = {};
    if(platformResourceTerminalName == '平台CPU资源'){//平台cpu资源
        cur = resourceTemp.cpu;
    }
    if(platformResourceTerminalName == '平台内存资源'){//平台内存资源
        cur = resourceTemp.memory;
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
function renderNoDataServer(dom, personal = ''){
    $(dom).find(".wheel-btn").remove();
    $(dom).find(".item-resource-wrapper").removeClass("active");
    $(dom).find(".resource-wrapper").addClass("none-visible");

    //勾选了显示自定义服务器，但是实际没设置自定义服务器
    let warningText = personal === 'personal' ? '尚未自定义所需显示的服务器，请先设置。' : '暂无服务器信息'
    $(dom).siblings('.no-data-wrapper').removeClass('hidden').find('.warm-text').text(warningText);
}


function renderServer(tab, dom){
    const personal = !$(".isPersonalSetting").hasClass("no-checked")
    if (readyData[tab].personalServerList.length === 0 && personal) {//勾选了显示自定义服务器，但是实际没设置自定义服务器
        renderNoDataServer(dom, 'personal')
    } else {
        if (readyData[tab].serverList.length == 0 && !personal) {//默认无数据情况
            renderNoDataServer(dom, 'normal')

        } else {//有数据情况----显示自定义服务器数据/默认前五服务器
            /**begin:intTemplate---初始化有数据情况下的平台资源模板*/
            let resourceData = personal 
                ? readyData[tab].personalServerList[readyData[tab].currentMoidListIndex]
                : readyData[tab].serverList;

            let containerWidth = resourceData.length * 107;

            $(dom).find('.resource-wrapper').remove().end()
                .prepend($(TemplateHeader({ resourceData, containerWidth })).localize())

            /**end:intTemplate*/

            let currentResourceMoid = readyData[tab].serverList[0]//需要显示的服务器列表
            currentResourceMoid = $(dom).find('.resource-wrapper .item-resource-wrapper.active .resourceMoid').text() || currentResourceMoid;

            $(dom).find(".item-resource-wrapper").removeClass("active")
            $("#" + currentResourceMoid).parent().parent().addClass("active")

            $(dom).find(".no-data").addClass("hidden");

            if (personal) {//设置的是【显示自定义服务器】，当数量超过五个的时候需要轮显
                if (readyData[tab].personalMoidList.length > 1) {
                    if ( $(dom).find(".wheel-btn").length === 0) {
                        $(dom).prepend($(TemplateWheelBtn({
                            data: readyData[tab].personalMoidList,
                            activeIndex: readyData[tab].currentMoidListIndex
                        })).localize());
                    } else {
                        $(dom).find(".wheel-btn span").removeClass("active");
                        $(dom).find(".wheel-btn .wheel-btn-" + readyData[tab].currentMoidListIndex).addClass("active");
                    }
                }

            }
            eventBindServer(dom)
        }
    }
}

function renderServerInfo(tab, dom){
    /**being:显示服务器机框、机房、ip等详情**/
    $activeDom = $(dom).find('.item-resource-wrapper.active .foot-title')
    let resourceDetail = {
        name: $activeDom.find('.foot-title-name').text(),
        ip: $activeDom.find('.ip').text(),
        machineRoomName: $activeDom.find('.machineRoomName').text(),
        type: $activeDom.find('.type').text(),
        frameName: $activeDom.find('.frameName').text()
    }
    $(dom).find(".platform-resource-detail").remove();
    $(dom).append($(TemplateFooter(resourceDetail)).localize())

    /**end*/

    $activeWrapper = $(dom).find('.resource-wrapper .item-resource-wrapper.active')
    let value = $activeWrapper.find(".value").text() || 0;
    $(".platform_resource_graph_value").text(value + "%")
    let currentResourceMoid = $activeWrapper.find('.resourceMoid').text()
    if (readyData[tab].value != null && readyData[tab].value[currentResourceMoid] != undefined) {
        echartDom = echartRender(readyData[tab].value[currentResourceMoid]);
    }
}


function eventBindServer(dom){
    $(dom).find(".item-resource-wrapper").off().on("click",function(){//鼠标点击平台资源，资源名称呈现蓝色
        //暂停自动刷新
        output.stopfetch()

        $(".item-resource-wrapper",$(this).parent().parent()).removeClass("active");
        $(this).addClass("active")

        let platformResourceTerminalName = $(".platform_resource .active .title").text();
        let tabName = '', otherName = '';
        if(platformResourceTerminalName == '平台CPU资源'){//平台cpu资源
            tabName = 'cpu';
            otherName = 'memory';
        }
        if(platformResourceTerminalName == '平台内存资源'){//平台内存资源
            tabName = 'memory';
            otherName = 'cpu';
        }
        //不记忆上次操作的值
        resourceTemp[tabName]={
            startIndex:null,
            endIndex:null,
            startValue:null,
            endValue:null
        }
        //启动自动刷新
        //与后端交互，查询平台资源信息，并绘制线图
        const { moid } = fetchState.cache;
        fetchState.poll[tabName] = true;
        fetchState.ajaxInfoId[tabName] = fetchServerInfo({ tab: tabName, moid, dom },$(".resourceMoid",$(this)).text(), true);
        fetchState.poll[otherName] = true;
        fetchState.ajaxInfoId[otherName] = fetchServerInfo({ tab: otherName, moid, dom },$(".resourceMoid",$(this)).text(), false);
    });
    $(".wheel-btn span").off().on("click",function(){
        //暂停自动刷新
        output.stopfetch()
        //判断是第几页
        let currentMoidListIndex = Number($(this).attr("currentMoidListIndex"))
        //判断是哪个tab页面
        readyData['cpu'].currentMoidListIndex = currentMoidListIndex;
        readyData['memory'].currentMoidListIndex = currentMoidListIndex;

        let platformResourceTerminalName = $(".platform_resource .active .title").text();
        let tabName = '';
        if(platformResourceTerminalName == '平台CPU资源'){//平台cpu资源
            tabName = 'cpu';
        }
        if(platformResourceTerminalName == '平台内存资源'){//平台内存资源
            tabName = 'memory';
        }
        //启动自动刷新
        output.startfetch(tabName)
    });
}

function eventBindChart(){
    
}

/** 
 *  请求
  */
function fetchServer({ tab, moid, dom }, render = true){
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
        moidList = readyData[tab].personalMoidList[currentMoidListIndex] || ''
    }
    
    return $.get(url, {
        moid: moid,
        num: 5,
        moidList
    }, function (t) {
        if (t.success) {
            let physicals = t.data.physicals;

            let tmpData = []
            for (let i = 0; i < physicals.length; i++) {
                tmpData.push({
                    name: physicals[i].name,
                    moid: physicals[i].moid,
                    percent: physicals[i][readyData[tab].name],
                    ip: physicals[i].ip,
                    machineRoomName: physicals[i].machine_room_name,
                    type: physicals[i].type,
                    frameName: physicals[i].frame_name,
                })
            }

            if(isPersonal && moidList != ""){
                let currentMoidListIndex = readyData[tab].currentMoidListIndex
                readyData[tab].personalServerList[currentMoidListIndex] = tmpData;
            }else if(!isPersonal){
                readyData[tab].serverList = tmpData;
            }else if(isPersonal && moidList == ""){
                readyData[tab].personalServerList = [];
            }
            let currentResourceMoid = "";
            if(render){//服务器列表渲染
                renderServer(tab, dom);

                if(moidList != ""){
                    let next = readyData[tab].currentMoidListIndex + 1;
                    readyData[tab].currentMoidListIndex = next % readyData[tab].personalMoidList.length;
                }
                currentResourceMoid = $(dom).find('.resource-wrapper .item-resource-wrapper.active .resourceMoid').text()
            }else{
                currentResourceMoid = tmpData.length > 0 ? tmpData[0].moid : "";
            }

            fetchState.ajaxInfoId[tab] = fetchServerInfo({ tab, moid, dom }, currentResourceMoid, render)
        }else{
            readyData[tab].personalServerList = [];
            readyData[tab].serverList = [];
            if(render){
                renderServer(tab, dom);
            }

            if(fetchState.poll[tab]){
                fetchState.ajaxServerId[tab] = fetchServer({ tab, moid, dom }, render)
            }
        }
    }, 'json').error(function () {
        if(fetchState.poll[tab]){
            fetchState.ajaxServerId[tab] = fetchServer({ tab, moid, dom }, render)
        }
    });
}

function fetchServerInfo({ tab, moid, dom }, currentResourceMoid, render){
    const { BASE_URL } = Store.getState()

    let url = ''
    if(tab === 'cpu'){
        url = BASE_URL + "/nms/getCpuUsageHistory";
    }else{
        url = BASE_URL + "/nms/getMemUsageHistory";
    }

    let end_time = Times.formatTime(new Date());
    let start_time = Times.formatTime(new Date(new Date(end_time).getTime() - 1 * 24 * 60 * 60 * 1000));

    return $.get(url, {
        'moid': currentResourceMoid,
        start_time,
        end_time
    }, function (t) {
        if (t.success) {
            let data = t.data.physical;
            let timeLength = data.time.length;
            if (data.values[timeLength - 1] == null) {
                data.values.pop(); //删除最后一个空数据
                data.time.pop();
                timeLength--;
            }
            for (let i = 0; i < timeLength; i++) {
                //修正中间可能未统计到的数据
                data.values[i] = data.values[i] || 0
                data.time[i] = data.time[i].split(" ")[1];
            }
            readyData[tab].value[serverMoid] = data;
        }else{
            readyData[tab].value[serverMoid] = getNoDataEchartsOpt();
        }
        if(render){
            renderServerInfo(tab, dom);
        }
        if(fetchState.poll[tab]){
            fetchState.ajaxServerId[tab] = fetchServer({ tab, moid, dom }, render)
        }
    }, 'json').error(function () {
        if(fetchState.poll[tab]){
            fetchState.ajaxServerId[tab] = fetchServer({ tab, moid, dom }, render)
        }
    });
}


const output = {
    async render(dom, { user,  }){
        $(dom).empty()
            .append($(TemplateHeader({ resourceData: [] })).localize())
            .append($(TemplateChart({})).localize())
            .append($(TemplateFooter({})).localize())
        //初始显示无数据
        renderNoDataServer(dom)
        echartDom = echartRender(getNoDataEchartsOpt());
        
        const moidList = await fetchPersonal()
        
        readyData['cpu'].currentMoidListIndex = 0;
        readyData['cpu'].personalMoidList = moidList;
        readyData['memory'].currentMoidListIndex = 0;
        readyData['memory'].personalMoidList = moidList;

        const moid = user.isServiceDomainAdmin ? user.serviceDomainMoid : ( user.isUserDomainAdmin ? user.userDomainMoid : user.moid);
        
        fetchState.cache = { moid, dom }
        fetchState.ajaxServerId.cpu = fetchServer({ tab: 'cpu', moid, dom }, true)
        fetchState.ajaxServerId.memory = fetchServer({ tab: 'memory', moid, dom }, false)
      
    },
    startfetch(tab){
        const { moid, dom } = fetchState.cache;
        fetchState.poll.cpu = true;
        fetchState.ajaxServerId.cpu = fetchServer({ tab: 'cpu', moid, dom }, tab === 'cpu')
        fetchState.poll.memory = true;
        fetchState.ajaxServerId.memory = fetchServer({ tab: 'memory', moid, dom }, tab === 'memory')
    },
    stopfetch(){
        fetchState.poll.cpu = false;
        fetchState.ajaxServerId.cpu.abort()
        fetchState.ajaxInfoId.cpu.abort()
        fetchState.poll.memory = false;
        fetchState.ajaxServerId.memory.abort()
        fetchState.ajaxInfoId.memory.abort()
    }
}

export default output
