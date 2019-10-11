<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
 <head>
  <title>自定义服务器设置</title>
  <!-- 通用部分 -->
  
  <!-- 插件部分 -->
  <%@ include file="/inc/page_common_head.jsp"%>
  <!-- detail部分 -->
  <!-- 本地 -->
  <script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/home/selectPersonalServers.js?t=6.0.388979598"></script>
  <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/css/home/selectPersonalServer.css?t=6.0.3832892181" />
 </head>

<script>
$(function(){
	Mo.SelectPersonalServers.init();
});
</script>
 <style>

 .treeWrapper .tree-title{
	 display: inline-block;
	 width:118px;
	 overflow: hidden;
	 text-overflow:ellipsis;
	 white-space: nowrap;
	 vertical-align: top;
 }
 </style>
<body>
	<div id="dialogWrapper">
		<div class="dialog-content">
			<div class="title">
				<span class="dialogTitle" style="font-size:11px; color:#4e4e4e;">自定义服务器设置</span>
				<a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
			</div>
			<div class="separater"></div>
			<div class="info" style="overflow: hidden;">
				<div style="width: 100%;">
					<div class="infoArea">
                        <div class="mo-simple-search search-user-search" style="width:240px;">
                            <input type="text" id="searchAction" name="searchAction" style="width:240px;" class="mo-simple-search-input" placeholder="请输入关键词搜索" />
                            <a id="searchActionBtn" class="mo-simple-search-icon" ></a>
                        </div>
						<div style="width: 100%;float: left;overflow: hidden;">
							<div class="treeWrapper" style="width: 270px; height: 301px; overflow: auto; margin:14px 9px;">
									<ul id="tree"></ul>
							</div>
						</div>
					</div>
					<div style="width: 30px; float: left; margin: 75px 13px; vertical-align: middle; text-align: center;">
						<div id="selectAll" class="btn-operation mo-icon30 mo-icon-select-all"></div>
						<div id="selectItem" class="btn-operation mo-icon30 mo-icon-select2-right"></div>
						<div id="removeItem" class="btn-operation mo-icon30 mo-icon-remove2-left"></div>
						<div id="removeAll" class="btn-operation mo-icon30 mo-icon-remove-all"></div>
					</div>
					<div class="infoArea">
						<div class="search-bar" style="margin: 0 5px; line-height: 34px; vertical-align: middle;color:#4e4e4e;">已选  <span id="selectedCount" style="font-weight:bold;">0</span></div>
						<div class="separater" style="margin:0;"></div>
						<div class="selectedWrapper" style="height: 315px; margin:7px 9px; overflow: auto; line-height: 22px;">
							<div id="selectedContainer" style="width: 235px;">
								<ul class="selections" >
								</ul>
							</div>
						</div>
					</div>
					<div style="width: 30px; float: left; margin: 75px 13px; vertical-align: middle; text-align: center;">
						<div id="upTop" class="btn-operation mo-icon30 mo-icon-move-upTop"></div>
						<div id="up" class="btn-operation mo-icon30 mo-icon-move-up"></div>
						<div id="down" class="btn-operation mo-icon30 mo-icon-move-down"></div>
						<div id="downBottom" class="btn-operation mo-icon30 mo-icon-move-downBottom"></div>
					</div>
				</div>
				<div class="item-msg">
					<div class="msg"></div>
				</div>
			</div>
			<%--<div class="tipMsg">可使用ctrl或shift快捷键进行多选</div>--%>
			<div class="btn-wrapper">
				<a id="detail-btn-ok" class="mo-btn-gray confirm mo-btn-x mo-btn-x-left" >确定</a>
				<a id="detail-btn-cancel" class="mo-btn-gray cancel mo-btn-x">取消</a>
			</div>
		</div>
	</div>
</body>
</html>
