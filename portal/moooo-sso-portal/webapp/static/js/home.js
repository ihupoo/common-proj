/**
 * 工具
 * 
 * */
$.namespace("SSO.home");
SSO.home={
	init:function(meetingStr,callbordsDataStr,liveRoomStr){
	   var that=this;
//	   SSO.common.init();//公用头初始化
	   SSO.Size.init();
	   this.regEvent();
	   if(null != meetingStr && "" != meetingStr){
		   var meetings=JSON.parse(meetingStr);
		   var data={meetings:meetings};
	   }else{
		   var data={meetings:''};
	   }
        var html = template('t_meeting', data);
       $("#meeting_schedule .meeting_items").append($(html));
	   if(null != callbordsDataStr && "" != callbordsDataStr){
		   var callbordsData=JSON.parse(callbordsDataStr);
		   that.loadCallbords(callbordsData);
	   }
	   this.initLiveRooms(liveRoomStr);
	   var count = $(".menu-long a:visible").length;
		if(count > 5){
			$(".a_right").css({visibility: 'visible'});
		}
		$(".menu-long").css({width:count*152});
    },
    //直播室
    initLiveRooms:function(liveRoomStr){
    	if(null != liveRoomStr && ""!= liveRoomStr){
    		var living = JSON.parse(liveRoomStr);
    		var data = {living:living};
    	}else{
    		var data = {living:''};
    	}
    	var html = template("t_liveRoom",data);
		$("#liveRoom_schedule .liveRoom_items").append($(html));
    },
    loadCallbords:function(data){//加载公告板
    	if(undefined != data && null != data){
    		var curPage=data.curPage;//当前页
    		var totalPage=data.totalPage;//总页数
    		var tData={callboards:data.data};
            var html = template('t_call_board', tData);
            $("#call_board .call_items").append($(html));
            $(".cur_page").text(curPage).data("val",curPage);//刷新当前页
            $(".total_page").text(totalPage).data("val",totalPage);//刷新总页数
    	}
    },
    regEvent:function(){
    	var that=this;
    	$(".setting-info").on("click",function(e){
    		$(".setting-list").toggle();
    		stopPropagation(e);
    	});
    	
    	$(document).on("click",function(){
    		$(".setting-list").hide();
    	});
    	
    	function stopPropagation(e) {
    	    if (e.stopPropagation) 
    	        e.stopPropagation();
    	    else 
    	        e.cancelBubble = true;
    	}
    	
    	$("#call_board .pre_page").on("click",function(){//上一页
    		var dom=$(this);
    		if(dom.hasClass("disabeld")){
    			return false;
    		}
    		var curPage=$("#call_board .cur_page").data("val");//当前页
    		var totalPage=$("#call_board .total_page").data("val");//当前页
    		if(1 == curPage){
    			return false;
    		}
    		dom.addClass("disabeld");
    		curPage=curPage-1;
    		$.post(BP.config.SYSTEM_URL+"/getcallBoards",{
    			page:curPage,
    			pageSize:5
    		},function(t){
    			dom.removeClass("disabeld");
    			if(t.success){
    				var data=t.data;
    				that.loadCallbords(data);
    			}
    		},'json').error(function(){
    			dom.removeClass("disabeld");
    			alert("系统异常,请与管理员联系！");
    		})
    	});
    	
    	$("#call_board .next_page").on("click",function(){//下一页
    		var dom=$(this);
    		
    		if(dom.hasClass("disabeld")){
    			return false;
    		}
    		var curPage=$("#call_board .cur_page").data("val");//当前页
    		var totalPage=$("#call_board .total_page").data("val");//当前页
    		if(totalPage == curPage){
    			return false;
    		}
    		dom.addClass("disabeld");
    		curPage=curPage+1;
    		$.post(BP.config.SYSTEM_URL+"/getcallBoards",{
    			page:curPage,
    			pageSize:5
    		},function(t){
    			dom.removeClass("disabeld");
    			if(t.success){
    				var data=t.data;
    				that.loadCallbords(data);
    			}
    		},'json').error(function(){
    			dom.removeClass("disabeld");
    			alert("系统异常,请与管理员联系！");
    		});
    	});
    	
    	$("#modifyUser").on("click",function(){
    		location.href = BP.config.SYSTEM_URL+"/set#profile";
    	});
    	
    	$("#modifyPassword").on("click",function(){
    		location.href = BP.config.SYSTEM_URL+"/set#password";
    	});
    	$("#gmt").on("click",function(){
    		location.href = BP.config.SYSTEM_URL+"/set#gmt";
    	});
    	$("#language").on("click",function(){
    		location.href = BP.config.SYSTEM_URL+"/set#language";
    	});
    	$("#modifyPortrait").on("click",function(){
    		location.href = BP.config.SYSTEM_URL+"/set#portrait";
    	});
    	 	
    }
};


$.namespace("SSO.Home.about");
SSO.Home.about={
		init: function(){
			this.initEvent();
		},
		initEvent: function(){
			var that = this;
			$("#about").on("click", function(){
				$.dialog({
					padding: 0,
					id: "aboutWindow",
					content: document.getElementById('aboutWrapper'),
					lock: true,
					opacity: 0.50,	// 透明度
					cancel:false, // 隐藏关闭按钮
					drag: false // 不允许拖拽
				});
			});
			
			//取消
			$(".w-close", "#aboutWrapper").on("click",function(){
				that.close();
			});
		},
		close: function(){
			$.dialog({id: 'aboutWindow'}).close();
		}
	};

$.namespace("SSO.Size");
SSO.Size={
	init : function(){
		/*var wrapMinHeight = 650;
        var winHeight = $(window).height();
        var wrapHeight = winHeight>wrapMinHeight?winHeight:wrapMinHeight;
        var contentHeight = wrapHeight - $("#header").outerHeight() -$("#footer").outerHeight();
        $(".wrap").height(wrapHeight)         
        $(".content").height(contentHeight)
        $(".wrapcontent").height(contentHeight);*/
		var height = $(window).height()-185;
		$(".content").css("min-height",height);
        $(window).resize(function(){
        	SSO.Size.experirdpageInit();
        })
	},
	
    experirdpageInit:function(){
    	var wrapMinHeight = 650;
        var winHeight = $(window).height();
        var wrapHeight = winHeight>wrapMinHeight?winHeight:wrapMinHeight;
/*        console.log("wrapHeight"+wrapHeight);*/
        var wrapAllHeight = wrapHeight-$("#footer").outerHeight();
        $(".wrap").height(wrapHeight)         
        $(".wrap-all").height(wrapAllHeight)
        /*console.log("wrap-all"+wrapAllHeight);*/
    }
}