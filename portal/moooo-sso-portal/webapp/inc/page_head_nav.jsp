<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<script id="cloud-names" type="text/html">
	{{each data as cloudModelInfo i}}
		<span class="li">
			<span class="check-hook-content">
				<span id="{{cloudModelInfo.virMachineroomMoid}}" class="mo-icons-bg check-hook active" ></span>
            </span>
            <a class="li-a" value="{{cloudModelInfo.virMachineroomMoid}}" href="javascript:"  onclick="cloudClick(this)">{{cloudModelInfo.cloudModelName}}</a>
       </span>
    {{/each}}
</script>
<div class="head-nav-bg-temp"></div>
<div id="header" class="hd-main clearfix">
	<!-- 科达视讯（摩云视讯）和电信（阿里云电信和DX6000电信）有区别 -->
	<a id="header_title_logo" class="sys-info" href="<c:url value='/home' />"></a>
	<div class="info">
		<div class="public-private-cloud-content" style='<c:if test="${ currentuser.cloudModelDisplay=='0'}">display:none</c:if>' >
			<span class="cloud-name" value="${currentuser.virMachineroomMoid}">${currentuser.cloudModelName}</span>
			<span class="mo-icons-bg arrow"></span>
            <div class="public-private-cloud pulldown" style="display:none;">
            	<div class="pullDownContent">
                            
                 </div>
            </div>
         </div>
         <a class="info-i user-info" title="${(fn:escapeXml(currentuser.name) != null && fn:escapeXml(currentuser.name) != '')? fn:escapeXml(currentuser.name) : currentuser.account}">
            <img class="user-portrait hidden" data-onerror="${RESOUCE_STATIC_URL}/images/avator.png?v=1"/>
		    <span class="user-name ${currentuser.name }"><c:out value="${(currentuser.name != null && currentuser.name != '')? currentuser.name : currentuser.account}"/></span>
         <a>
         <div class="setting-wrapper">
         	<div class="settings">
         		<a class="email  mo-icons-bg"></a>
         		<a class="setting  mo-icons-bg"></a>
         		<a class="logout  mo-icons-bg" href="<c:url value='/loginout' />"></a>
         	</div>
         	<div class="pulldown setting-list" style="display:none">
         		<div class="contentlist">
	                <span class="li">
	                    <a id="modifyUser" class="nav-tab-item" href="set#profile">个人设置</a>
	                </span>
                    <span class="li">
                        <a id="modifyPortrait" href="set#portrait" class="nav-tab-item">头像</a>
                    </span>
                    <span class="li">
                        <a id="modifyPassword" class="nav-tab-item" href="set#password">修改密码</a>
                    </span>
					<span class="li"> 
					  	<a id="help" target="_blank">帮助信息</a>
					</span> 
					<span class="li">
                         <a id="about">关于</a>
                     </span>
                     <c:if test="${show_sh == '1'}">
	                     <%@ include file="system_linux.jsp"%>
		             </c:if>
                </div>
            </div>
         </div>
    </div>
</div>
<script>
	var userMoid = "${currentuser.moid}";
	var cloudModelInfo = ${cloudModelInfo};
	var cloudData = {data:cloudModelInfo}
	var cloudInfoHtml = template('cloud-names',cloudData);
	$(".pullDownContent",".public-private-cloud").html(cloudInfoHtml);	
	function cloudClick($this){
	    var text = $this.text
	    var value = $this.getAttribute("value")
	    var url = BP.config.SYSTEM_URL+"/system/user/updateCloudModel";
	    var data = {
	    		moid:userMoid,
	    		cloudModelName:	text,
	    		virMachineroomMoid:value
	    }
	    $.post(url,data,function(ret){
	    	if(ret.success){
	    		$(".cloud-name").text(text)
	            $(".cloud-name").attr("value",value)
	    	}
	    },'json').error(function(){
		})
	    
	}
</script>
