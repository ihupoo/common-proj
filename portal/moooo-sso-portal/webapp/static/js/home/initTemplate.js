var initHome={
    panels:null,
    init:function(){
    	this.vrsFunctions();
    	this.initHomeTemplate();
    },
    initHomeTemplate:function(){
        this.initHeader();
        this.initSystemModule();
        this.initMainContent();
        this.initFooter();
    },
    initHeader:function(){},
    initSystemModule:function () {
        var initSystemModuleTemplate = new InitTemplate($('.module-entry-wrapper'),"modules-content",systemMoudelData);//注意element需要替换
        this.processData = function(data){
            for(var attr in data){
                if(sysmode==='buildSelf'||isSimpleMcu){//自建下  有权限显示无权限隐藏
                    if(data[attr].value){
                        data[attr].show='show'
                    }else{
                        data[attr].url='';
                        data[attr].show='hidden'
                    }
                }
                if(sysmode==='rent' && !isSimpleMcu){
                    if(data[attr].value){
                        data[attr].show='show'
                    }else{
                        data[attr].url='';
                        if(attr==='cmc'||attr==='amc'||attr==='live'||attr==='nms'||attr==='kis'||attr==='doms'||attr==='cbs'){//租赁情况下  这几个权限有权限显示 无权置灰，其他权限 有权限显示无权限隐藏
                            data[attr].show='disable'//置灰
                        }else{
                            data[attr].show='hidden'
                        }
                    }
                }
            }
            //设置录播-直播值
            if(sysmode=='buildSelf') {//自建模式：会议录播
                data['vrs_live'].name = data['vrs'].name;
                data['vrs_live'].value = data['vrs'].value;
                data['vrs_live'].show = data['vrs'].show;
                data['vrs_live'].url = data['vrs'].url;
            }
            if(sysmode=='rent'){//租赁：会议直播
                data['vrs_live'].name = data['live'].name;
                data['vrs_live'].value = data['live'].value;
                data['vrs_live'].show = data['live'].show;
                data['vrs_live'].url = data['live'].url;
            }
            var moduleData={
                coreDomain:{
                    width:0,
                    modules:[{
                        name:'社交网络SNS',
                        class_name:'weibo',
                        url:'',
                        value:false,
                        show:'hidden'
                    },{
                        name:data.bmc.name,
                        class_name:'bmc',
                        url:data.bmc.url,
                        value:data.bmc.value,
                        show:data.bmc.show
                    },{
                        name:data.amc.name,
                        class_name:'amc',
                        url:data.amc.url,
                        value:data.amc.value,
                        show:data.amc.show
                    },{
                        name:data.nms.name,
                        class_name:'nms',
                        url:data.nms.url,
                        value:data.nms.value,
                        show:data.nms.show
                    },{
                        name:data.jms.name,
                        class_name:'jms',
                        url:data.jms.url,
                        value:data.jms.value,
                        show:data.jms.show
                    },{
                        name:data.doms.name,
                        class_name:'doms',
                        url:data.doms.url,
                        value:data.doms.value,
                        show:data.doms.show
                    },{
                        name:data.cbs.name,
                        class_name:'cbs',
                        url:data.cbs.url,
                        value:data.cbs.value,
                        show:data.cbs.show
                    }]
                },
                platformDomain:{
                    width:0,
                    modules:[{
                        name:data.amc.name,
                        class_name:'amc',
                        url:data.amc.url,
                        value:data.amc.value,
                        show:data.amc.show
                    },{
                        name:data.nms.name,
                        class_name:'nms',
                        url:data.nms.url,
                        value:data.nms.value,
                        show:data.nms.show
                    },{
                        name:data.cmc.name,
                        class_name:'cmc',
                        url:data.cmc.url,
                        value:data.cmc.value,
                        show:data.cmc.show
                    }, {
                        name:data.vrs_live.name,
                        class_name:'vrs',
                        url:data.vrs_live.url,
                        value:data.vrs_live.value,
                        show:data.vrs_live.show
                    },{
                        name:data.umc.name,
                        class_name:'umc',
                        url:data.umc.url,
                        value:data.umc.value,
                        show:data.umc.show
                    },{
                        name:data.kis.name,
                        class_name:'kis',
                        url:data.kis.url,
                        value:data.kis.value,
                        show:data.kis.show
                    }]
                },
                jmsDomain: {
                    width: 0,
                    modules: [{
                        name: '社交网络SNS',
                        class_name: 'weibo',
                        url: '',
                        value: false,
                        show: 'hidden'
                    }, {
                        name: data.nms.name,
                        class_name: 'nms',
                        url: data.nms.url,
                        value: data.nms.value,
                        show: data.nms.show
                    }, {
                        name: data.jms.name,
                        class_name: 'jms',
                        url: data.jms.url,
                        value: data.jms.value,
                        show: data.jms.show
                    }, {
                        name: data.cmc.name,
                        class_name: 'cmc',
                        url: data.cmc.url,
                        value: data.cmc.value,
                        show: data.cmc.show
                    }, {
                        name: data.vrs_live.name,
                        class_name: 'vrs',
                        url: data.vrs_live.url,
                        value: data.vrs_live.value,
                        show: data.vrs_live.show
                    }, {
                        name: data.umc.name,
                        class_name: 'umc',
                        url: data.umc.url,
                        value: data.umc.value,
                        show: data.umc.show
                    },{
                        name:data.kis.name,
                        class_name:'kis',
                        url:data.kis.url,
                        value:data.kis.value,
                        show:data.kis.show
                    },{
                        name:data.doms.name,
                        class_name:'doms',
                        url:data.doms.url,
                        value:data.doms.value,
                        show:data.doms.show
                    },{
                        name:data.cbs.name,
                        class_name:'cbs',
                        url:data.cbs.url,
                        value:data.cbs.value,
                        show:data.cbs.show
                    }]
                }
            }
            for(var i = 0;i<moduleData[domainType].modules.length;i++){
                if(moduleData[domainType].modules[i].show!='hidden'){
                    moduleData[domainType].width = moduleData[domainType].width+163;
                }
            }
            return moduleData[domainType];
        };
        var that = this;
        initSystemModuleTemplate.processTemplateData(function(data){
        	return that.processData(data)
        }
        );
        initSystemModuleTemplate.renderTemplate();
    },
    initMainContent:function () {
        var initMainContentTemplate = new InitTemplate($('#row'),"row-content",panelData);
        initMainContentTemplate.processTemplateData(function(data){
            if('mooooooo-oooo-oooo-oooo-bmcdebugger' === userMoid || 'mooooooo-oooo-oooo-oooo-bmcdeveloper' === userMoid){
                panelData = {};
                return panelData;
            }
            if(isServiceDomainAdmin && !isSimpleMcu){//服务域管理员
                panelData['live_room']['head_more'].pop(); //服务域管理员显示直播室全部
                panelData['living']['head_more'].pop();
                if(panelData['meeting_info']!=undefined){
                    panelData['meeting_info']['head_titles'].shift();
                    panelData['meeting_info']['head_titles'].pop();
                    panelData['meeting_info']['datagridIds'].shift();
                    panelData['meeting_info']['datagridIds'].pop();
                }

            }
            if (isUserDomainAdmin) {//用户域管理员情况下显示的内容
                panelData['live_room']['head_more'].shift(); //用户域管理员显示直播室更多
                panelData['living']['head_more'].shift();
                if (!isSimpleMcu) {
                    delete panelData['resource_load']['subscribe_alarm'];
                    delete panelData['platform_resource'];
                    panelData['resource_load'].book_meeting_count = panelData['book_meeting_count'];
                    //panelData['resource_load'].book_meeting_count.contentId = panelData['resource_load'].contentId;
                    delete panelData['book_meeting_count']
                }
                if(domainType=='coreDomain'){
                    delete panelData['live_room']['head_more'];
                    delete panelData['living']['head_more'];
                }else{
                    if(!top.systemMoudelData['vrs_live'].value||top.systemMoudelData['vrs_live'].show==='hidden'){
                        delete panelData['live_room'];
                        delete panelData['living'];
                    }
                }
                if(!enableMeeting){
                    panelData['meeting_info']['head_titles'].splice(1,1);
                    panelData['meeting_info']['datagridIds'].splice(1,1);
                }
            }
            if(isUsualUser){//一般用户
                panelData['live_room']['head_more'].shift();
                panelData['living']['head_more'].shift();
                if(!top.systemMoudelData['vrs_live'].value||top.systemMoudelData['vrs_live'].show==='hidden'){
                    delete panelData['live_room'];
                    delete panelData['living'];
                }
                if(!enableMeeting){
                    delete panelData['book_meeting_info'];
                }
            } else if (!enableNM) {
                //没有网管权限不显示更多
                if (panelData.resource_load) {
                    delete panelData.resource_load.head_more;
                    if (panelData.resource_load.subscribe_alarm) {
                        delete panelData.resource_load.subscribe_alarm.head_more;
                    }
                    //没有网管权限不显示媒体资源
                    panelData.resource_load.resourceData.pop();
                }
                if (panelData.platform_resource) {
                    panelData.platform_resource.head_more.pop();
                }
                if (panelData.meeting_count) {
                    delete panelData.meeting_count.head_more;
                }
                if ('coreDomain' === domainType && panelData.meeting_info) {
                    delete panelData.meeting_info.head_more;
                }
                if (panelData.meeting_category_info) {
                    delete panelData.meeting_category_info.head_more;
                }
            } else if('coreDomain' === domainType){
                panelData['meeting_info']['head_more'].shift(); //核心域不显示创建会议
            }
            return panelData;
        });
        initMainContentTemplate.renderTemplate(function(){
            for(var attr in initMainContentTemplate.templateData){
                var html = template(initMainContentTemplate.templateId, initMainContentTemplate.templateData[attr]);
                $('#row').append(html)
            }

        });
        this.panels = initPanels.init();
        if($.isEmptyObject(panelData)){
            $('.no-main-panel').show();
        }
    },
    initFooter:function () {
        var initFooterTemplate = new InitTemplate($(".footer_content","#footer"),"enterprise_introduce",Mo.CompanyInfo);
        initFooterTemplate.renderTemplate();
    },
    vrsFunctions:function(){
    	function zeroBefore(number) {
            if (number < 10) {
                return "0" + number;
            }
            return number;
        }
    	template.defaults.imports.formatTime = function(param,timeStr){
            param = Math.round(param);
            if (param < 0) {
                return null;
            }
            if (param < 60) {
                param = zeroBefore(param);
                timeStr = "00:00:" + param;
            } else if (param >= 60 && param < 3600) {
                var min = zeroBefore(Math.floor(param / 60));
                var secons = zeroBefore(param % 60);
                timeStr = "00:" + min + ":" + secons;
            } else {
                var hour = zeroBefore(Math.floor(param / 3600));
                var timeData = param % 3600
                var min = zeroBefore(Math.floor(timeData / 60));
                var secons = zeroBefore(timeData % 60);
                timeStr = hour + ":" + min + ":" + secons;
            }
            return timeStr;
        }
        template.defaults.imports.formatNum = function(num){
            var result = '', counter = 0;
            num = (num || 0).toString();
            for (var i = num.length - 1; i >= 0; i--) {
                counter++;
                result = num.charAt(i) + result;
                if (!(counter % 3) && i != 0) { result = ',' + result; }
            }
            return result;
        }
        template.defaults.imports.formatPath = function(path){
            return "//"+vrsIp + path;
        }
    }
}

var initPanels = {//此处更新
    init:function(){
        var initResourceLoad = this.initResourceLoad();
        var initPlatformResource = this.initPlatformResource();
        var initMeetingCount = this.initMeetingCount();

        var initSubcribeAlarm = this.initSubcribeAlarm();
        var initBookMeetingCount = this.initBookMeetingCount();
        var initMeetingInfoCalendar = this.initMeetingInfoCalendar();

        var initMeetingCategoryInfo = this.initMeetingCategoryInfo();//服务域管理员和用户域管理员是显示我的会议日程

        var initCallMeeting = this.initCallMeeting();//一般用户是我的会议日程拆开显示-正在召开的会议、预约的会议、历史会议
        var initBookMeeting = this.initBookMeeting();//一般用户是我的会议日程拆开显示-正在召开的会议、预约的会议、历史会议
        var initPastMeeting = this.initPastMeeting();//一般用户是我的会议日程拆开显示-正在召开的会议、预约的会议、历史会议

        var initLiveRoom = this.initLiveRoom();
        var initLiving = this.initLiving();
        return {
            "resourceLoadPanel":initResourceLoad,
            "platformResourcePanel":initPlatformResource,
            "meetingCountPanel":initMeetingCount,
            "subcribeAlarmPanel":initSubcribeAlarm,
            "bookMeetingCount":initBookMeetingCount,
            "meetingInfoCalendarPanel":initMeetingInfoCalendar,
            "meetingCategoryPanel":initMeetingCategoryInfo,
            "callMeetingPanel":initCallMeeting,
            "bookMeetingPanel":initBookMeeting,
            "pastMeetingPanel":initPastMeeting,
            "liveRoomPanel":initLiveRoom,
            "livingPanel":initLiving,

        }
    },
    initResourceLoad:function(){
        var resourceLoadPanel = null;
        if(panelData.hasOwnProperty("resource_load")) {//是否有资源负载，有则显示并加载
            var resourceLoadPanel= new InitPanel(function(){//初始化无数据
                var initResourceLoadPanel = new InitTemplate($('#resource_load'),"resource-content",panelData.resource_load);
                initResourceLoadPanel.renderTemplate();
            },function () {//ajax获取数据
                controller.getResourceLoadInfo();
            });
            resourceLoadPanel.initNoDataPanel();
            resourceLoadPanel.getPanelData();
            resourceLoadPanel.refresh();
        }
        return resourceLoadPanel;

    },
    initPlatformResource:function(){
        var platformResourcePanel = null;
        if(panelData.hasOwnProperty("platform_resource")) {//是否有平台资源负载，有则显示并加载
            platformResourcePanel = new PlatformResourcePanel()
            platformResourcePanel.initNoDataPanel()
            platformResourcePanel.storePanelDataFun()
            platformResourcePanel.drawPanelByDataFun()
            platformResourcePanel.refresh()

        }
        return platformResourcePanel;
    },
    initMeetingCount:function(){
        var meetingCountPanel = null;
        if(panelData.hasOwnProperty("meeting_count")) {//【并发会议统计】【并发会议在线终端统计】【在线终端统计】
            var meetingCountPanel = new MeetingCountPanel();
            meetingCountPanel.initEvent();
            meetingCountPanel.initNoDataPanel();
            meetingCountPanel.storePanelData();
            meetingCountPanel.drawPanelByDataFun();
            meetingCountPanel.refresh();


        }
        return meetingCountPanel;
    },
    initSubcribeAlarm:function(){
        var subcribeAlarmPanel = null;
        if(panelData.hasOwnProperty("resource_load")&&panelData.resource_load.hasOwnProperty("subscribe_alarm")) {
            subcribeAlarmPanel = new InitPanel(function () {//初始化无数据
            	$("#"+panelData.resource_load.subscribe_alarm.contentId).append('<div id="warm-grid"></div>');
    	        $(".no-data","#subscribe_alarm").removeClass("hidden");//空数据渲染
    	        
            }, function () {//ajax获取数据
            	controller.getWarmInfo();
            });
            subcribeAlarmPanel.initNoDataPanel();
            subcribeAlarmPanel.getPanelData();
            subcribeAlarmPanel.refresh();
        }
        return subcribeAlarmPanel;
    },
    initBookMeetingCount:function(){
    	var bookMeetingCountPanel = null;
    	if(panelData.hasOwnProperty("book_meeting_count")||(panelData.hasOwnProperty("resource_load")&&panelData.resource_load.hasOwnProperty("book_meeting_count"))){

    		bookMeetingCountPanel = new InitPanel(function(){//初始化无数据
    			var bookMeetingCountData = null;
    			if(panelData.hasOwnProperty("book_meeting_count")){
    				bookMeetingCountData = panelData.book_meeting_count;
    			}else if(panelData.hasOwnProperty("resource_load")&&panelData.resource_load.hasOwnProperty("book_meeting_count")){
    				bookMeetingCountData = panelData.resource_load.book_meeting_count;
    			}
    			var bookMeetingCountGraphHtml = template('graph-wrapper',bookMeetingCountData);//渲染图表数据
        		$("#"+bookMeetingCountData.contentId).append(bookMeetingCountGraphHtml);
    			var data = {
		            time:[],
		            values:[]
		        }
		        for(var i = 0;i<graphOption.bookMeetingOption.num;i++){
		        	var currentHour = new Date(times.formatTimeHour(new Date(new Date().getTime()+i*times.oneHour))).getHours();
		        	currentHour = currentHour<10?"0"+currentHour:currentHour;
		        	currentHour = currentHour+":00";
		        	data['time'].push(currentHour);
		        }
		        var start_time = times.formatTime(new Date());
		        var end_time = times.formatTime(new Date(new Date(start_time).getTime()+times.oneDay));
		        drawGraph.drawBookMeetingGraph(data);

    		},function(){//ajax获取数据
    			controller.getBookMeetingCountInfoCount();
    		});
    		bookMeetingCountPanel.initNoDataPanel();
    		bookMeetingCountPanel.getPanelData();
    		bookMeetingCountPanel.refresh();
    	}
    },
    initMeetingInfoCalendar:function(){
        var meetingInfoCalendarPanel = null;
        if(panelData.hasOwnProperty("meeting_info")) {//服务域管理员和用户域管理员
            meetingInfoCalendarPanel = new MeetingCalendarPanel();
            meetingInfoCalendarPanel.initNoDataPanel();
            meetingInfoCalendarPanel.initDataGrid();
            meetingInfoCalendarPanel.refresh();
        }
        return meetingInfoCalendarPanel;
    },
    initMeetingCategoryInfo:function(){
        var meetingCategoryPanel = null;
        if(panelData.hasOwnProperty("meeting_category_info")) {//传统会议  端口会议  点对点会议
            meetingCategoryPanel = new InitPanel(function () {//初始化无数据
            	$("#"+panelData.meeting_category_info.contentId).append('<div id="meeting_category-grid"></div>');
    	        
    	        $(".no-data","#meeting_category_info").removeClass("hidden");
    	        $(".no-data","#meeting_category_info").addClass(panelTips[panelData.meeting_category_info.head_titles[0]].className);
    	        $(".warm-text","#meeting_category_info").text(panelTips[panelData.meeting_category_info.head_titles[0]].tips);
    	        
    	        
            }, function () {//ajax获取数据
            	controller.getTransMeetingInfo();
            });
            meetingCategoryPanel.initNoDataPanel();
            meetingCategoryPanel.getPanelData();
            meetingCategoryPanel.refresh();
        }
        return meetingCategoryPanel;
    },
    initCallMeeting:function(){
        var callMeetingPanel = null;
        if(panelData.hasOwnProperty("call_meeting_info")) {//一般用户-正在召开的会议
            callMeetingPanel = new CallMeetingPanel();
            callMeetingPanel.initNoDataPanel();
            callMeetingPanel.initDataGrid();
            callMeetingPanel.refresh();
        }
        return callMeetingPanel;
    },
    initBookMeeting:function(){
        var bookMeetingPanel = null;
        if(panelData.hasOwnProperty("book_meeting_info")) {//一般用户-预约的会议
            bookMeetingPanel = new BookMeetingPanel();
            bookMeetingPanel.initNoDataPanel();
            bookMeetingPanel.initDataGrid();
            bookMeetingPanel.refresh();
        }
        return bookMeetingPanel;
    },
    initPastMeeting:function(){
        var pastMeetingPanel = null;
        if(panelData.hasOwnProperty("past_meeting_info")) {//一般用户-历史会议
            pastMeetingPanel = new PastMeetingPanel();
            pastMeetingPanel.initNoDataPanel();
            pastMeetingPanel.initDataGrid();
            pastMeetingPanel.refresh();
        }
        return pastMeetingPanel;
    },
    initLiveRoom:function(){

    	var liveRoomPanel = null;
        if(panelData.hasOwnProperty("live_room")) {//直播室
            liveRoomPanel = new InitPanel(function () {//初始化无数据
            	$(".no-data","#live_room").removeClass("hidden");
    	        $(".warm-text","#live_room").text(panelTips[panelData.live_room.head_titles[0]].tips);
            }, function () {//ajax获取数据
            	controller.getLiveRoomInfo();
            });
            liveRoomPanel.initNoDataPanel();
            liveRoomPanel.getPanelData();
            liveRoomPanel.refresh();
        }
        return liveRoomPanel;
    },
    initLiving:function(){
        var livingPanel = null;
        if(panelData.hasOwnProperty("living")) {//即将直播
            livingPanel = new InitPanel(function () {//初始化无数据
            	$(".no-data","#living").removeClass("hidden");
    	        $(".warm-text","#living").text(panelTips[panelData.living.head_titles[0]].tips);
            }, function () {//ajax获取数据
            	controller.getLivingRoomInfo();
            });
            livingPanel.initNoDataPanel();
            livingPanel.getPanelData();
            livingPanel.refresh();
        }
        return livingPanel;
    },
}

var InitTemplate = function(parentElement,templateId,templateData){
    this.parentElement = parentElement;
    this.templateId = templateId;
    this.templateData = templateData;//模板数据
}
InitTemplate.prototype.processTemplateData= function(processFun){
    if( typeof processFun=="function" ){
        this.templateData =  processFun(this.templateData);
    }
}
InitTemplate.prototype.renderTemplate = function(renderFun){
    if( typeof renderFun=="function" ){
        renderFun();
    }else{
        var moduleHtml = template(this.templateId,this.templateData);
        this.parentElement.append(moduleHtml);
    }

}

var InitPanel = function(noDataFun,getDataFun,refreshFun,refreshTime){
    this.noDataFun = noDataFun;
    this.getDataFun = getDataFun;
    this.refreshFun = refreshFun||getDataFun;
    this.refreshTime = refreshTime||20000;
    this.refreshId = null;

}
InitPanel.prototype.initNoDataPanel= function(){//默认初始化无数据情况下的面板
    if(typeof this.noDataFun == "function"){
        this.noDataFun();
    }
}
InitPanel.prototype.getPanelData= function(){//初始化后台传入数据情况下的面板
    if(typeof this.getDataFun == "function"){
        this.getDataFun();
    }
}







InitPanel.prototype.stop = function(){
    if(this.refreshId!=null){
        clearInterval(this.refreshId);
        this.refreshId = null;
    }
}

InitPanel.prototype.refresh = function(){//每个panel绑定一个刷新函数
    if(typeof this.refreshFun == "function"){
    	this.stop();
        this.refreshId = setInterval(this.refreshFun,this.refreshTime);
    }
}
InitPanel.prototype.setGetDataFun = function(getDataFun){
    this.getDataFun = getDataFun;
    this.refreshFun = this.refreshFun||getDataFun;
}
InitPanel.prototype.setRefreshFun = function(refreshFun){
    this.refreshFun = refreshFun;
}
