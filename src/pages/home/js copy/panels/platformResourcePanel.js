

/**
 * 该文件主要针对【平台cpu资源】【平台内存资源】所属的panel进行优化
 * @constructor
 */
var PlatformResourcePanel = function () {
    Panel.call(this)
    this.readyData = [{
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


    this.getEmptyData = function () {
        var data = {//服务器详情显示空数据
            'name': '',
            'time': [],
            'values': [],
        };
        var date = new Date();
        var time = date.getTime();
        for (var i = 0; i < 15; i = i + 1) {
            var time = time - times.tenSeconds;
            var newDate = new Date(time);
            var strTime = (newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours()) + ":" + (newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes()) + ":" + (newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds());
            data.time.unshift(strTime)
        }
        return data
    };

    this.end_time = times.formatTime(new Date());//获取数据的终止时间
    this.start_time = times.formatTime(new Date(new Date(this.end_time).getTime() - 1 * 24 * 60 * 60 * 1000));//获取数据的起始时间


    this.noDataFun = function () {
        var initPlatformResourceServers = new InitTemplate($('#platform_resource'), "resource-content", panelData.platform_resource);
        initPlatformResourceServers.renderTemplate(function () {
            var moduleHtml = template(initPlatformResourceServers.templateId, initPlatformResourceServers.templateData);
            initPlatformResourceServers.parentElement.prepend(moduleHtml);
        });

        var initPlatformResourceServer = new InitTemplate($("#" + panelData.platform_resource.contentId), "graph-wrapper", panelData.platform_resource);
        initPlatformResourceServer.renderTemplate();

        $(".no-data", "#platform_resource").removeClass("hidden");//服务器信息显示空数据
        $(".warm-text", "#platform_resource").text("暂无服务器信息");

        drawGraph.drawPlatformResourceGraph(this.getEmptyData());

        platformResourcePersonalFunctions.getPersonalSetting(this);


    }
    this.storePanelDataFun = function () {
        this.storePlatformResourceServerInfo(0);
        this.storePlatformResourceServerInfo(1);
    }
    this.refreshFun = function () {
        this.storePanelDataFun();
    }
    this.eventFun = function () {

    }
    this.storePlatformResourceServerInfoByHeaderTitle = function(){
        var headerTitle = $(".title", ".platform_resource .header-title.active ").text()
        var index_headerTitle= panelData.platform_resource.head_titles.indexOf(headerTitle)
        this.storePlatformResourceServerInfo(index_headerTitle)
    }
    this.storePlatformResourceServerInfo = function (index) {//index-0 :cpu资源  index-1：memory资源
        var that = this;

        var headerTitle = $(".title", ".platform_resource .header-title.active ").text()
        var index_headerTitle= panelData.platform_resource.head_titles.indexOf(headerTitle)

        if(index ==0){
            url = Mo.Config.appUrl + "/nms/getCpuPhysical";
        }else if(index==1){
            url = Mo.Config.appUrl + "/nms/getMemPhysical";
        }
        var moidList = "";
        if(!$(".isPersonalSetting").hasClass("no-checked")){
            var currentMoidListIndex = this.readyData[index].currentMoidListIndex
            moidList = this.readyData[index].personalMoidList==null?"":this.readyData[index].personalMoidList[currentMoidListIndex]
        }

        var requestGet = $.get(url, {
            moid: moid,
            num: 5,
            'moidList': moidList
        }, function (t) {
            if (t.success) {
                var physicals = t.data.physicals;

                var tmpData = []
                for (var i = 0; i < physicals.length; i++) {
                    var dataItem = {name: '', moid: '', percent: '', ip: ''};
                    dataItem.name = physicals[i].name;
                    dataItem.moid = physicals[i].moid;
                    dataItem.percent = physicals[i][that.readyData[index].name];
                    dataItem.ip = physicals[i].ip;
                    dataItem.machineRoomName = physicals[i].machine_room_name;
                    dataItem.type = physicals[i].type;
                    dataItem.frameName = physicals[i].frame_name;

                    tmpData.push(dataItem)
                }

                if(!$(".isPersonalSetting").hasClass("no-checked")&&moidList!=""){
                    that.readyData[index].personalServerList[currentMoidListIndex] = tmpData;
                }else if($(".isPersonalSetting").hasClass("no-checked")){
                    that.readyData[index].serverList = tmpData;
                }else if(!$(".isPersonalSetting").hasClass("no-checked")&&moidList==""){
                    that.readyData[index].personalServerList = [];
                }
                var currentResourceMoid = "";
                if(index==index_headerTitle){//服务器列表渲染
                    that.drawResourceServerFun(index);
                    if(moidList!=""){
                        that.readyData[index].currentMoidListIndex +=  + 1;
                        that.readyData[index].currentMoidListIndex = that.readyData[index].currentMoidListIndex % platformResourcePersonalFunctions.moidList.length;
                    }
                    currentResourceMoid = $(".resourceMoid", $(".item-resource-wrapper.active", $(".resource-wrapper", "#platform_resource"))).text();
                }else{
                    currentResourceMoid = tmpData.length>0?tmpData[0].moid:"";
                }

                that.storePlatformResourceInfo(index,currentResourceMoid)
            }else{
                that.readyData[index].personalServerList = [];
                that.readyData[index].serverList = [];
                if(index==index_headerTitle){
                    that.drawResourceServerFun(index);
                }
            }



        }, 'json').error(function () {

        });
        controller.ajaxRequestArray.getPlatformResourceServerInfo = requestGet

    }
    this.storePlatformResourceInfo = function (index,serverMoid) {//index-0 :cpu资源详情 index-1 memory资源详情
        var that = this;
        var headerTitle = $(".title", ".platform_resource .header-title.active ").text()
        var index_headerTitle = panelData.platform_resource.head_titles.indexOf(headerTitle)
        var url = ""
        if(index ==0){
            url = Mo.Config.appUrl + "/nms/getCpuUsageHistory";
        }else if(index==1){
            url = Mo.Config.appUrl + "/nms/getMemUsageHistory";
        }
        var requestGet = $.get(url, {
            'moid': serverMoid,
            'start_time': that.start_time,
            'end_time': that.end_time
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
                that.readyData[index].value[serverMoid] = data;



            }else{
                that.readyData[index].value[serverMoid] = that.getEmptyData();
            }
            if(index==index_headerTitle){
                that.drawResourceInfoFun(index);

            }

        }, 'json').error(function () {
        });
        controller.ajaxRequestArray.getPlatformResourceInfo = requestGet
    }

    this.drawResourceServerFun = function (index) {
        if ((this.readyData[index].personalServerList.length == 0) && !$(".isPersonalSetting").hasClass("no-checked")) {//勾选了显示自定义服务器，但是实际没设置自定义服务器
            $("#platform_resource .wheel-btn").remove();
            $("#platform_resource .item-resource-wrapper").removeClass("active");
            $("#platform_resource .resource-wrapper").addClass("none-visible");
            $(".no-data", "#platform_resource").removeClass("hidden")
            $(".no-data", "#platform_resource").width(260);
            $(".warm-text", "#platform_resource").text("尚未自定义所需显示的服务器，请先设置。");
        } else {

            if (this.readyData[index].serverList.length == 0&&$(".isPersonalSetting").hasClass("no-checked")) {//默认无数据情况
                $(".no-data", "#platform_resource").removeClass("hidden")
                $(".no-data", "#platform_resource").width(116);
                $(".warm-text", "#platform_resource").text("暂无服务器信息")
                $("#platform_resource .wheel-btn").remove();

            } else {//有数据情况----显示自定义服务器数据/默认前五服务器
                /**begin:intTemplate---初始化有数据情况下的平台资源模板*/
                var platformResourceData = $.extend(true, {}, panelData.platform_resource);
                if(!$(".isPersonalSetting").hasClass("no-checked")){
                    platformResourceData.resourceData = this.readyData[index].personalServerList[this.readyData[index].currentMoidListIndex];
                }else {
                    platformResourceData.resourceData = this.readyData[index].serverList;
                }

                platformResourceData.containerWidth = platformResourceData.resourceData.length * 107;
                var platformResourceHtml = template('platform-resource-content', platformResourceData);//模板初始化

                $(".resource-wrapper", "#platform_resource").remove();
                $('#platform_resource').prepend(platformResourceHtml);
                /**end:intTemplate*/

                var currentResourceMoid = this.readyData[index].serverList[0]//需要显示的服务器列表
                currentResourceMoid = $(".resourceMoid", $(".item-resource-wrapper.active", $(".resource-wrapper", "#platform_resource"))).text() || currentResourceMoid;

                $(".item-resource-wrapper", "#platform_resource").removeClass("active")
                $("#" + currentResourceMoid).parent().parent().addClass("active")

                $(".no-data", "#platform_resource").addClass("hidden");

                if (!$(".isPersonalSetting").hasClass("no-checked")) {//设置的是【显示自定义服务器】，当数量超过五个的时候需要轮显
                    if (platformResourcePersonalFunctions.moidList.length > 1) {
                        if ($("#platform_resource .wheel-btn").length == 0) {
                            var wheelBtnTemplate = template("platform-resource-wheel-btn", {
                                data: platformResourcePersonalFunctions.moidList,
                                activeIndex: this.readyData[index].currentMoidListIndex
                            });
                            $('#platform_resource').prepend(wheelBtnTemplate);
                        } else {
                            $("span", "#platform_resource .wheel-btn").removeClass("active");
                            $(".wheel-btn-" + this.readyData[index].currentMoidListIndex, "#platform_resource .wheel-btn").addClass("active");
                        }
                    }

                }
                envent.platformResourceEvent();

            }
        }
    };
    this.drawResourceInfoFun = function (index) {
        /**being:显示服务器机框、机房、ip等详情**/
        var resourceDetail = {name: '', ip: '', machineRoomName: '', type: '', frameName: ''};
        resourceDetail.name = $(".foot-title .foot-title-name", $("#platform_resource .item-resource-wrapper.active")).text();
        resourceDetail.ip = $(".foot-title .ip", $("#platform_resource .item-resource-wrapper.active")).text();
        resourceDetail.machineRoomName = $(".foot-title .machineRoomName", $("#platform_resource .item-resource-wrapper.active")).text();
        resourceDetail.type = $(".foot-title .type", $("#platform_resource .item-resource-wrapper.active")).text();
        resourceDetail.frameName = $(".foot-title .frameName", $("#platform_resource .item-resource-wrapper.active")).text();
        $(".platform-resource-detail").remove();
        var platformResourceDetailHtml = template('platform-resource-detail', resourceDetail);
        $('#platform_resource .graph-wrapper').append(platformResourceDetailHtml);
        /**end*/
        var value = $(".value", $(".item-resource-wrapper.active", "#platform_resource")).text();
        value = value == "" ? 0 : value;
        $(".platform_resource_graph_value").text(value + "%")
        var currentResourceMoid = $(".resourceMoid", $(".item-resource-wrapper.active", $(".resource-wrapper", "#platform_resource"))).text()
        if (this.readyData[index].value != null&&this.readyData[index].value[currentResourceMoid]!=undefined) {
            drawGraph.drawPlatformResourceGraph(this.readyData[index].value[currentResourceMoid]);
        }

    }
    this.drawPanelByDataFun = function () {
        var headerTitle = $(".title", ".platform_resource .header-title.active ").text()
        var index = panelData.platform_resource.head_titles.indexOf(headerTitle)

        this.drawResourceServerFun(index);
        this.drawResourceInfoFun(index);
        //this.storePanelDataFun();//由于该panel不能做到每台服务器都缓存数据（每台服务器），只缓存当前或者上一次

    };


}
PlatformResourcePanel.prototype = new Panel()
var platformResourcePersonalFunctions = {//自定义服务器的相关函数
    moidList: [],
    currentMoidListIndex: 0,
    /*跳转到自定义服务器设置弹出框*/
    selectServer: function (callback) {
        initHome.panels.platformResourcePanel.stop();
        $.dialog.open(BP.config.SYSTEM_URL + "/custom/physicalServerSetting", {
            id: "selectServerDialog",
            lock: true,
            opacity: 0.50, // 透明度
            title: "自定义服务器设置",
            padding: 0,
            width: 720,
            height: 520,
            close: function () {
                // 如果是确定事件
                var result = $.dialog.data('result');
                if (result != undefined && result.action == 'ok') {

                    var servers = result.selectedIds;

                    if (typeof callback == "function") {
                        callback(servers);
                    }
                }
                initHome.panels.platformResourcePanel.refresh();
            },
            cancel: false, // 隐藏关闭按钮
            drag: false
            // 不允许拖拽
        }, false);
    },
    /*保存自定义服务器配置*/
    setPersonalPhysiCalServerSetting: function () {

        var that = this;
        var url = Mo.Config.appUrl + "/custom/personalSetting";
        var value = $(".isPersonalSetting").hasClass("no-checked") ? '0' : '1';
        $.post(url, {type: 'showCustomCpuIndex', value: value}, function (t) {
            if (!t.success) {
                $(".isPersonalSetting").toggleClass("no-checked");
                Mo.alert('显示自定义服务器失败');
            } else {
                //that.currentMoidListIndex = 0;
                $("#platform_resource .wheel-btn").remove();
                initHome.panels.platformResourcePanel.drawPanelByDataFun();
                initHome.panels.platformResourcePanel.storePanelData()

            }
        }, 'json').error(function () {
            $(".isPersonalSetting").toggleClass("no-checked");
            Mo.alert('显示自定义服务器失败');
        });
    },
    /*保存用户自定义服务器列表*/
    setPersonalPhysicalServer: function (servers) {
        var url = Mo.Config.appUrl + "/custom/personalPhysicalServer";
        var that = this;

        $.post(url, {type: 'CPU', servers: servers}, function (t) {
            if (t.success) {


                platformResourcePersonalFunctions.processMoidList(servers);
                initHome.panels.platformResourcePanel.readyData[0].personalMoidList = platformResourcePersonalFunctions.moidList;
                initHome.panels.platformResourcePanel.readyData[1].personalMoidList = platformResourcePersonalFunctions.moidList;

                initHome.panels.platformResourcePanel.storePanelData()


            }
        }, 'json').error(function () {

        });
    },
    /*查询是否是开启自定义服务器设置*/
    getPersonalSetting: function (panel) {
        var that = this;
        var url = Mo.Config.appUrl + "/custom/personalSetting";
        $.get(url, {type: 'CPU'}, function (t) {
            if (t.success) {
                if (t.data.showCustomCpuIndex == 1) {
                    $(".isPersonalSetting").toggleClass("no-checked");
                }
                that.getPersonalPhysicalServer(panel);

            }
        }, 'json').error(function () {

        });
    },
    /*查询用户自定义服务器列表*/
    getPersonalPhysicalServer: function (panel) {
        var that = this;
        var url = Mo.Config.appUrl + "/custom/personalPhysicalServer";
        $.get(url, {type: 'CPU'}, function (t) {
            if (t.success) {
                var servers = t.data.join(",");
                platformResourcePersonalFunctions.processMoidList(servers);
                initHome.panels.platformResourcePanel.readyData[0].currentMoidListIndex = 0;
                initHome.panels.platformResourcePanel.readyData[1].currentMoidListIndex = 0;
                panel.readyData[0].personalMoidList = platformResourcePersonalFunctions.moidList;
                panel.readyData[1].personalMoidList = platformResourcePersonalFunctions.moidList;
                panel.storePanelData();
            }
        }, 'json').error(function () {

        });
    },
    processMoidList: function (servers) {
        this.moidList = [];
        this.currentMoidListIndex = 0;
        $("#platform_resource .wheel-btn").remove();
        var serverDefaultNum = 5;
        var moidList = servers.split(",");
        if (moidList.length == 0) {
            moidList.push("");
            return;
        }


        for (var i = 0; i < moidList.length; i = i + serverDefaultNum) {
            if (i + serverDefaultNum < moidList.length) {
                var temp = moidList.slice(i, i + serverDefaultNum);
                this.moidList.push(temp.join(","))
            } else {
                var temp = moidList.slice(i, moidList.length);
                this.moidList.push(temp.join(","));
            }
        }

    }
}






