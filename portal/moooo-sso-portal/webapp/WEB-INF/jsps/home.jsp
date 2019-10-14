<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta name="others" content="login_page">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <%@ include file="/inc/page_common_head.jsp"%>
	<%@ include file="/inc/page_base_nav_menu_pop.jsp"%>
    <!-- Bootstrap core CSS -->
    <%--<link href="${RESOUCE_STATIC_URL}/css/home/bootstrap.min.css?t=6.0.967176735" rel="stylesheet">--%>
    <link href="${RESOUCE_STATIC_URL}/css/home/boot.css?t=6.0.576836589" rel="stylesheet">
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/css/home/common-portal-home.css?t=6.0.2627875745">
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/${sysBrand}/css/home.css?t=6.0.2615990444" />
    <link rel="stylesheet" href="${RESOUCE_STATIC_URL}/js/jlib/components/styles/css/mo-portal.min.css?t=6.0.112740787"/>

    <title></title>
    <!--头部子系统模块入口模板-->
    <script id="modules-content" type="text/html">
        <div class="modules" style="width: {{width}}px">
            {{each modules as module i}}
            <a class="module {{module.class_name}} {{module.show}}" {{if !!module.url}}href="{{module.url}}"{{/if}}>
                <div class="mo-icons-bg module-bg {{module.class_name}}"></div>
                <div class="module-name {{module.class_name}}">{{module.name}}</div>
            </a>
            {{/each}}
        </div>
    </script>
    <script id="cloud-names" type="text/html">
            {{each data as cloudModelInfo i}}
            <span class="li">
				<span class="check-hook-content">
					<span id="{{cloudModelInfo.virMachineroomMoid}}" class="mo-icons-bg check-hook active" ></span>
                </span>
                <a value="{{cloudModelInfo.virMachineroomMoid}}" class="li-a{{if publicAccess||cloudModelInfo.cloudModelType===1}}" onclick="cloudClick(this)"{{else}} disabled"{{/if}}>{{cloudModelInfo.cloudModelName}}</a>
            </span>
            {{/each}}
    </script>
    <!--面板模板-->
    <script id="row-content" type="text/html">
        <div class="col-md-4 {{contentId}} {{if isClear}}clear{{/if}}">
            <div class="content_panel {{contentId}}" {{if contentId=='resource_load'}}style="border:none"{{/if}}>
                {{if contentId=='resource_load'}}<div id="{{contentId}}_wrapper">{{/if}}
                <div class="header-div">
                    <ul class="header-titles {{if head_titles.length>1}}tab{{/if}}">
                        {{each head_titles as head_title i}}
                        <li class="header-title {{if head_titles.length>1&&i==0}}active {{else}} {{if head_titles.length==1}}one-title {{/if}}{{/if}}"><span class="title">{{head_title}}</span></li>
                        {{/each}}
                    </ul>
                    <ul class="header-titles header-more">
                        {{each head_more as mores i}}
                        <li class="header-title {{if (i==0&&contentId=='meeting_info')||(i==0&&contentId=='call_meeting_info')}}create-meeting-title-li{{/if}}">
							<span>
								{{if mores.more==='创建会议'&&(contentId==='meeting_info'||contentId==='call_meeting_info')}}<a href="{{mores.url}} " target="_blank" class="mo-icons-bg create-meeting "></a>{{/if}}
								{{if (i==0&&contentId=='platform_resource')}}<a href="javascript:void(0)"  class="mo-icons-bg isPersonalSetting no-checked"></a>{{/if}}
								<a class="{{if !((mores.more==='创建会议'&&contentId=='meeting_info')||(i==0&&contentId=='platform_resource')||(i==0&&contentId=='call_meeting_info'))}}more{{/if}}" href="{{mores.url}}" {{if !((mores.more==='创建会议'&&contentId=='meeting_info')||(i==0&&contentId=='platform_resource')||(i==0&&contentId=='call_meeting_info'))}}target="_blank"{{/if}}>{{mores.more}}</a>
								{{if (i==0&&contentId=='platform_resource')}}<a href="javascript:void(0)"  class="mo-icons-bg personalSetting "></a>{{/if}}
							</span>
						</li>
                        {{/each}}
                    </ul>
                </div>
                <div class="content-wrapper" id={{contentId}}>
                    <div class="no-data-wrapper">
                        <div class="no-data hidden">
                            <span class="mo-icons-bg warm-icon"></span>
                            <span class="warm-text">

                            </span>
                        </div>
                    </div>
                </div>
                {{if contentId=='resource_load'}}</div>
					{{if subscribe_alarm!=null}}
                	<div id="subscribe_alarm_wrapper">
                    	<div class="header-div">
                        	<ul class="header-titles">
                            	{{each subscribe_alarm.head_titles as head_title i}}
                            		<li class="resource-title header-title {{if head_titles.length>1&&i==0}}active {{else}} {{if head_titles.length==1}}one-title {{/if}}{{/if}}"><span class="title">{{head_title}}</span></li>
                            	{{/each}}
                        	</ul>
                        	<ul class="header-titles header-more">
                            	{{each subscribe_alarm.head_more as mores i}}
                            		<li class="resource-title header-title"><span><a href="{{mores.url}}" target="_blank">{{mores.more}}</a></span></li>
                            	{{/each}}
                        	</ul>
                    	</div>
                    	<div class="content-wrapper" id={{subscribe_alarm.contentId}}>
							<div class="no-data-wrapper">
                                <div class="no-data hidden">
                                    <span class="mo-icons-bg warm-icon"></span>
                                    <span class="warm-text">暂无订阅告警信息</span>
                                </div>
                            </div>
                    	</div>
                	</div>
					{{/if}}
					{{if book_meeting_count!=null}}
                	<div id="book_meeting_count_wrapper">
                    	<div class="header-div">
                        	<ul class="header-titles">
                            	{{each book_meeting_count.head_titles as head_title i}}
                            		<li class="resource-title header-title {{if head_titles.length>1&&i==0}}active {{else}} {{if head_titles.length==1}}one-title {{/if}}{{/if}}"><span class="title">{{head_title}}</span></li>
                            	{{/each}}
                        	</ul>
                        	<ul class="header-titles header-more">
                            	{{each book_meeting_count.head_more as mores i}}
                            		<li class="resource-title header-title"><span><a href="{{mores.url}}" target="_blank">{{mores.more}}</a></span></li>
                            	{{/each}}
                        	</ul>
                    	</div>
                    	<div class="content-wrapper" id={{book_meeting_count.contentId}}>

                    	</div>
                	</div>
					{{/if}}
                {{/if}}
            </div>
        </div>
    </script>
    <!--资源数据模板-->
    <script id="resource-content" type="text/html">
        <div class="resource-wrapper {{if resourceData.length==0}}none-border{{/if}}"  >
            <div class="resource-container" style="width:{{containerWidth}}px">
                {{each resourceData as data i}}
                <div class="resource-content">
                    <div class="item-resource-wrapper {{if i==0||(contentId=='resource_load'&&i==resourceData.length-1)}}active{{/if}}">
                        <div class="value-wrapper">
                            <span class="value {{if data.percent>=85}}moreThan85 {{else}}lessThan85 {{/if}}">{{data.percent}}</span><span class="unit">%</span>
						</div>
                        <div class="foot-title" title="{{data.name}}">
							<span id="{{data.moid}}" class="hidden resourceMoid">{{data.moid}}</span>
							<span class="foot-title-name">{{data.name}}</span>
                            {{if data.showInfo}}
                            <span class="mo-icons-bg resource_info"></span>
                            <div class="resource-load-info-wrapper">
                                <div class="resource-load-info-header">
                                    <span class="mo-icons-bg closed"></span>
                                </div>
                                <div class="resource-load-info-content">
                                    <div class="item-resource-info-wrapper">

                                    </div>
                                </div>
                            </div>
                            {{/if}}
                        </div>
                    </div>
                </div>
                {{if resourceData.length!=i+1}}
                <div class="cut-off-line"></div>
                {{/if}}
                {{/each}}
            </div>
        </div>
    </script>
    <script id="platform-resource-content" type="text/html">
        <div class="resource-wrapper {{if resourceData.length==0}}none-border{{/if}}"  >
            <div class="resource-container" style="width:{{containerWidth}}px">
                {{each resourceData as data i}}
                <div class="resource-content">
                    <div class="item-resource-wrapper {{if i==0||(contentId=='resource_load'&&i==resourceData.length-1)}}active{{/if}}">
                        <div class="value-wrapper">
                            <span class="value {{if data.percent>=85}}moreThan85 {{else}}lessThan85 {{/if}}">{{data.percent}}</span><span class="unit">%</span></div>
                        <div class="foot-title" title="{{data.name}}">
							<span id="{{data.moid}}" class="hidden resourceMoid">{{data.moid}}</span>
							<span class="hidden ip">{{data.ip}}</span>
							<span class="hidden machineRoomName">{{data.machineRoomName}}</span>
							<span class="hidden type">{{data.type}}</span>
							<span class="hidden frameName">{{data.frameName}}</span>
                            <span class="foot-title-name">{{data.name}}</span>
                            
                        </div>
                    </div>
                </div>
                {{if resourceData.length!=i+1}}
                <div class="cut-off-line"></div>
                {{/if}}
                {{/each}}
            </div>
        </div>
    </script>
    <script id="platform-resource-detail" type="text/html">
        <div class="platform-resource-detail"  >
            <div>
				<div class="server-li">
				<span class="server-item">
                <label>IP:</label><span class="server-detail">{{ip==''?'无':ip.split(";")[0]}}</span>
				</span>
				<span class="server-item">
				<label>服务器名称:</label><span class="server-detail">{{name==''?'无':name}}</span>
				</span>
				</div>
				<div>
				<span class="server-item">
                <label>所属机房:</label><span class="server-detail">{{machineRoomName==''?'无':machineRoomName}}</span>
				</span>
				<span class="server-item">
				<label>设备类型:</label><span class="server-detail">{{type==''?'无':type}}</span>
				</span>
				<span class="">
				<label>机框:</label><span class="server-detail">{{frameName==''?'无':frameName}}</span>
				</span>
				</div>
            </div>
        </div>
    </script>
    <!--资源负载详情模板-->
    <script id="resource-load-info" type="text/html">
        <div class="item-resource-info-content-wrapper {{if item_resource_data.length/3>2}}{{else}} {{if item_resource_data.length/3>1}}twoRow {{else}} oneRow {{if item_resource_data.length%3==1}} oneColumn {{else}}{{if item_resource_data.length%3==2}} twoColumn {{/if}}{{/if}}{{/if}}{{/if}}">
            {{each item_resource_data as item_resource i}}
            {{if i%3==0}}<div class="row ">{{/if}}
            <div class="item-resource-info-content {{if i%3!=0}}magrin-left-112{{/if}}">
                <div id="{{item_resource.id}}" class="pie"></div>
                <div id="{{item_resource.id}}_gray" class="pie gray-pie"></div>
                <div class="item-resource-info-detail">
                    <ul>
                        <li class="item-li item-name">{{item_resource.name}}</li>
                        <li class="item-li used-num">
                            <span class="item-title used">已使用</span>
                            <span class="item-value used {{if item_resource.used/item_resource.total>=0.85}}moreThan85{{else}} lessThan85{{/if}}">{{item_resource.used}}</span>
                        </li>
                        <li class="item-li total-num">
                            <span class="item-title">总数</span>
                            <span class="item-value">{{item_resource.total}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            {{if i%3==2||i==item_resource_data.length-1}}</div>{{/if}}
            {{/each}}
        </div>
    </script>
    <!--媒体资源负载详情模板-->
    <script id="media-resource-load-info" type="text/html">
        <div class="item-resource-info-content-wrapper oneRowMedia {{if item_resource_data[1].show}}twoColumnMedia{{else}}oneColumnMedia{{/if}}">
            <div class="row">
            {{each item_resource_data as item_resource i}}
                {{if item_resource.show}}
                <div class="item-resource-info-content magrin-left-142">
                    <div id="{{item_resource.id}}" class="pie pieMedia"></div>
                    <div id="{{item_resource.id}}_gray" class="pie gray-pie pieMedia"></div>
                    <div class="item-resource-info-detail">
                        <ul>
                            <li class="item-li item-name">{{item_resource.name}}</li>
                            <li class="item-li used-num">
                                <span class="item-title item-title-media">{{if i==0}}已召开数{{else}}已使用数{{/if}}</span>
                                <span class="item-value {{if item_resource.percent>=85}}moreThan85{{else}} lessThan85{{/if}}">{{item_resource.used}}</span>
                            </li>
                            <li class="item-li used-num">
                                <span class="item-title item-title-media">其他占用数</span>
                                <span class="item-value {{if item_resource.percent>=85}}moreThan85{{/if}}">{{item_resource.other}}</span>
                            </li>
                            <li class="item-li used-num">
                                <span class="item-title item-title-media">预计可{{if i==0}}召开{{else}}使用{{/if}}数</span>
                                <span class="item-value number-green">{{item_resource.available}}</span>
                            </li>
                            <li class="item-li total-num">
                                <span class="item-title item-title-media">总数</span>
                                <span class="item-value">{{item_resource.total}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {{/if}}
            {{/each}}
            </div>
        </div>
    </script>
    <!--图表模板-->
    <script id="graph-wrapper" type="text/html">
        <div class="graph-wrapper">
            <div class="graph-container">
				{{if contentId=='book_meeting_count'}}
					<div class="book_meeting_data_container">
						<ul>
							<li class="value-li"><span class="title">最大值</span><span class="book_meeting_value maxValue">{{max}}</span></li>
							<li class="value-li"><span class="title">最小值</span><span class="book_meeting_value minValue">{{min}}</span></li>
							<li class="value-li"><span class="title">平均值</span><span class="book_meeting_value averageValue">{{average}}</span></li>
						</ul>
					</div>
				{{/if}}
                <div id="{{contentId}}-graph" class="graph-content">

                </div>
                {{if contentId=='platform_resource'||contentId=='meeting_count'}}
                {{if contentId=='platform_resource'}}<div class="platform_resource_graph_value">{{}}</div>{{/if}}
                <div class="time-adjust-container">
                    <div class="time-minus-plus">
                        <span class="mo-icons-bg minus" onclick="minusTime('{{contentId}}')"></span>
                        <span class="time-title">时间</span>
                        <span class="mo-icons-bg plus" onclick="plusTime('{{contentId}}')"></span>
                    </div>
                </div>
                <div class="time-move-container">
                    <div class="time-left-move">
                        <div class="mo-icons-bg leftMove" onclick="leftMoveTime('{{contentId}}')"></div>
                    </div>
                    <div class="time-right-move">
                        <div class="mo-icons-bg rightMove hidden" onclick="rightMoveTime('{{contentId}}')"></div>
                    </div>
                </div>
                {{/if}}
            </div>
        </div>
    </script>
    <!--并发会议数量-最大值-最小值-平均值-->
    <script id="meeting-count-info" type="text/html">
        <div class="meeting-count-data-description description">
            <ul class="meeting-count-info-content {{id}}">
                <li class="description-item description-item-header">
                    <span class="description-blank count-tile"></span>
                    <span class="count-header-title name1"><span class="multi-point-title">{{title.name1}}</span> </span>
                    <span class="count-header-title name2"><span class="point-point-title">{{title.name2}}</span></span>
                    <span class="count-header-title name3"><span class="point-point-title sum-title">{{title.name3}}</span></span>
                </li>
                <li class="description-item maxCount">
                    <span class="count-title">{{maxData.name}}</span>
                    <span class="count-value name1">{{maxData.value1}}</span>
                    <span class="count-value name2">{{maxData.value2}}</span>
                    <span class="count-value name3">{{maxData.value3}}</span>
                </li>
                <li class="description-item minCount">
                    <span class="count-title">{{minData.name}}</span>
                    <span class="count-value name1">{{minData.value1}}</span>
                    <span class="count-value name2">{{minData.value2}}</span>
                    <span class="count-value name3">{{minData.value3}}</span>
                </li>
                <li class="description-item averageCount">
                    <span class="count-title">{{averageData.name}}</span>
                    <span class="count-value name1">{{averageData.value1}}</span>
                    <span class="count-value name2">{{averageData.value2}}</span>
                    <span class="count-value name3">{{averageData.value3}}</span>
                </li>
            </ul>
        </div>
    </script>
    <script id="VRS-live" type="text/html">
        <div class="vrs-live-container">
            {{each roomstate as data i}}
            {{if i < 6}}
            <div class="comm_video ">
                {{if data.livesnapshotpath && data.livesnapshotpath != ""}}
                <div class="comm_video_img" style="background: none">
                    <img src="{{data.livesnapshotpath | formatPath}}"  data-onerror="${RESOUCE_STATIC_URL}/images/home/default.png"  width="164" height="92"/>
                    <a class="comm_video_img_btn mo-icons-bg"></a>
					<div class="video-encrypt-icon">
					<a class="mo-icons-bg {{if data.encmode==2}} aes-icon {{else}}{{if data.encmode==4}} gm-icon {{/if}}{{/if}}"></a>
					</div>
                    <div class="comm_video_path">{{data.livestreampath}}</div>
                    {{if !data.livestreampath && data.livestreampath == ""}}
                    <div class="comm_video_img_IE">仅支持IE浏览器</div>
                    {{/if}}
                </div>
                {{else}}
                <div class="comm_video_img mo-icons-bg">
                    <a class="comm_video_img_btn mo-icons-bg"></a>
					<div class="video-encrypt-icon">
					<a class="mo-icons-bg {{if data.encmode==2}} aes-icon {{else}}{{if data.encmode==4}} gm-icon {{/if}}{{/if}}"></a>
					</div>
                    <div class="comm_video_path">{{data.livestreampath}}</div>
                    {{if !data.livestreampath && data.livestreampath == ""}}
                    <div class="comm_video_img_IE">仅支持IE浏览器</div>
                    {{/if}}
                </div>
                {{/if}}
                <ul>
                    <li class="comm_video_time">{{data.elapse | formatTime '00:00:00'}}</li>
                    <li class="comm_video_num">{{data.livestatnum | formatNum}}</li>
                    <li class="comm_video_viewImg mo-icons-bg"></li>
                </ul>
                <div class="comm_video_title" title="{{data.roomname}}">{{data.roomname}}</div>
                <div class="comm_video_prgid" style="display: none">{{data.prgid}}</div>
                <div class="comm_video_id" style="display: none">{{data.roomidstr}}</div>
                <div class="comm_video_ip" style="display: none">{{data.ip}}</div>
            </div>
            {{/if}}
            {{/each}}
        </div>
    </script>
    <script id="VRS-subscribe" type="text/html">
        <div class="vrs-living-container">
            {{each liveinfo as data i}}
            {{if i < 6}}
            <div class="comm_video">
                <div class="comm_video_forthcomImg mo-icons-bg">
					<div class="video-encrypt-icon">
						<a class="mo-icons-bg living {{if data.encmode==2}} aes-icon {{else}}{{if data.encmode==4}} gm-icon {{/if}}{{/if}}"></a>
					</div>
				</div>
                <ul>
                    <li class="comm_video_time">{{data.starttime}}</li>
                </ul>
                <div class="comm_video_title" title="{{data.confname}}">{{data.confname}}</div>
            </div>
            {{/if}}
            {{/each}}
        </div>
    </script>
	<script id="enterprise_introduce" type="text/html">
		        <p class="clearfix company_info">
		        	<!-- 公司名称-->
					<span class="companyName">{{companyName}}</span>
					<span class="copyright" >Copyright &copy;<span class="establishYear">{{establishYear}}</span><span class="version_year">${versionYear}</span><span class="companyDomainName">{{companyDomainName}}</span><span>.&nbspAll rights reserved.</span>
					<!-- 科达视讯无备案号 摩云视讯有备案号 阿里云电信有备案号 DX6000无备案号 -->
					<span class="icp">
						<a  href="{{icpInfoHref}}" target="_blank">{{icpInfoTxt}}</a>
					</span>				
	            </p>
	</script>
	<script id="platform-resource-wheel-btn" type="text/html">
		<div class="wheel-btn">
			{{each data as d i}}
				<span currentMoidListIndex="{{i}}" class="mo-icons-bg wheel-btn-{{i}} {{if i==activeIndex}}active{{/if}}"></span>
			{{/each}}
		</div>
    </script>
    <script id="license-warn-dialog" type="text/html">
		<div class="tipImage license-warn-image"></div>
		<div class="license-warn-info">
            {{if days > 0}}
                当前检测到授权许可与设备不匹配！<br>运行{{31-days}}天后授权将失效，请尽快恢复设备！
            {{else}}
                授权未导入或已失效！<br>会议功能无法使用，请重新导入授权！
            {{/if}}
            <div id="license-warn-checkbox"></div>
        </div>
    </script>
	<style>
		.icp a{
			color:#FFFFFF;
			margin-left:22px;
		}
		.icp a:hover{
		    color: #007ac0;
   			text-decoration: underline;
		}
	
	</style>
</head>
<body>
<div class="header-wrapper">
    <div class="header">
        <div class="sys-info-wrapper">
            <a id="header_title_logo" class="sys-info" href="./home">
            
            </a>
            <div class="header-info">
                <div class="public-private-cloud-content" style='<c:if test="${!!!currentuser.cloudModelDisplay}">display:none</c:if>' >
                    <span class="cloud-name" value="${currentuser.virMachineroomMoid}">${currentuser.cloudModelName}</span>
                    <span class="mo-icons-bg arrow"></span>
                    <div class="public-private-cloud pulldown" style="display:none;">
                        <div class="pullDownContent">
                            
                        </div>
                    </div>
                </div>
                <div class="user-info" titile="${(fn:escapeXml(currentuser.name) != null && fn:escapeXml(currentuser.name) != '')? fn:escapeXml(currentuser.name) : currentuser.account}">
                    <img class="user-portrait hidden" data-onerror="${RESOUCE_STATIC_URL}/images/avator.png?v=1"/>
                    <span class="user-name">${(fn:escapeXml(currentuser.name) != null && fn:escapeXml(currentuser.name) != '')? fn:escapeXml(currentuser.name) : currentuser.account}</span>
                </div>
                <div class="setting-wrapper">
                	<div class="seetings">
                        <a class="email nav-notify-item mo-icons-bg" id="nav-notify-item"><p></p></a>
	                    <a class="setting  mo-icons-bg"></a>
	                    <a class="logout  mo-icons-bg"></a>
                	</div>
                    <div class="pulldown email-list nav-sublist-notify" id="nav-sublist-notify">
                        <div class="pullDownContent nav-notify-wrap">
                                <div class="menu-line-wrap title">
                                    <span class="text">通知消息</span>
                                    <a class="clear" action-type="clearMeetingNotify">清空</a>
                                </div>
                                <div class="notify-loading clearfix"><span>加载中，请稍候...</span></div>
                                <div class="nav-notify-content">
                                    <ul class="nav-sublist-list nav-meeting-notify-list"></ul>
                                </div>
                        </div>
                    </div>
                    <div class="pulldown setting-list" style="display:none;">
		                <div class="pullDownContent">
		                    <span class="li" style="display:none;">
                                <a id="jmsConfig" class="nav-tab-item">设置向导</a>
                            </span>
		                    <span class="li">
		                        <a id="modifyUser" href="javascript:" >个人设置</a>
		                    </span>
		                    <span class="li" <c:if test="${domaintype == 0}">style="display:none;"</c:if>>
		                        <a id="modifyPortrait" href="javascript:">头像</a>
		                    </span>
		                    <span class="li">
		                        <a id="modifyPassword" href="javascript:">修改密码</a>
		                    </span>
		                    <span class="li">
		                        <a id="help" href="${RESOUCE_STATIC_URL}/${sysBrand}/help/default.html" class="li-a" target="_blank">帮助信息</a>
		                    </span>
		                    <span class="li">
		                        <a id="about" href="javascript:">关于</a>
		                    </span>
		                    <c:if test="${show_sh == '1'}">
			                     <%@ include file="/inc/system_linux.jsp"%>
		                    </c:if>
		                </div>
                	</div>
                </div>
                
            </div>
        </div>
        <div class="module-entry-wrapper"></div>
    </div>
</div>
<main role="main">
    <div class="container">
        <div class="row" id="row">

        </div>
        <div id="moidList" class="hidden"></div>
    </div>
    <div class="no-main-panel">
        <div class="no-data">
            <span class="mo-icons-bg warm-icon"></span>
            <span class="warm-text">暂无内容</span>
        </div>
    </div>
</main>
<div id="footer" class="clearfix">
    <div class="footer_content">
    </div>
</div>
<%-- <script src="${RESOUCE_STATIC_URL}/js/jlib/jquery.min.js?t=6.0.2182109551"></script> --%>

<script src="${RESOUCE_STATIC_URL}/js/jlib/jquery.easyui.min.js?t=6.0.2501531710"></script>
<script src="${RESOUCE_STATIC_URL}/js/jlib/echarts.min.js?t=6.0.2692493846"></script>
<script src="${RESOUCE_STATIC_URL}/js/jlib/components/mo-portal.min.js?t=6.0.2184442885"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/home.js?t=5.2.2722389346"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/controller.js?t=6.0.133564478"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/events.js?t=6.0.909632798"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/event.js?t=6.0.1442163845"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/initTemplate.js?t=6.0.2490832047"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/drawGraph.js?t=6.0.3537542513"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/panels/panel.js?t=6.0.3363915707"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/panels/meetingCountPanel.js?t=6.0.2733153060"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/panels/platformResourcePanel.js?t=6.0.1086334492"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/panels/meetingCalendarPanel.js?t=6.0.3659021699"></script>
<script src="${RESOUCE_STATIC_URL}/js/home/header-email.js?t=6.0.3480032774"></script>


<script type="text/javascript">
	Mo.common.aboutInit(Mo.CompanyInfo); 
	Mo.common.homeInit(Mo.CompanyInfo);
	var passwordExpire = "${passwordExpire}";
    var sysmode ="${sysmode}"=='1'?'buildSelf':'rent';//bulidSelf、rent
    var domainType = '${domaintype}'=='1'?'platformDomain':'coreDomain';//platformDomain coreDomain
    var userDomainMoid = "${currentuser.userDomainMoid}";
    var userMoid = "${currentuser.moid}";
    var serviceDomainMoid = "${currentuser.serviceDomainMoid}"
    var currentDateStr = new Date().toDateString();
    var isUserDomainAdmin = ${isUserDomainAdmin?true:false};
    var isServiceDomainAdmin = ${isServiceDomainAdmin?true:false};
    var isUsualUser = ${isUsualUser?true:false};
    var enableMeeting = ${currentuser.enableMeeting};
    var meetingAdmin = ${currentuser.meetingAdmin};
    var enableNM = ${currentuser.enableNM};
    //var sso_cookie= "${SSO_COOKIE_KEY}";
    //var vrsSsoCookie = envent.base64encode(envent.utf16to8("sso_token="+sso_cookie));
    var moid = isServiceDomainAdmin?serviceDomainMoid:(isUserDomainAdmin?userDomainMoid:userMoid);
    var vrsIp = "${vrsIP}";
    var kisIp = '${kisIP}';
    var cbsShow = '${cbsShow}' === '1';
    var domsShow = '${domsShow}' === '1';
    var jmsConfigGuideUrl = '${jmsConfigGuideUrl}';
    var isSimpleMcu = '${jmsType}'==='1'?true:false;
    var licenseInvalidWarn = '${licenseInvalidWarn}';
    var portrait = '${currentuser.portrait40}';
    var portraitDomain = '${portraitDomain}';
    if(isSimpleMcu){
        domainType = 'jmsDomain';
    }

    /*test数据*/
    //var isSimpleMcu = true;
    //var isUserDomainAdmin = false;
    //var isServiceDomainAdmin = true;
    //var moid = "mooooooo-oooo-oooo-oooo-topdoooomain";
    //var moid = "8o65ossdose061anmahaoilp";
    
    var adminData = {//管理员界面主体的模板数据
        resource_load:{
            head_titles:["资源负载"],
            contentId:"resource_load",
            resourceData: [
                {name: "虚拟会议室资源", percent: 0, showInfo: false},
                {name: "会议并发接入终端数AP", percent: 0},
                {name: "媒体终端授权数MP", percent: 0},
                {name: "媒体资源", percent: 0, showInfo: false}
            ],
            head_more:[{more:"更多",url:"/nms/home/?path=platformdevice&domainMoid="+moid}],
            subscribe_alarm:{
                head_titles: ["订阅告警"],
                contentId:"subscribe_alarm",
                head_more:[{more:"更多",url:"/nms/home/?path=unrepairedwarning&domainMoid="+moid}],
            },
            isClear:false,
        },
        platform_resource:{
            head_titles:["平台CPU资源","平台内存资源"],
            contentId:"platform_resource",
            resourceData:[
                
            ],
            head_more:[{more:"显示自定义服务器",url:"javascript:void(0)"},{more:"更多",url:"/nms/home/"}],
            containerWidth:535,
            isClear:false,
        },
        meeting_count:{
            head_titles:["并发会议统计","并发会议在线终端统计","终端在线统计"],
            head_more:[{more:"更多",url:"/nms/home/?path=history_meeting&type=multi&domainMoid="+moid}],
            contentId:"meeting_count",
            isClear:false,
        },
        book_meeting_count:{
            head_titles:["预约会议并发统计"],
            contentId:"book_meeting_count",
            max:0,
            min:0,
            average:0,
            isClear:false,
        },
        meeting_info:{
            head_titles:["正在召开的会议","预约的会议","历史会议"],
            head_more: [{ more: '创建会议', url: '${createMeetingUrl}' }, { more: '更多', url: ('coreDomain'!==domainType?'/meeting/mcc':(isUserDomainAdmin ? '/nms/home/?path=realtime_meeting' : '/nms/home/?path=appointment_meeting')) }],
            contentId:"meeting_info",
            datagridIds:['call_meeting_info','book_meeting_info','past_meeting_info'],
            isClear:false,
        },
        meeting_category_info:{
            head_titles:["传统会议","端口会议","点对点会议"],
            head_more:[{more:"更多",url:"/nms/home/?path=realtime_meeting&type=tran&domainMoid="+moid}],
            contentId:"meeting_category_info",
            isClear:!(isServiceDomainAdmin || (isSimpleMcu && isUserDomainAdmin)),
        },
        live_room: {
            head_titles: ["直播室"],
            head_more: [
                {more:"全部",url:"allLiveRooms?type=live"},
                {more:"更多",url:"//"+"${vrsIP}"+"${menu.liveUrl}"}
            ],
            contentId:"live_room",
            isClear:false,
        },
        living:{
            head_titles:["即将直播"],
            head_more: [
                {more:"全部",url:"allLiveRooms?type=appointment"},
                {more:"更多",url:"//"+"${vrsIP}"+"${menu.livingUrl}"}]
            ,
            contentId:"living",
            isClear:false,
        }
    };
    var userData = {//一般用户界面的主体模板数据
            call_meeting_info:{
                head_titles:["正在召开的会议"],
                contentId:"call_meeting_info",
                head_more:[{more:"创建会议",url:"${createMeetingUrl}"},{more:"更多",url:"/meeting/mcc"}],
                isClear:false,
            },
            book_meeting_info:{
                head_titles:["预约的会议"],
                contentId:"book_meeting_info",
                head_more:[{more:"更多",url:"/meeting/meeting/meetingList"}],
                isClear:false,
            },
            past_meeting_info:{
                head_titles:["历史会议"],
                contentId:"past_meeting_info",
                head_more:[{more:"更多",url:"/meeting/meeting/historyMeeting"}],
                isClear:false,
            },
            live_room: {
                head_titles: ["直播室"],
                head_more: [{more:"更多",url:"//"+"${vrsIP}"+"${menu.liveUrl}"}],
                contentId:"live_room",
                isClear:false,
            },
            living:{
                head_titles:["即将直播"],
                head_more: [{more:"更多",url:"//"+"${vrsIP}"+"${menu.livingUrl}"}],
                contentId:"living",
                isClear:false,
            }
        };
    var panelData = isUsualUser?userData:adminData;
    var systemMoudelData={//顶部子系统模块的模板数据
   		'weibo':{
   			name:'社交网络SNS',
            value:${currentuser.enableWeibo},
            show:'',
            url:"${menu.weiboUrl}"
   		},
        'bmc':{
            name:'业务管理系统',
            value:${currentuser.enableBMC},
            show:'',
            url:"${menu.bmcUrl}"
        },
        'amc':{
            name:'账号管理系统',
            value: ${currentuser.userDomainAdmin},
            show:'',
            url:"${menu.amcUrl}"
        },
        'nms':{
            name:'网管系统',
            value:enableNM,
            show:'',
            url:"${menu.nmUrl}"
        },
        'jms':{
            name:'配置管理',
            value: isSimpleMcu ? ${currentuser.userDomainAdmin} : ${currentuser.moid=='mooooooo-oooo-oooo-oooo-defaultadmin'?true:false},
            show:'',
            url: isSimpleMcu ? '${menu.sjmsUrl}' : '${menu.jmsUrl}'
        },
        'cmc':{
            name:'会议管理系统',
            value:${currentuser.moid!='mooooooo-oooo-oooo-oooo-bmcdebugger' && currentuser.moid!='mooooooo-oooo-oooo-oooo-bmcdeveloper'},
            show:'',
            url:"${menu.meetingUrl}"
        },
        'vrs':{
            name:'会议录播系统',
            value:${!!vrsShow}&&${!!currentuser.enableVRS},
            show:'',
            url:"//${vrsIP}/index.html"
        },
        'live':{
            name:'会议直播系统',
            value:${!!vrsShow}&&${!!currentuser.enableLive},
            show:'',
            url:"//${vrsIP}/index.html"
            
        },
        'umc':{
            name:'网呈管理系统',
            value:${enableNexvision},
            show:'',
            url:'${menu.umcUrl}?ip='+'${tpsIP}'
        },
        'vrs_live':{
            name:'',
            value:'',
            show:'',
            url:''
        },
        'kis':{
            name:'智能会议平台',
            value:${currentuser.enableKIS},
            show:'',
            url:kisIp?'//${kisIP}/index.html':'${menu.kisUrl}'
        },
        'doms':{
            name:'大数据运维系统',
            value:domsShow,
            show:'',
            url:'${menu.domsUrl}'
        },
        'cbs':{
            name:'大数据管理系统',
            value:cbsShow,
            show:'',
            url:'${menu.cbsUrl}'
        }
    };
    
    //initTemplate.initHomeTemplate();
    initHome.init();
    envent.initEvent(); 
    var cloudModelInfo = ${cloudModelInfo};
    var cloudData = {data:cloudModelInfo,publicAccess:${!!currentuser.enablePublicCloudAccess}};
	var cloudInfoHtml = template('cloud-names',cloudData);
	$(".pullDownContent",".public-private-cloud").html(cloudInfoHtml);
    function cloudClick($this){
        var text = $this.text
        var value = $this.getAttribute("value")
        var origText = $(".cloud-name").text();
        var origValue = $(".cloud-name").attr("value");
        var url = BP.config.SYSTEM_URL+"/system/user/updateCloudModel";
        var data = {
        		moid:userMoid,
        		cloudModelName:	text,
        		virMachineroomMoid:value
        }
        if(text!=origText&&value!=origValue){
	        $.post(url,data,function(ret){
	        	if(ret.success){
	        		$(".cloud-name").text(text)
	                $(".cloud-name").attr("value",value)
	        	}
	        },'json').error(function(){
			})
        }
    }
    $(document).ready(function(){
        SSO.common.setDefaultImg('.user-info');
        SSO.common.initPortrait(portrait, portraitDomain);
    	if(!!passwordExpire){
    		passwordExpire = parseInt(passwordExpire)
    		if(passwordExpire > -1){
        		Mo.confirm('您的密码有效期剩余'+passwordExpire+'天，是否进行密码修改？',function(bool){
        			if(!!bool){
        				window.location.href='set#password';
        			}
        		},'修改密码');
        	}
    	}
   		$("#footer").css("position","relative");
   		if(window.innerHeight-$("main").outerHeight()-$(".header-wrapper").outerHeight(true)>103){
    		$("main").height(window.innerHeight-103-$(".header-wrapper").outerHeight(true))
    	}
        $(window).on("resize",function(){
	    	if(window.innerHeight-$("main").outerHeight()-$(".header-wrapper").outerHeight(true)>103){
	    		$("main").height(window.innerHeight-103-$(".header-wrapper").outerHeight(true))
	    	}
    	});
    	$(".logout").on("click",function(){
        	clearInterval(controller.refreshId);
            clearInterval(controller.resoureLoadId);
            for(var attr in controller.ajaxRequestArray){
            	if(controller.ajaxRequestArray[attr]!=null){
            		controller.ajaxRequestArray[attr].abort();
            	}
            }
            location.href = BP.config.SYSTEM_URL+"/loginout";
        });

        if(isSimpleMcu){
            var jmsConfigLink = $('#jmsConfig');
            if(!!jmsConfigGuideUrl){ //如果jmsConfigGuideUrl为空，false，null或undefined
                jmsConfigLink.attr('href',jmsConfigGuideUrl);
                jmsConfigLink.parent().show();
            }
        }
        
        if ((isServiceDomainAdmin || meetingAdmin || (isSimpleMcu && isUserDomainAdmin)) && '1' !== licenseInvalidWarn) {
            $.getJSON(Mo.Config.appUrl + '/checkLicenseIsInvalid', function (msg) {
                if (msg.success) {
                    var data = msg.data;
                    if (typeof data === 'number' && data >= 0) {
                        Portal.Dialog({
                            id: 'licenseWarn',
                            content: template('license-warn-dialog',{days:data}),
                            okBtn: false,
                            cancelText: '关闭',
                            cancelFn: function () {
                                if (licenseWarnCheckbox.getValue()) {
                                    $.post(Mo.Config.appUrl + '/saveLicenseWarnStatus', function () { }, 'json');
                                }
                            },
                        });
                        var licenseWarnCheckbox = Portal.Checkbox('#license-warn-checkbox', {
                            name: 'licenseWarnCheckbox',
                            data: {
                                id: "licenseWarnCheckbox",
                                name: "今日不再提醒",
                                value: "0"
                            }
                        });
                    }
                }
            });
        }
    });
</script>
</body>
</html>
