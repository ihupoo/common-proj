import Store from '@/store';
import { Mask } from '@/components/loading';
import TemplateDialog from './dialog.art';
import { fetchSavePersonalList } from './server';

import '@/lib/easyui/1.8.5/themes/icon.css';
import '@/lib/easyui/1.8.5/themes/default/easyui.css';
import '@/lib/easyui/1.8.5/jquery.easyui.min.js';
import '@/lib/easyui/1.8.5/locale/easyui-lang-zh_CN.js';
import '@/styles/reset-easyui.scss';

import './dialog.scss';

let options = {
    moidList: [],
    treeUrl: ''
}

const SelectPersonalServers = {
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
	//todo
	showTree:function(){
		this.selectedServerMoids = options.moidList.split(",")
		let that = this;
		Mask.show();
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
				Mask.hide();
			},
			loadFilter:function(node,el){
			   let data = node.data;
               let searchText = null;
                //得到搜索关键字
                let searchCtrl = $("#searchAction");
                searchText = searchCtrl.val().toLowerCase();
                if(searchCtrl.attr('mo-hint') == searchText){
                    searchText = ''; 
                }
                let searchfunc = function(data){
                    if(!data || !data.text) return false;
                    if(data.type!="service"&&data.type!="kernel"){
                    	let index = that.selectedServerMoids.indexOf(data.attributes.moid);
    					if(index==-1){
    						data.checked = false;
    					}else{
    						data.checked = true;
    					}
    				}
                    let exist = data.text && data.text.toLowerCase().indexOf(searchText) != -1 ;
                    if(data.children){
                        for(let i=0,len = data.children.length; i < len ; ++i){
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
                if(searchText != null && data != null && !searchfunc(data[0])) return [];
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
			let selectedAllNodes = $("#tree").tree("getChecked");//非排序过的；
			let selectedNodes = [];
			
			for(let i = 0;i < selectedAllNodes.length; i++){
				if(selectedAllNodes[i].attributes.type != "service" && selectedAllNodes[i].attributes.type != "kernel"){
					let index  = this.selectedServerMoids.indexOf(selectedAllNodes[i].attributes.moid);
					if(index>=0){
						selectedNodes[index] = selectedAllNodes[i];
					}
					$(".tree-checkbox",$(selectedAllNodes[i].target)).addClass("checked-selected");
					
				}
			}
			this.selectedServerMoids = [];
			for(let i = 0; i<selectedNodes.length;i++){
				let seletedItem = "<li><a id='"+selectedNodes[i].attributes.moid+"'"+" class='mo-select-item'>"+selectedNodes[i].attributes.name+"</a></li>";
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
			let selectedAllNodes = $("#tree").tree("getChecked");
			for(let i = 0;i < selectedAllNodes.length; i++){
				if(selectedAllNodes[i].attributes.type != "service" && selectedAllNodes[i].attributes.type != "kernel"){
					$(".tree-checkbox",$(selectedAllNodes[i].target)).addClass("checked-selected");
				}
			}
		}
		
		this.initSelectedEvent();
	},
	initButtonEvent:function(){
		$("#detail-btn-ok").click(function(){// 确定
			let items = $("div#selectedContainer ul li a");
			let sortedSelectedIds = [];
			for(let i = 0;i<items.length;i++){
				sortedSelectedIds.push($(items[i]).attr("id"));
			}
			let result = {// 设置返回值并关闭对话框
					action : "ok",
					selectedIds : sortedSelectedIds.join(","),
			};
			$.dialog.data("result", result);
			$.dialog.close();
		});
		
		
		$("#detail-btn-cancel").click(function(){// 取消
			let result = {
				action : "cancel"
			};
			$.dialog.data("result", result);
			$.dialog.close();
		});
		
		
		$(".w-close").click(function(){// 关闭对话框
			let result = {
				action : "close"
			};
			$.dialog.data("result", result);
			$.dialog.close();
		});
	},
	initSearchEvent:function(){
		let that = this;
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
		let that = this;
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
		if(flag){
			let allNodes = $("#tree").tree("getChildren",$("#tree").tree("getRoot"));
			for(let i = 0;i<allNodes.length;i++){
				if(this.selectedServerMoids.indexOf(allNodes[i].attributes.moid)==-1&&allNodes[i].attributes.type!='service'&&allNodes[i].attributes.type!='kernel'){
					this.selectedServerMoids.push(allNodes[i].attributes.moid);
					this.selectedServerNames.push(allNodes[i].text);
					this.selectedNodes.push(allNodes[i]);
					$("#tree").tree("check",allNodes[i].target);
					$(".tree-checkbox",$(allNodes[i].target)).addClass("checked-selected");
					let seletedServer = "<li><a id='"+allNodes[i].attributes.moid+"'"+" class='mo-select-item'>"+allNodes[i].text+"</a></li>";
					$(".selections").append(seletedServer);
				}
			}
		}else{
            let allNodes = $("#tree").tree("getChecked");
			for(let i = 0;i<allNodes.length;i++){
				if(this.selectedServerMoids.indexOf(allNodes[i].attributes.moid)==-1&&allNodes[i].attributes.type!='service'&&allNodes[i].attributes.type!='kernel'){
					this.selectedServerMoids.push(allNodes[i].attributes.moid);
					this.selectedServerNames.push(allNodes[i].text);
					this.selectedNodes.push(allNodes[i]);
					$("#tree").tree("check",allNodes[i].target);
					$(".tree-checkbox",$(allNodes[i].target)).addClass("checked-selected");
					let seletedServer = "<li><a id='"+allNodes[i].attributes.moid+"'"+" class='mo-select-item'>"+allNodes[i].text+"</a></li>";
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
			for(let i = 0;i<this.selectedNodes.length;i++){
				if(this.selectedNodes[i].target!=undefined){
					$("#tree").tree("uncheck",this.selectedNodes[i].target);
				}
			}
			this.selectedServerMoids = [];
			this.selectedServerNames = [];
			this.selectedNodes = [];
		}else{
			let items = $("div#selectedContainer ul li a.active");
			let that = this;
			for(let i = 0;i<items.length;i++){
				let item = $(items[i]);
				let index = this.selectedServerMoids.indexOf(item.attr("id"),0);
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
			let selectedItems = $(".mo-select-item.active");
			for(let i = 0;i<selectedItems.length;i++){
				$(selectedItems[i]).parent().prev().before($(selectedItems[i]).parent());
			}
		}
	},
	downBottom:function(flag){
		if(flag){
			$(".selections").append($(".mo-select-item.active").parent());
		}else{
			let selectedItems = $(".mo-select-item.active");
			for(let i = selectedItems.length-1 ;i>=0; i--){
				$(selectedItems[i]).parent().next().after($(selectedItems[i]).parent());
			}
		}
	},
	initSelectedEvent:function() {
		let that = this;
		let items = $("div#selectedContainer ul li a");
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
			let index = this.selectedServerMoids.indexOf(item.attr("id"),0);
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

/*跳转到自定义服务器设置弹出框*/
export function showPersonalDialog(moidList, callback) {
    const { BASE_URL } = Store.getState()
    options.moidList = moidList
    options.treeUrl = BASE_URL + "/custom/physicalServerTree?type=CPU"

    const content = TemplateDialog({})
    $.dialog({
        padding: 0,
        title: "自定义服务器设置",
        id: "selectServerDialog",
        content,
        lock: true,
        opacity: 0.50,	// 透明度
        cancel:false, // 隐藏关闭按钮
        drag: false, // 不允许拖拽
        width: 720,
        height: 520,
        close: function () {
            // 如果是确定事件
            let result = $.dialog.data('result');
            if (result != undefined && result.action == 'ok') {
                let servers = result.selectedIds;
                fetchSavePersonalList(servers).then(mList => callback(mList))
            }
        },
    });

    SelectPersonalServers.init()

}
