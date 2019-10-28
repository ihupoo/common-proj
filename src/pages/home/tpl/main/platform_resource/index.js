import Store from '@/store';
import { Times } from '@/utils/utils';
import TemplateIndex from './index.art';
import echarts from 'echarts'
import { echartOption, percentCount } from '@/pages/home/js/draw';

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
    cache: null,
    ajaxId: null,
    poll : true
};

//记录当前用户观看平台域资源详情的开始和结束时间位置
let resourceTemp  = {
    platCpu:{//平台cpu资源
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

let readyData = [{
    name:"cpu",
    currentMoidListIndex:0,
    personalMoidList: null,//cpu的自定义服务器moid列表
    personalServerList:[],//自定义服务器列表
    serverList: [],//cpu的服务器列表-----定时更新
    value: {},//cpu的图表数据----定时更新
}, {
    name:"memory",
    currentMoidListIndex:0,
    personalMoidList: null,//memory的自定义服务器moid
    personalServerList:[],
    serverList: [],//memory的服务器列表-----定时更新
    value: {},//memory的图表数据-----定时更新

}];

let moidList = []

function getEmptyData() {
    var data = {//服务器详情显示空数据
        'name': '',
        'time': [],
        'values': [],
    };
    var date = new Date();
    var time = date.getTime();
    for (var i = 0; i < 15; i = i + 1) {
        var time = time - Times.tenSeconds;
        var newDate = new Date(time);
        var strTime = (newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours()) + ":" + (newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes()) + ":" + (newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds());
        data.time.unshift(strTime)
    }
    return data
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


function eventBind(user, resourceData, dom){
   
}

function fetchLoad(user, resourceData, dom) {
    const { BASE_URL } = Store.getState()
   
}

/*查询是否是开启自定义服务器设置*/
function fetchPersonalSetting() {
    const { BASE_URL } = Store.getState()
    $.get( BASE_URL + "/custom/personalSetting", {type: 'CPU'}, function (t) {
        if (t.success) {
            if (t.data.showCustomCpuIndex == 1) {
                $(".isPersonalSetting").toggleClass("no-checked");
            }
            fetchPersonalPhysicalServer();

        }
    }, 'json').error(function () {

    });
}

/*查询用户自定义服务器列表*/
function fetchPersonalPhysicalServer() {
    const { BASE_URL } = Store.getState()
    $.get(BASE_URL + "/custom/personalPhysicalServer", {type: 'CPU'}, function (t) {
        if (t.success) {
            let servers = t.data.join(",");
            processMoidList(servers);
            readyData[0].currentMoidListIndex = 0;
            readyData[1].currentMoidListIndex = 0;
            readyData[0].personalMoidList = moidList;
            readyData[1].personalMoidList = moidList;
            storePanelData();
        }
    }, 'json').error(function () {

    });
}
function processMoidList(servers) {
    moidList = [];
    $("#platform_resource .wheel-btn").remove();
    let serverDefaultNum = 5;
    let mList = servers.split(",");
    if (mList.length == 0) {
        return;
    }

    for (let i = 0; i < mList.length; i = i + serverDefaultNum) {
        if (i + serverDefaultNum < mList.length) {
            let temp = mList.slice(i, i + serverDefaultNum);
            moidList.push(temp.join(","))
        } else {
            let temp = mList.slice(i, mList.length);
            moidList.push(temp.join(","));
        }
    }

}


function storePanelData(){
    storePlatformResourceServerInfo(0)
    storePlatformResourceServerInfo(1)
}

function storePlatformResourceServerInfo(index) {//index-0 :cpu资源  index-1：memory资源
  
    const { BASE_URL } = Store.getState()

    var headerTitle = $(".platform_resource .header-title.active .title").text()
    var index_headerTitle = ['平台CPU资源', '平台内存资源'].indexOf(headerTitle)

    if(headerTitle == '平台CPU资源'){
        url = BASE_URL + "/nms/getCpuPhysical";
    }else if(headerTitle == '平台内存资源'){
        url = BASE_URL + "/nms/getMemPhysical";
    }
    var mList = "";
    if(!$(".isPersonalSetting").hasClass("no-checked")){
        var currentMoidListIndex = readyData[index].currentMoidListIndex
        mList = readyData[index].personalMoidList==null? "":readyData[index].personalMoidList[currentMoidListIndex]
    }

    var requestGet = $.get(url, {
        moid: moid,
        num: 5,
        'moidList': mList
    }, function (t) {
        if (t.success) {
            var physicals = t.data.physicals;

            var tmpData = []
            for (var i = 0; i < physicals.length; i++) {
                var dataItem = {name: '', moid: '', percent: '', ip: ''};
                dataItem.name = physicals[i].name;
                dataItem.moid = physicals[i].moid;
                dataItem.percent = physicals[i][readyData[index].name];
                dataItem.ip = physicals[i].ip;
                dataItem.machineRoomName = physicals[i].machine_room_name;
                dataItem.type = physicals[i].type;
                dataItem.frameName = physicals[i].frame_name;

                tmpData.push(dataItem)
            }

            if(!$(".isPersonalSetting").hasClass("no-checked")&&mList!=""){
                readyData[index].personalServerList[currentMoidListIndex] = tmpData;
            }else if($(".isPersonalSetting").hasClass("no-checked")){
                readyData[index].serverList = tmpData;
            }else if(!$(".isPersonalSetting").hasClass("no-checked")&&mList==""){
                readyData[index].personalServerList = [];
            }
            var currentResourceMoid = "";
            if(index==index_headerTitle){//服务器列表渲染
                drawResourceServerFun(index);
                if(mList!=""){
                    readyData[index].currentMoidListIndex +=  + 1;
                    readyData[index].currentMoidListIndex = readyData[index].currentMoidListIndex % moidList.length;
                }
                currentResourceMoid = $(".resourceMoid", $(".item-resource-wrapper.active", $(".resource-wrapper", "#platform_resource"))).text();
            }else{
                currentResourceMoid = tmpData.length>0?tmpData[0].moid:"";
            }

            storePlatformResourceInfo(index,currentResourceMoid)
        }else{
            readyData[index].personalServerList = [];
            readyData[index].serverList = [];
            if(index==index_headerTitle){
                drawResourceServerFun(index);
            }
        }



    }, 'json').error(function () {

    });
    controller.ajaxRequestArray.getPlatformResourceServerInfo = requestGet

}
function storePlatformResourceInfo(index, serverMoid) {//index-0 :cpu资源详情 index-1 memory资源详情
    
    const { BASE_URL } = Store.getState()

    var headerTitle = $(".platform_resource .header-title.active .title").text()
    var index_headerTitle = ['平台CPU资源', '平台内存资源'].indexOf(headerTitle)

    var url = ""
    if(index == 0){
        url = BASE_URL + "/nms/getCpuUsageHistory";
    }else if(index==1){
        url = BASE_URL + "/nms/getMemUsageHistory";
    }
    let end_time = Times.formatTime(new Date());//获取数据的终止时间
    let start_time = Times.formatTime(new Date(new Date(end_time).getTime() - 1 * 24 * 60 * 60 * 1000));//获取数据的起始时间

    var requestGet = $.get(url, {
        'moid': serverMoid,
        start_time,
        end_time
    }, function (t) {
        if (t.success) {
            data = t.data.physical;
            var timeLength = data.time.length;
            if (data.values[timeLength - 1] == null) {
                data.values.pop(); //删除最后一个空数据
                data.time.pop();
                timeLength--;
            }
            for (var i = 0; i < timeLength; i++) {
                //修正中间可能未统计到的数据
                if (data.values[i] == null) {
                    data.values[i] = 0;
                }
                data.time[i] = data.time[i].split(" ")[1];
            }
            readyData[index].value[serverMoid] = data;



        }else{
            readyData[index].value[serverMoid] = getEmptyData();
        }
        if(index==index_headerTitle){
            drawResourceInfoFun(index);

        }

    }, 'json').error(function () {
    });
    controller.ajaxRequestArray.getPlatformResourceInfo = requestGet
}

function drawResourceServerFun(index) {
    if ((readyData[index].personalServerList.length == 0) && !$(".isPersonalSetting").hasClass("no-checked")) {//勾选了显示自定义服务器，但是实际没设置自定义服务器
        $("#platform_resource .wheel-btn").remove();
        $("#platform_resource .item-resource-wrapper").removeClass("active");
        $("#platform_resource .resource-wrapper").addClass("none-visible");
        $(".no-data", "#platform_resource").removeClass("hidden")
        $(".no-data", "#platform_resource").width(260);
        $(".warm-text", "#platform_resource").text("尚未自定义所需显示的服务器，请先设置。");
    } else {

        if (readyData[index].serverList.length == 0&&$(".isPersonalSetting").hasClass("no-checked")) {//默认无数据情况
            $(".no-data", "#platform_resource").removeClass("hidden")
            $(".no-data", "#platform_resource").width(116);
            $(".warm-text", "#platform_resource").text("暂无服务器信息")
            $("#platform_resource .wheel-btn").remove();

        } else {//有数据情况----显示自定义服务器数据/默认前五服务器
            /**begin:intTemplate---初始化有数据情况下的平台资源模板*/
            var platformResourceData = $.extend(true, {}, panelData.platform_resource);
            if(!$(".isPersonalSetting").hasClass("no-checked")){
                platformResourceData.resourceData = readyData[index].personalServerList[readyData[index].currentMoidListIndex];
            }else {
                platformResourceData.resourceData = readyData[index].serverList;
            }

            platformResourceData.containerWidth = platformResourceData.resourceData.length * 107;
            var platformResourceHtml = template('platform-resource-content', platformResourceData);//模板初始化

            $(".resource-wrapper", "#platform_resource").remove();
            $('#platform_resource').prepend(platformResourceHtml);
            /**end:intTemplate*/

            var currentResourceMoid = readyData[index].serverList[0]//需要显示的服务器列表
            currentResourceMoid = $(".resourceMoid", $(".item-resource-wrapper.active", $(".resource-wrapper", "#platform_resource"))).text() || currentResourceMoid;

            $(".item-resource-wrapper", "#platform_resource").removeClass("active")
            $("#" + currentResourceMoid).parent().parent().addClass("active")

            $(".no-data", "#platform_resource").addClass("hidden");

            if (!$(".isPersonalSetting").hasClass("no-checked")) {//设置的是【显示自定义服务器】，当数量超过五个的时候需要轮显
                if (platformResourcePersonalFunctions.moidList.length > 1) {
                    if ($("#platform_resource .wheel-btn").length == 0) {
                        var wheelBtnTemplate = template("platform-resource-wheel-btn", {
                            data: platformResourcePersonalFunctions.moidList,
                            activeIndex: readyData[index].currentMoidListIndex
                        });
                        $('#platform_resource').prepend(wheelBtnTemplate);
                    } else {
                        $("span", "#platform_resource .wheel-btn").removeClass("active");
                        $(".wheel-btn-" + readyData[index].currentMoidListIndex, "#platform_resource .wheel-btn").addClass("active");
                    }
                }

            }
            envent.platformResourceEvent();

        }
    }
};
function drawResourceInfoFun(index) {
    if ((readyData[index].personalServerList.length == 0) && !$(".isPersonalSetting").hasClass("no-checked")) {//勾选了显示自定义服务器，但是实际没设置自定义服务器
        $("#platform_resource .wheel-btn").remove();
        $("#platform_resource .item-resource-wrapper").removeClass("active");
        $("#platform_resource .resource-wrapper").addClass("none-visible");
        $(".no-data", "#platform_resource").removeClass("hidden")
        $(".no-data", "#platform_resource").width(260);
        $(".warm-text", "#platform_resource").text("尚未自定义所需显示的服务器，请先设置。");
    } else {

        if (readyData[index].serverList.length == 0&&$(".isPersonalSetting").hasClass("no-checked")) {//默认无数据情况
            $(".no-data", "#platform_resource").removeClass("hidden")
            $(".no-data", "#platform_resource").width(116);
            $(".warm-text", "#platform_resource").text("暂无服务器信息")
            $("#platform_resource .wheel-btn").remove();

        } else {//有数据情况----显示自定义服务器数据/默认前五服务器
            /**begin:intTemplate---初始化有数据情况下的平台资源模板*/
            var platformResourceData = $.extend(true, {}, panelData.platform_resource);
            if(!$(".isPersonalSetting").hasClass("no-checked")){
                platformResourceData.resourceData = readyData[index].personalServerList[readyData[index].currentMoidListIndex];
            }else {
                platformResourceData.resourceData = readyData[index].serverList;
            }

            platformResourceData.containerWidth = platformResourceData.resourceData.length * 107;
            var platformResourceHtml = template('platform-resource-content', platformResourceData);//模板初始化

            $(".resource-wrapper", "#platform_resource").remove();
            $('#platform_resource').prepend(platformResourceHtml);
            /**end:intTemplate*/

            var currentResourceMoid = readyData[index].serverList[0]//需要显示的服务器列表
            currentResourceMoid = $(".resourceMoid", $(".item-resource-wrapper.active", $(".resource-wrapper", "#platform_resource"))).text() || currentResourceMoid;

            $(".item-resource-wrapper", "#platform_resource").removeClass("active")
            $("#" + currentResourceMoid).parent().parent().addClass("active")

            $(".no-data", "#platform_resource").addClass("hidden");

            if (!$(".isPersonalSetting").hasClass("no-checked")) {//设置的是【显示自定义服务器】，当数量超过五个的时候需要轮显
                if (platformResourcePersonalFunctions.moidList.length > 1) {
                    if ($("#platform_resource .wheel-btn").length == 0) {
                        var wheelBtnTemplate = template("platform-resource-wheel-btn", {
                            data: platformResourcePersonalFunctions.moidList,
                            activeIndex: readyData[index].currentMoidListIndex
                        });
                        $('#platform_resource').prepend(wheelBtnTemplate);
                    } else {
                        $("span", "#platform_resource .wheel-btn").removeClass("active");
                        $(".wheel-btn-" + readyData[index].currentMoidListIndex, "#platform_resource .wheel-btn").addClass("active");
                    }
                }

            }
            envent.platformResourceEvent();

        }
    }
};

export default {
    render(dom, { user }){
        //初始显示无数据
        $(dom).siblings('.no-data-wrapper').removeClass('hidden')
        let echartDom = echartRender(getEmptyData())
        fetchPersonalSetting()
      
        fetchState.cache = { user, resourceData, dom }
        fetchState.ajaxId = fetchLoad(user, resourceData, dom)
    },
    startfetch(){
        const { user, resourceData, dom } = fetchState.cache;
        fetchState.poll = true;
        fetchState.ajaxId = fetchLoad(user, resourceData, dom)
    },
    stopfetch(){
        fetchState.poll = false;
        fetchState.ajaxId.abort()
    }
}
