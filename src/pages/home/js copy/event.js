var envent = {
	base64encodechars : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    initEvent:function(){
    	this.seetingEvent();
        this.headerEvent();
        this.resourceLoadEvent();
        this.platformResourceEvent();
    },
    seetingEvent:function(){
    	SSO.common.headerEvent();
    },
    headerEvent:function(){//面板头部点击事件
    	$(".module",".module-entry-wrapper").on("click",function(e){ //点击部分连接时，需要先获取token
    		var me = $(this);
    		if(!me.hasClass("disable") && (me.hasClass("umc") || me.hasClass("kis") || me.hasClass("vrs") || me.hasClass("live"))){
    			e.preventDefault();
        		controller.getSsoToken(function(token){
        			if(me.hasClass("umc")){
        				window.location.href = me.attr("href") + "?SSO_COOKIE_KEY=" + token;
        			}else{
        				window.location.href = me.attr("href") + "?" + envent.base64encode(envent.utf16to8("sso_token="+token));
        			}
        		});
    		}
    	})
    	$(".live_room .more,.living .more").on("click",function(e){
    		var me = $(this);
    		if(me.attr("href").indexOf("?") == -1){
    			e.preventDefault();
        		controller.getSsoToken(function(token){
        			window.location.href = me.attr("href") + "?" + envent.base64encode(envent.utf16to8("sso_token="+token));
        		});
    		}
    	})
        $(".header-title",".tab").on("click",function () {//面板头部点击事件

        		var origText = $(".title",$(".active",$(this).parent())).text()
                $(".header-title",$(this).parent()).removeClass("active");
                $(this).addClass("active")
                var text = $(".title",$(this)).text();
                switch (text){
                    case "平台CPU资源":
                    	if(origText!=text){
                    		$(".leftMove",".platform_resource").removeClass("hidden");
                    		$(".rightMove",".platform_resource").addClass("hidden");
                    		$(".item-resource-wrapper","#platform_resource").removeClass("active");
                            initHome.panels.platformResourcePanel.readyData[0].currentMoidListIndex = 0;
                            initHome.panels.platformResourcePanel.drawPanelByDataFun()
                    	}
                    	break;
                    case "平台内存资源":
                    	if(origText!=text){
                    		$(".leftMove",".platform_resource").removeClass("hidden");
                    		$(".rightMove",".platform_resource").addClass("hidden");
                    		$(".item-resource-wrapper","#platform_resource").removeClass("active");
                            initHome.panels.platformResourcePanel.readyData[1].currentMoidListIndex = 0;
                            initHome.panels.platformResourcePanel.drawPanelByDataFun()
                    	}
                        break;
                    case "并发会议统计":
                    	if(origText!=text){
                    		$(".leftMove",".meeting_count").removeClass("hidden");
                    		$(".rightMove",".meeting_count").addClass("hidden");
                            initHome.panels.meetingCountPanel.drawPanelByDataFun()
                    	}
                    	$("a",$(".header-more",".meeting_count")).attr("href","/nms/home/?path=history_meeting&type=multi&domainMoid="+moid);
                    	//controller.getConcurrentMeetingCount();

                    	//initHome.panels.meetingCountPanel.setRefreshFun(controller.getConcurrentMeetingCount);
                    	//initHome.panels.meetingCountPanel.refresh();
                        break;
                    case "并发会议在线终端统计":
                    	if(origText!=text){
                    		$(".leftMove",".meeting_count").removeClass("hidden");
                    		$(".rightMove",".meeting_count").addClass("hidden");
                            initHome.panels.meetingCountPanel.drawPanelByDataFun()
                    	}
                    	$("a",$(".header-more",".meeting_count")).attr("href","/nms/home/?path=terminalstatics&type=meeting&domainMoid="+moid);
                    	// controller.getConcurrentMeetingTerminalCount();
                    	//
                    	// initHome.panels.meetingCountPanel.setRefreshFun(controller.getConcurrentMeetingTerminalCount);
                    	// initHome.panels.meetingCountPanel.refresh();
                        break;
                    case "终端在线统计":
                    	if(origText!=text){
                    		$(".leftMove",".meeting_count").removeClass("hidden");
                    		$(".rightMove",".meeting_count").addClass("hidden");
                            initHome.panels.meetingCountPanel.drawPanelByDataFun()

                    	}
                    	$("a",$(".header-more",".meeting_count")).attr("href","/nms/home/?path=terminalstatics&type=online&domainMoid="+moid);

                        // controller.getMeetingTerminalCount();
                        // initHome.panels.meetingCountPanel.setRefreshFun(controller.getMeetingTerminalCount);
                    	// initHome.panels.meetingCountPanel.refresh();

                        break;
                    case "正在召开的会议":
                    	if(origText!=text){
                        	//$(".datagrid-body","#meeting_info").empty();
                        	//$(".datagrid-pager","#meeting_info").empty();
                    	}
                    	var id = isUserDomainAdmin?panelData.meeting_info.contentId:panelData.call_meeting_info.contentId;
                        var headerMoreElement = $('.more', $('.header-more', $('#' + id).parent()));
                        if ('coreDomain' !== domainType) {
                            headerMoreElement.attr('href', '/meeting/mcc');
                            headerMoreElement.show(); //非核心域正在召开的会议显示更多
                        } else {
                            headerMoreElement.attr('href', '/nms/home/?path=realtime_meeting');
                        }
                    	initHome.panels.meetingInfoCalendarPanel.drawDataGrid();
                    	break;
                    case "预约的会议":
                    	if(origText!=text){
                    		//$(".datagrid-body","#meeting_info").empty();
                    		//$(".datagrid-pager","#meeting_info").empty();
                    	}
                    	var id = isUserDomainAdmin?panelData.meeting_info.contentId:panelData.book_meeting_info.contentId;
                        var headerMoreElement = $('.more', $('.header-more', $('#' + id).parent()));
                        if (isUsualUser) {
                            headerMoreElement.attr('href','/meeting/meeting/meetingList');
                        } else {
                            headerMoreElement.attr('href', '/nms/home/?path=appointment_meeting');
                            if ('coreDomain' !== domainType) { //非核心域预约的会议更多根据网管权限显示切换
                                if (enableNM) {
                                    headerMoreElement.show();
                                } else {
                                    headerMoreElement.hide();
                                }
                            }
                        }
                        initHome.panels.meetingInfoCalendarPanel.drawDataGrid();
                    	break;
                    case "历史会议":
                    	if(origText!=text){
                    		//$(".datagrid-body","#meeting_info").empty();
                    		//$(".datagrid-pager","#meeting_info").empty();
                    	}
                    	var id = isUserDomainAdmin?panelData.meeting_info.contentId:panelData.past_meeting_info.contentId;
                        var headerMoreElement = $('.more', $('.header-more', $('#' + id).parent()));
                        if (isUsualUser) {
                            headerMoreElement.attr('href','/meeting/meeting/historyMeeting');
                        } else {
                            headerMoreElement.attr('href', '/nms/home/?path=history_meeting');
                            if ('coreDomain' !== domainType) { //非核心域预约的会议更多根据网管权限显示切换
                                if (enableNM) {
                                    headerMoreElement.show();
                                } else {
                                    headerMoreElement.hide();
                                }
                            }
                        }
                        initHome.panels.meetingInfoCalendarPanel.drawDataGrid();
                    	break;
                    case "传统会议":
                    	if(origText!=text){
                    		if(!$(".no-data","#meeting_category_info").hasClass("hidden")){
                    			$(".no-data","#meeting_category_info").addClass("hidden");
                    		}
                    	}

                    	$(".no-data","#meeting_category_info").addClass("custom-meeting");
                        $(".no-data","#meeting_category_info").removeClass("port-meeting point-point-meeting");
                        $(".warm-text","#meeting_category_info").text( "暂无传统会议信息")
                        $("a",$(".header-more",".meeting_category_info")).attr("href","/nms/home/?path=realtime_meeting&type=tran&domainMoid="+moid);
                        controller.getTransMeetingInfo();
                        initHome.panels.meetingCategoryPanel.setRefreshFun(controller.getTransMeetingInfo);
                    	initHome.panels.meetingCategoryPanel.refresh();
                    	break;
                    case "端口会议":
                    	if(origText!=text){
                    		if(!$(".no-data","#meeting_category_info").hasClass("hidden")){
                    			$(".no-data","#meeting_category_info").addClass("hidden");
                    		}
                    	}

                    	$(".no-data","#meeting_category_info").addClass("port-meeting");
                        $(".no-data","#meeting_category_info").removeClass("custom-meeting  point-point-meeting");
                        $(".warm-text","#meeting_category_info").text( "暂无端口会议信息")
                        $("a",$(".header-more",".meeting_category_info")).attr("href","/nms/home/?path=realtime_meeting&type=port&domainMoid="+moid);
                        controller.getPortMeetingInfo();
                        initHome.panels.meetingCategoryPanel.setRefreshFun(controller.getPortMeetingInfo);
                    	initHome.panels.meetingCategoryPanel.refresh();
                    	break;
                    case "点对点会议":
                    	if(origText!=text){
                    		if(!$(".no-data","#meeting_category_info").hasClass("hidden")){
                    			$(".no-data","#meeting_category_info").addClass("hidden");
                    		}
                    	}
                    	$(".no-data","#meeting_category_info").addClass("point-point-meeting");
                        $(".no-data","#meeting_category_info").removeClass("custom-meeting port-meeting ");
                        $(".warm-text","#meeting_category_info").text( "暂无点对点会议信息")
                        $("a",$(".header-more",".meeting_category_info")).attr("href","/nms/home/?path=realtime_meeting&type=p2p&domainMoid="+moid);
                        controller.getP2pMeetingInfo();
                        initHome.panels.meetingCategoryPanel.setRefreshFun(controller.getP2pMeetingInfo);
                    	initHome.panels.meetingCategoryPanel.refresh();
                        break;
                }
        })
        $(".isPersonalSetting").on("click",function () {//是否自定义设置服务器
        	$(this).toggleClass("no-checked");
        	platformResourcePersonalFunctions.setPersonalPhysiCalServerSetting();
        })
        $(".personalSetting").on("click",function(){//设置自定义服务器---弹出自定义设置服务器对话框

        	var options = {
        			treeUrl:Mo.Config.appUrl+"/custom/physicalServerTree?type=CPU",
        			moidList:platformResourcePersonalFunctions.moidList.join(","),
			}
        	$.dialog.data("options",options)
        	platformResourcePersonalFunctions.selectServer(platformResourcePersonalFunctions.setPersonalPhysicalServer);
        })
    },
    resourceLoadEvent:function(){
        $(".mo-icons-bg.resource_info").on("click",function () {//点击资源负载详情按钮，出现八方会议信息
            if($(this).hasClass("click")){
                return ;
            }
			$(".item-resource-info-content-wrapper",$(".resource_info").parent()).remove();
            $(".resource_info").removeClass("click");
			
            $(this).addClass("click");

            //与后端交互，查询当前资源负载的八方会议使用详情
            if($(this).prev().text()==panelData.resource_load.resourceData[0].name){
            	controller.getEightConferenceInfo($(this));
            }
            if(panelData.resource_load.resourceData.length==4&&$(this).prev().text()==panelData.resource_load.resourceData[3].name){
            	controller.getMediaResourceInfo($(this));
            }
            controller.ajaxRequestArray.getResourceLoadInfo.abort();
            initHome.panels.resourceLoadPanel.stop();
        })

        $(".mo-icons-bg.closed").on("click",function(){//八方会议右上方关闭按钮事件
            $(".mo-icons-bg.resource_info.click",$(this).parent().parent().parent()).removeClass("click")
            $(".item-resource-info-content-wrapper",$(this).parent().parent()).remove();
            initHome.panels.resourceLoadPanel.refresh();
        })
    },
    platformResourceEvent:function () {
        $(".item-resource-wrapper","#platform_resource").on("click",function(){//鼠标点击平台资源，资源名称呈现蓝色
            //暂停自动刷新
            initHome.panels.platformResourcePanel.stop();
            $(".item-resource-wrapper",$(this).parent().parent()).removeClass("active");
            $(this).addClass("active")
            var headerTitle = $(".title", ".platform_resource .header-title.active ").text()
            var index = panelData.platform_resource.head_titles.indexOf(headerTitle)
            //不记忆上次操作的值
            var tempName=['platCup','platMemory'][index];
            controller.resourceTemp[tempName]={
                startIndex:null,
                endIndex:null,
                startValue:null,
                endValue:null
            }
            //与后端交互，查询平台资源信息，并绘制线图
            initHome.panels.platformResourcePanel.storePlatformResourceInfo(index,$(".resourceMoid",$(this)).text());
            //启动自动刷新
            initHome.panels.platformResourcePanel.refresh();
        });
        $(".wheel-btn span").unbind();
        $(".wheel-btn span").on("click",function(){
            //暂停自动刷新
            initHome.panels.platformResourcePanel.stop();
            //判断是第几页
            var currentMoidListIndex = Number($(this).attr("currentMoidListIndex"))
            //判断是哪个tab页面
            initHome.panels.platformResourcePanel.readyData[0].currentMoidListIndex = currentMoidListIndex;
            initHome.panels.platformResourcePanel.readyData[1].currentMoidListIndex = currentMoidListIndex;


            initHome.panels.platformResourcePanel.storePlatformResourceServerInfoByHeaderTitle();//根据面板header来缓存数据和绘图

            //启动自动刷新
            initHome.panels.platformResourcePanel.refresh();
        });
    },
    liveRoomEvent:function () {
        $("#live_room").off("mouseover").on("mouseover",".comm_video_img",function(){
            $(this).find(".comm_video_img_btn").css({'display':'block'})
        })
        $("#live_room").off("mouseout").on("mouseout",".comm_video_img",function(){
            $(this).find(".comm_video_img_btn").hide()
        })
        $("#live_room").off("click").on("click",".comm_video_img",function(){
            var streamjsonpath = $(this).find(".comm_video_path").html();
            var id = $(this).parent().find(".comm_video_id").html();
            var mp4_flag = false;
            if(streamjsonpath && streamjsonpath != ""){
                mp4_flag = true;
            };
            var isEncrypt = $(".mo-icons-bg",$(".video-encrypt-icon",this)).hasClass("aes-icon")||$(".mo-icons-bg",".video-encrypt-icon").hasClass("gm-icon")
            if(isEncrypt){
            	alert("不支持播放此类型视频，加密类型视频请使用加密播放器观看。");
            	return false;
            }else{
            	controller.getSsoToken(function(token){
            		openBroad("id="+ id +"&live=1&sso_token=" + token,mp4_flag);
            	})
            }
        })
        function openBroad(param,flag){
            //html播放
            if(flag){
        		//html播放
                var url = "//"+vrsIp+ "/" + "broadcasthtml.html?" + envent.base64encode(envent.utf16to8(param))
                window.location.href=url;
            }else{
                //asf播放
                var agent = navigator.userAgent.toLowerCase() ;
                var regStr_ff = /firefox\/[\d.]+/gi;
                if (navigator.userAgent.indexOf("Chrome") > -1 ||
                    parseInt((agent.match(regStr_ff)+"").replace(/[^0-9.]/ig,"")) >= 52){
                    alert("无法播放该视频，推荐使用IE浏览器观看");
                    return false;
                }
                
                var url = "//"+vrsIp +  "/" +"broadcastasf.html?" + envent.base64encode(envent.utf16to8(param))
                window.location.href=url;
            }
        }
        
    },
    base64encode:function(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += envent.base64encodechars.charAt(c1 >> 2);
                out += envent.base64encodechars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += envent.base64encodechars.charAt(c1 >> 2);
                out += envent.base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
                out += envent.base64encodechars.charAt((c2 & 0xf) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += envent.base64encodechars.charAt(c1 >> 2);
            out += envent.base64encodechars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
            out += envent.base64encodechars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
            out += envent.base64encodechars.charAt(c3 & 0x3f);
        }
        return out;
    },
    utf16to8:function(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007f)) {
                out += str.charAt(i);
            } else if (c > 0x07ff) {
                out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
            } else {
                out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
            }
        }
        return out;
    }
    

}