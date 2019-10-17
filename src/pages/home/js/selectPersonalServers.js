$.namespace("Mo.SelectPersonalServers");
Mo.SelectPersonalServers={
	selectedServerMoids:[],
	selectedServerNames:[],
	selectedNodes:[],
	firstLoadTree:true,
	treeData:null,
	init:function(){
		this.initShow();
		this.initEvent();
		
	},
	
	initShow:function(){
		this.showTree();
	},
	initEvent:function(){
		this.initButtonEvent();
		this.initSearchEvent();
		this.initSelectBtn();
	},
	
	showTree:function(){
		var options = $.dialog.data("options");
		this.selectedServerMoids = options.moidList.split(",")
		var that = this;
		Mo.loadMask.show();
		$("#tree").tree({
			method:'get',
			animate: true,
			cascadeCheck: true,
			checkbox:true,
			url : options.treeUrl,
			onBeforeLoad:function(node, param){
				return node;
			},
			onLoadSuccess: function(node, data) {
				that.showSelections();
				if($('.infoArea')&&$('.infoArea .treeWrapper')){
                    $(".tree-title").each(function(){
                        $(this).attr('title',$(this).text())
                    });
				}
				Mo.loadMask.hide();
			},
			loadFilter:function(node,el){
			   var data = node.data;
               var searchText = null;
                //得到搜索关键字
                var searchCtrl = $("#searchAction");
                searchText = searchCtrl.val().toLowerCase();
                if(searchCtrl.attr('mo-hint') == searchText){
                    searchText = ''; 
                }
                var searchfunc = function(data){
                    if(!data || !data.text) return false;
                    if(data.type!="service"&&data.type!="kernel"){
                    	var index = that.selectedServerMoids.indexOf(data.attributes.moid);
    					if(index==-1){
    						data.checked = false;
    					}else{
    						data.checked = true;
    					}
    				}
                    var exist = data.text && data.text.toLowerCase().indexOf(searchText) != -1 ;
                    if(data.children){
                        for(var i=0,len=data.children.length; i < len ; ++i){
                            if(searchfunc(data.children[i])){
                                exist = true;
                            }else{
                            	data.children.splice(i,1);
                                i--,len--;
                            }
                        }
                    }
                    return exist;
                }
                if(searchText!=null && data!=null && !searchfunc(data[0])) return [];
                return data;
            },
            onBeforeCheck:function(node){
            	if($(".tree-checkbox",$(node.target)).hasClass("checked-selected")){
					return false;
				}
            },
			onCheck:function(node){
				$(".checked-selected").removeClass("tree-checkbox0").addClass("tree-checkbox1");
			},
		});

		$(".treeWrapper").mCustomScrollbar({
			axis:"yx"   
		});

		$(".sourceWrapper").mCustomScrollbar({
			axis:"yx"   
		});

		
		
	},
	showSelections:function(){
		if(this.firstLoadTree){
			this.firstLoadTree = false;
			var selectedAllNodes = $("#tree").tree("getChecked");//非排序过的；
			var selectedNodes = [];
			var selectedNodesMoids = [];
			
			for(var i = 0;i<selectedAllNodes.length;i++){
				if(selectedAllNodes[i].attributes.type!="service"&&selectedAllNodes[i].attributes.type!="kernel"){
					var index  = this.selectedServerMoids.indexOf(selectedAllNodes[i].attributes.moid);
					if(index>=0){
						selectedNodes[index] = selectedAllNodes[i];
					}
					$(".tree-checkbox",$(selectedAllNodes[i].target)).addClass("checked-selected");
					
				}
			}
			this.selectedServerMoids = [];
			for(var i = 0; i<selectedNodes.length;i++){
				var seletedItem = "<li><a id='"+selectedNodes[i].attributes.moid+"'"+" class='mo-select-item'>"+selectedNodes[i].attributes.name+"</a></li>";
				$(".selections").append(seletedItem);
				this.selectedServerNames.push(selectedNodes[i].attributes.name);
				this.selectedServerMoids.push(selectedNodes[i].attributes.moid);
				this.selectedNodes.push(selectedNodes[i]);
			}
			$("#selectedCount").text(this.selectedNodes.length);
			$(".selectedWrapper").mCustomScrollbar({
				axis:"yx"   
			});
		}else{
			var selectedAllNodes = $("#tree").tree("getChecked");
			for(var i = 0;i<selectedAllNodes.length;i++){
				if(selectedAllNodes[i].attributes.type!="service"&&selectedAllNodes[i].attributes.type!="kernel"){
					$(".tree-checkbox",$(selectedAllNodes[i].target)).addClass("checked-selected");
				}
			}
		}
		
		this.initSelectedEvent();
	},
	initButtonEvent:function(){
		var that = this;
		$("#detail-btn-ok").click(function(){// 确定
			var items = $("div#selectedContainer ul li a");
			var sortedSelectedIds = [];
			for(var i = 0;i<items.length;i++){
				sortedSelectedIds.push($(items[i]).attr("id"));
			}
			var result = {// 设置返回值并关闭对话框
					action : "ok",
					selectedIds : sortedSelectedIds.join(","),
			};
			$.dialog.data("result", result);
			$.dialog.close();
		});
		
		
		$("#detail-btn-cancel").click(function(){// 取消
			var result = {
					action : "cancel"
			};
			$.dialog.data("result", result);
			$.dialog.close();
		});
		
		
		$(".w-close").click(function(){// 关闭对话框
			var result = {
					action : "close"
			};
			$.dialog.data("result", result);
			$.dialog.close();
		});
	},
	initSearchEvent:function(){
		var that = this;
		$("#searchActionBtn").click(function(event){	//点击 事件
			that.doSearchAction();
		});
		$("#searchAction").keydown(function(event){	//键盘事件	
			if (event.keyCode == 13) {//enter
				that.doSearchAction();
				return false;
			}
		});
		$("#searchAction").keyup(function(event){	//键盘事件	
			if (event.keyCode==8) {//回删键
				if($("#searchAction").val()=="") {
					that.doSearchAction();
					return false;
				}
			}
		});
		
	},
	initSelectBtn:function(){
		var that = this;
		$("#selectAll").click(function(){// >>
			that.selectAll(true);
		});
		
		$("#selectItem").click(function(){// >
			that.selectAll(false);
		});
		
		$("#removeItem").click(function(){// <
			that.removeAll(false);
		});
		
		$("#removeAll").click(function(){// <<
			that.removeAll(true);
		});
		
		$("#upTop").click(function(){// -^
			that.upTop(true);
		});
		
		$("#up").click(function(){// ^
			that.upTop(false);
		});
		
		$("#down").click(function(){// ~
			that.downBottom(false);
		});
		
		$("#downBottom").click(function(){// -~
			that.downBottom(true);
		});
	},
	selectAll:function(flag){
		var allNodes = $("#tree").tree("getChecked");
		if(flag){
			allNodes = $("#tree").tree("getChildren",$("#tree").tree("getRoot"));
			for(var i = 0;i<allNodes.length;i++){
				if(this.selectedServerMoids.indexOf(allNodes[i].attributes.moid)==-1&&allNodes[i].attributes.type!='service'&&allNodes[i].attributes.type!='kernel'){
					this.selectedServerMoids.push(allNodes[i].attributes.moid);
					this.selectedServerNames.push(allNodes[i].text);
					this.selectedNodes.push(allNodes[i]);
					$("#tree").tree("check",allNodes[i].target);
					$(".tree-checkbox",$(allNodes[i].target)).addClass("checked-selected");
					var seletedServer = "<li><a id='"+allNodes[i].attributes.moid+"'"+" class='mo-select-item'>"+allNodes[i].text+"</a></li>";
					$(".selections").append(seletedServer);
				}
			}
		}else{
			for(var i = 0;i<allNodes.length;i++){
				if(this.selectedServerMoids.indexOf(allNodes[i].attributes.moid)==-1&&allNodes[i].attributes.type!='service'&&allNodes[i].attributes.type!='kernel'){
					this.selectedServerMoids.push(allNodes[i].attributes.moid);
					this.selectedServerNames.push(allNodes[i].text);
					this.selectedNodes.push(allNodes[i]);
					$("#tree").tree("check",allNodes[i].target);
					$(".tree-checkbox",$(allNodes[i].target)).addClass("checked-selected");
					var seletedServer = "<li><a id='"+allNodes[i].attributes.moid+"'"+" class='mo-select-item'>"+allNodes[i].text+"</a></li>";
					$(".selections").append(seletedServer);
				}
			}
		}
		$("#selectedCount").text(this.selectedServerMoids.length);
		this.initSelectedEvent();
	},
	removeAll:function(flag){
		if(flag){
			$("div#selectedContainer ul li").remove();
			$(".tree-checkbox").removeClass("checked-selected")
			for(var i = 0;i<this.selectedNodes.length;i++){
				if(this.selectedNodes[i].target!=undefined){
					$("#tree").tree("uncheck",this.selectedNodes[i].target);
				}
			}
			this.selectedServerMoids = [];
			this.selectedServerNames = [];
			this.selectedNodes = [];
		}else{
			var items = $("div#selectedContainer ul li a.active");
			var that = this;
			for(var i = 0;i<items.length;i++){
				var item = $(items[i]);
				var index = this.selectedServerMoids.indexOf(item.attr("id"),0);
				if(that.selectedNodes[index].target!=undefined){
					$(".tree-checkbox",$(that.selectedNodes[index].target)).removeClass("checked-selected");
					$("#tree").tree("uncheck",this.selectedNodes[index].target);
				}
				this.selectedServerMoids.splice(index,1);
				this.selectedServerNames.splice(index,1);
				this.selectedNodes.splice(index,1);
				item.remove();
			}
		}
		$("#selectedCount").text(this.selectedServerMoids.length);
	},
	upTop:function(flag){
		if(flag){
			$(".selections").prepend($(".mo-select-item.active").parent());
		}else{
			var selectedItems = $(".mo-select-item.active");
			for(var i = 0;i<selectedItems.length;i++){
				$(selectedItems[i]).parent().prev().before($(selectedItems[i]).parent());
			}
		}
	},
	downBottom:function(flag){
		if(flag){
			$(".selections").append($(".mo-select-item.active").parent());
		}else{
			var selectedItems = $(".mo-select-item.active");
			for(var i = selectedItems.length-1 ;i>=0; i--){
				$(selectedItems[i]).parent().next().after($(selectedItems[i]).parent());
			}
		}
	},
	initSelectedEvent:function() {
		var that = this;
		var items = $("div#selectedContainer ul li a");
		if(items.length>0) {
			$(items).each(function() {
				$(this).off();
			}).click(function() {
				that.toggleActive($(this));
			}).dblclick(function() {
				that.removeItem($(this));
			});
		}
	},
	
	toggleActive: function(item) {
		if(item.length!=0){
			if(item.hasClass("active")) {
				item.removeClass("active");
			} else {
				item.addClass("active");
			}
			
		}
	},
	removeItem:function(item) {
		if(item.length!=0){
			var index = this.selectedServerMoids.indexOf(item.attr("id"),0);
			$(".tree-checkbox",$(this.selectedNodes[index].target)).removeClass("checked-selected");
			$("#tree").tree("uncheck",this.selectedNodes[index].target);
			this.selectedServerMoids.splice(index,1);
			this.selectedServerNames.splice(index,1);
			this.selectedNodes.splice(index,1);
			item.remove();
		}
		$("#selectedCount").text(this.selectedServerMoids.length);
	},
	doSearchAction:function(){
		$("#tree").tree("reload");
	}
}
