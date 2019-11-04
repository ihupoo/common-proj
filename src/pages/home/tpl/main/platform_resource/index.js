import Store from '@/store';
import { Times } from '@/utils/utils';
import { echartBtnVisiable, fetchLoop } from '../../utils';
import TemplateHeader from './header.art';
import TemplateTop from './top.art';
import TemplateChart from './chart.art';
import TemplateBottom from './bottom.art';
import TemplateWheelBtn from './wheelBtn.art';
import echarts from 'echarts'
import { echartOption } from '@/pages/home/tpl/draw';
import { fetchPersonal, fetchPersonalSettingClick } from './personal/server';
import { showPersonalDialog } from './personal/dialog';

let myChart = null;

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

let fetchState = {
    server:{
        cpu : new fetchLoop(),
        memory : new fetchLoop(),
    },
    info: {
        cpu : new fetchLoop(),
        memory : new fetchLoop()
    }
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

let currentResourceMoid = {
    cpu : '',
    memory : '',
}

function getTabName(){
    let activeName = $(".platform_resource .active .title").text();
    let tabName = '', otherName = '';
    if(activeName == '平台CPU资源'){//平台cpu资源
        tabName = 'cpu';
        otherName = 'memory';
    }
    if(activeName == '平台内存资源'){//平台内存资源
        tabName = 'memory';
        otherName = 'cpu';
    }
    return { tabName, otherName }
}


function echartRender(data){
    let { tabName } = getTabName()
    let cur = resourceTemp[tabName]

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

    myChart = echarts.init(document.getElementById("platform_resource-graph"),"");
    
    let opts = echartOption.getStakedAreaLineOption(echartsOpt);
    myChart.clear();
    myChart.setOption(opts, true);
}

//服务器详情显示空数据
function getNoDataEchartsOpt() {
    let data = {
        'name': '',
        'time': [],
        'values': [],
    };
    let date = new Date();
    let curTime = date.getTime();
    for (let i = 0; i < 15; i = i + 1) {
        let time = curTime - Times.tenSeconds;
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
                .prepend($(TemplateTop({ resourceData, containerWidth })).localize())

            /**end:intTemplate*/

            //需要显示的服务器列表
            currentResourceMoid[tab] = $(dom).find('.resource-wrapper .item-resource-wrapper.active .resourceMoid').text() || readyData[tab].serverList[0];

            $(dom).find(".item-resource-wrapper").removeClass("active")
            $("#" + currentResourceMoid[tab]).parent().parent().addClass("active")

            $(dom).siblings('.no-data-wrapper').addClass("hidden");

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
    let $activeDom = $(dom).find('.item-resource-wrapper.active .foot-title')
    let resourceDetail = {
        name: $activeDom.find('.foot-title-name').text(),
        ip: $activeDom.find('.ip').text(),
        machineRoomName: $activeDom.find('.machineRoomName').text(),
        type: $activeDom.find('.type').text(),
        frameName: $activeDom.find('.frameName').text()
    }
    $(dom).find(".platform-resource-detail").remove();
    $(dom).append($(TemplateBottom(resourceDetail)).localize())

    /**end*/

    let $activeWrapper = $(dom).find('.resource-wrapper .item-resource-wrapper.active')
    let value = $activeWrapper.find(".value").text() || 0;
    $(".platform_resource_graph_value").text(value + "%")
    currentResourceMoid[tab] = $activeWrapper.find('.resourceMoid').text()
    if (readyData[tab].value != null && readyData[tab].value[currentResourceMoid[tab]] != undefined) {
        echartRender(readyData[tab].value[currentResourceMoid[tab]]);
    }
}


function eventBindServer(dom){
    $(dom).find(".item-resource-wrapper").off().on("click",function(){//鼠标点击平台资源，资源名称呈现蓝色
        //暂停自动刷新
        output.stopfetch()

        $(".item-resource-wrapper",$(this).parent().parent()).removeClass("active");
        $(this).addClass("active")
        
        let { tabName, otherName } = getTabName()

        //不记忆上次操作的值
        resourceTemp[tabName]={
            startIndex:null,
            endIndex:null,
            startValue:null,
            endValue:null
        }
        //启动自动刷新
        //与后端交互，查询平台资源信息，并绘制线图
        currentResourceMoid[tab] = $(".resourceMoid",$(this)).text()

        fetchState.server.cpu.poll = true;
        fetchState.server.memory.poll = true;
        fetchState.info.cpu.start()
        fetchState.info.memory.start()

    });
    $(".wheel-btn span").off().on("click",function(){
        //暂停自动刷新
        output.stopfetch()
        //判断是第几页
        let currentMoidListIndex = Number($(this).attr("currentMoidListIndex"))
        //判断是哪个tab页面
        readyData['cpu'].currentMoidListIndex = currentMoidListIndex;
        readyData['memory'].currentMoidListIndex = currentMoidListIndex;

        //启动自动刷新
        output.startfetch()
    });
}

function eventBindChart(dom){
    let $chartDom = $(dom).find('.graph-wrapper')
    $chartDom.find('.minus').on('click',function(e){
        let data = echartsOpt.xData;
        let lineAreaOption = myChart.getOption()

        let length = data.length;
        if (echartsOpt.startIndex > 0 || echartsOpt.endIndex < length - 1) {
            let delta = 1 / length * 100;
            if (echartsOpt.startIndex > 0) {
                echartsOpt.startIndex -= 1;
                lineAreaOption.dataZoom[0].start -= delta;
            }
            if (echartsOpt.endIndex < length - 1) {
                echartsOpt.endIndex += 1;
                lineAreaOption.dataZoom[0].end += delta;
            }
            lastStatusResourceTemp(echartsOpt,data);
            myChart.setOption(lineAreaOption)
        }
        echartBtnVisiable($chartDom, echartsOpt, length - 1);
    })
    $chartDom.find('.plus').on('click',function(e){
        let data = echartsOpt.xData;
        let lineAreaOption =  myChart.getOption();

        let length = data.length;
        if( echartsOpt.endIndex > 0
            && echartsOpt.endIndex > echartsOpt.startIndex
            && echartsOpt.endIndex - echartsOpt.startIndex > 2
            ){
            let delta = 1 / length * 100;
            echartsOpt.startIndex += 1;
            lineAreaOption.dataZoom[0].start += delta;
            echartsOpt.endIndex -= 1;
            lineAreaOption.dataZoom[0].end -= delta;

            lastStatusResourceTemp(echartsOpt,data);
            myChart.setOption(lineAreaOption)
        }
        echartBtnVisiable($chartDom, echartsOpt, length - 1);
    })

    $chartDom.find('.leftMove').on('click',function(e){
        let data = echartsOpt.xData;
        let lineAreaOption =  myChart.getOption();
        
        let length = data.length;
        if(echartsOpt.startIndex > 0 ){
            echartsOpt.startIndex = echartsOpt.startIndex - 1;
            echartsOpt.endIndex = echartsOpt.endIndex - 1;
            lineAreaOption.dataZoom[0].start = echartsOpt.startIndex / (length - 1) * 100;
            lineAreaOption.dataZoom[0].end = echartsOpt.endIndex / (length - 1) * 100;
            lastStatusResourceTemp(echartsOpt,data);
            myChart.setOption(lineAreaOption)
        }
        echartBtnVisiable($chartDom, echartsOpt, length - 1);
    })

    $chartDom.find('.rightMove').on('click',function(e){
        let data = echartsOpt.xData;
        let lineAreaOption =  myChart.getOption();
        
        let length = data.length;

        if(echartsOpt.endIndex < length - 1){
            echartsOpt.startIndex = echartsOpt.startIndex + 1;
            echartsOpt.endIndex = echartsOpt.endIndex + 1;
            lineAreaOption.dataZoom[0].start = echartsOpt.startIndex / (length-1) * 100;
            lineAreaOption.dataZoom[0].end = echartsOpt.endIndex / (length-1) * 100;
            lastStatusResourceTemp(echartsOpt,data);
            myChart.setOption(lineAreaOption)
        }
        echartBtnVisiable($chartDom, echartsOpt, length - 1);
    })
}

function eventBindTitle(dom){
    let $containerDom = $(".platform_resource");
    $containerDom.find(".isPersonalSetting").on("click",function () {//是否自定义设置服务器
        $(this).toggleClass("no-checked");
        fetchPersonalSettingClick().then(res => {
            output.stopfetch()

            let { tabName } = getTabName()
            renderServer(tabName, dom)
            renderServerInfo(tabName, dom)

            output.startfetch()
        })
    })
    $containerDom.find(".personalSetting").on("click",function(){//设置自定义服务器---弹出自定义设置服务器对话框
        let { tabName } = getTabName()
        output.stopfetch()
        
        let moidList = readyData[tabName].personalMoidList.join(",")
        showPersonalDialog(moidList, function(_moidList){

            readyData['cpu'].currentMoidListIndex = 0;
            readyData['cpu'].personalMoidList = _moidList;
            readyData['memory'].currentMoidListIndex = 0;
            readyData['memory'].personalMoidList = _moidList;

            output.startfetch()
        })
    })
    $containerDom.find('.tab .header-title').on('click',function(){
        if($(this).hasClass('active')) return;
        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        let { tabName } = getTabName()
        $containerDom.find('.leftMove').removeClass("hidden");
        $containerDom.find('.rightMove').addClass("hidden");
        $containerDom.find(".item-resource-wrapper").removeClass("active");
        readyData[tabName].currentMoidListIndex = 0;

        renderServer(tabName, dom)
        renderServerInfo(tabName, dom)
    })
}

//平台CPU资源  平台内存资源 的保留操作后的结果
function lastStatusResourceTemp(opt, data){
    let { tabName } = getTabName()
    resourceTemp[tabName] = {
        startIndex:  opt.startIndex,
        endIndex: opt.endIndex,
        startValue: data[opt.startIndex],
        endValue: data[opt.endIndex]
    }
}

/** 
 *  请求
  */
function fetchServer({ tab, moid, dom }){
    const { BASE_URL } = Store.getState()
    let url = ''
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
        let { tabName } = getTabName()
        let canRender = tabName === tab;

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
            if(canRender){//服务器列表渲染
                renderServer(tab, dom);

                if(moidList != ""){
                    let next = readyData[tab].currentMoidListIndex + 1;
                    readyData[tab].currentMoidListIndex = next % readyData[tab].personalMoidList.length;
                }
                currentResourceMoid[tab] = $(dom).find('.resource-wrapper .item-resource-wrapper.active .resourceMoid').text()
            }else{
                currentResourceMoid[tab] = tmpData.length > 0 ? tmpData[0].moid : "";
            }

            fetchState.info[tab].cache({ tab, moid, dom })
                            .start(({ tab, moid, dom }) => fetchServerInfo({ tab, moid, dom }))

        }else{
            readyData[tab].personalServerList = [];
            readyData[tab].serverList = [];
            if(canRender){
                renderServer(tab, dom);
            }
            fetchState.server[tab].loop()
        }
    }, 'json').error(function () {
        fetchState.server[tab].loop()
    });
}

function fetchServerInfo({ tab, moid, dom }){
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
        'moid': currentResourceMoid[tab],
        start_time,
        end_time
    }, function (t) {
        let { tabName } = getTabName()
        let canRender = tabName === tab;

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
        if(canRender){
            renderServerInfo(tab, dom);
        }
    }, 'json').error(function () {
        
    }).complete(function(){
        fetchState.server[tab].loop()
    })
}


const output = {
    render(dom, { user }){
        const moid = user.serviceDomainAdmin ? user.serviceDomainMoid : ( user.userDomainAdmin ? user.userDomainMoid : user.moid);

        this.renderHeader(`${dom}-header`, user)
        this.renderContent(dom, moid)
    },
    renderHeader(dom, { enableNM } ) {
        const data = {
            head_titles:["平台CPU资源","平台内存资源"],
            head_more:(() => {
                let moreList =[
                    { more:"显示自定义服务器" },
                    { more:"更多", url:"/nms/home/" }
                ]
                //没有网管权限不显示更多
                if (!enableNM) {
                    moreList = moreList.filter(x => x !== '更多')
                }
                return moreList
            })(),
        }

        $(dom).empty().append($(TemplateHeader(data)).localize())
        eventBindTitle(dom)
    },  
    async renderContent(dom, moid) {
        $(dom).empty()
            .append($(TemplateTop({ resourceData: [] })).localize())
            .append($(TemplateChart({})).localize())
            .append($(TemplateBottom({})).localize())
        //初始显示无数据
        renderNoDataServer(dom)
        echartRender(getNoDataEchartsOpt());
        eventBindChart(dom)
        
        const moidList = await fetchPersonal()
        
        readyData['cpu'].currentMoidListIndex = 0;
        readyData['cpu'].personalMoidList = moidList;
        readyData['memory'].currentMoidListIndex = 0;
        readyData['memory'].personalMoidList = moidList;
 
        fetchState.server.cpu.cache({ moid, dom }).start(({ moid, dom }) => fetchServer({ tab: 'cpu', moid, dom }))
        fetchState.server.memory.cache({ moid, dom }).start(({ moid, dom }) => fetchServer({ tab: 'memory', moid, dom }))
  
    },
    startfetch(){
        fetchState.server.cpu.start()
        fetchState.server.memory.start()
    },
    stopfetch(){
        fetchState.server.cpu.stop()
        fetchState.server.memory.stop()
        fetchState.info.cpu.stop()
        fetchState.info.memory.stop()
    }
}

export default output
