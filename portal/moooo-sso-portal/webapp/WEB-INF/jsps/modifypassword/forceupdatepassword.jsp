<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta name="others" content="login_page">
<%@ include file="/inc/page_common_head.jsp"%>
<title></title>
<!-- <title>科达视讯云-统一管理中心</title>
<title>摩云视讯-统一管理中心</title>
<title>新视通（4G版）-统一管理中心</title> -->
<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/fileuploader-min.css?t=6.0.1517919198" />
<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/css/set.css?t=6.0.249790700" />
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/fileuploader.js?t=5.0.981451528"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/utils.js?t=6.0.2571896431"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/core-set.js?t=6.0.3778742882"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/home.js?t=6.0.4291316485"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/md5.min.js?t=6.0.3467134369"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/password.js?t=6.0.3033644830"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/browser-polyfill.min.js?t=6.0.299853946"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/sm.min.js?t=6.0.3747877542"></script>
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/digestAuth.min.js?t=6.0.444683133"></script>

<script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/home.js?t=5.2.2722389346"></script>
<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/${sysBrand}/css/home.css?t=6.0.2615990444" />
<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/css/password.css?t=6.0.3974162316" />

<style type="text/css">

a:link {
	color: #000000;
	text-decoration: none;
}

a:visited {
	color: #000000
}
.icp a{
 	font-family:"Microsoft Yahei";
 	color:#606060;
 	margin-left:22px;
 }
 .icp a:hover{
	color:#007ac0;
	text-decoration:underline;
 }
.meun-short {
	width: 775px;
	height: 82px;
	margin: 0 auto;
	overflow: hidden;
	float: left;
}

.menu-long {
	height: 82px;
	/*     text-align: left; */
	margin: auto;
}

#sys_nav .menu-long a {
	text-align: center;
	margin-left: 48px;
	margin-right: 48px;
}

.a_left {
	float: left;
	margin-top: 10px;
	visibility: hidden;
}

.a_right {
	float: left;
	margin-top: 10px;
	margin-left: 20px;
	visibility: hidden;
}

#sys_nav {
	margin: 0 auto;
	width: 900px;
}
.btn-wrapper .color-6{
       color : #616060
}
.hidden {
        display: none;
    }
.mo-btn-x-left {
        margin-right: 6px;
}
div.preview_div{
        overflow:hidden;
}

.about-content.mo-dialog-content{
	  padding-top: 0px;
	  padding-bottom: 0px;
	  padding-left: 16px;
	  padding-right: 16px;
}
.about-content.mo-dialog-content .title{
    margin-top: 0px;
}

.mo-dialog-content .info{
    margin-left: 34px;
    margin-right: 34px;
    margin-top: 0px;
}
#wrap{
	padding-bottom: 80px;
}
.about_x .about_netAddress1 {
	color: #007ac0;
    text-decoration: underline;
}
</style>
</head>
<body class="bg" id="wrap">
       <input type="hidden" id="moid" value="${currentuser.moid}"/>
       		 <div class="head-nav-bg-temp"></div>
             <div id="header" class="hd-main clearfix">
               	<!-- 科达视讯（摩云视讯）和电信（阿里云电信和DX6000电信）有区别 -->
	            <a id="header_title_logo" class="sys-info" href="<c:url value='/home' />"></a>
                <div class="info">
                  <a class="info-i user-info" title="${(fn:escapeXml(currentuser.name) != null && fn:escapeXml(currentuser.name) != '')? fn:escapeXml(currentuser.name) : currentuser.account}">
                   <img class="user-portrait hidden" data-onerror="${RESOUCE_STATIC_URL}/images/avator.png?v=1"/>
		           <span class="admin"><c:out value="${(fn:escapeXml(currentuser.name) != null && fn:escapeXml(currentuser.name) != '')? fn:escapeXml(currentuser.name) : currentuser.account}"/></span>
                  </a>
                </div>
          </div>
       
       <div id="wrap" class="clearfix wrapcontent">
	<div id="inner-main" class="inner-main">
	<div id="inner-main-content" class="inner-main-content">
        <div class="line"></div>
	  <div id="main-nav" class="main-nav">
		<ul>
			<li><a herf=""></a></li>
		</ul>
	  </div>
	  <div id="main-content">
		 <div class="set-content">
			<div class="detail-body" style="height:auto;">
				 <div class= "detail-content" style="margin-left:-429px;">
					 <form class="password-form" style="margin-left:50%;width: 429px;margin-top:30px;">
					 <ul id="editor-ui" >
					 <li class="data-li">
						<table style="table-layout:fixed">
						<tbody>
						  <tr>
							<td class="title" style="font-size:16px;font-weight:600">修改密码</td>
							<td class="input">
								<div  class="inputDiv">
									<input type="text" id="errMsg" name="errMsg" class="e-input" style="border:none;font-weight:600;color:red" readonly value="${description}<c:if test="${securityPolicy.passwordStrength==2}">密码等级应为中或者强。</c:if><c:if test="${securityPolicy.passwordStrength==3}">密码等级应为强。</c:if>" maxlength="16" />
								</div>
							</td>
							<td class="operate">
							</td>
						  </tr>
						</table>
					   </li>
					   <li class="data-li">
						<table style="table-layout:fixed">
						<tbody>
						  <tr>
							<td class="title">当前密码</td>
							<td class="input">
								<div  class="inputDiv">
									<input type="password" id="oldPassword" name="oldPassword" class="e-input item-old-password" value="" maxlength="16" />
									<span class="showHidePassword eye-bg"></span>
									<div class="capitals-tip displayNone" id="capital_oldPassword"><span>大写已开启</span></div>
								</div>
							</td>
							<td class="oldPasswordTip" style="vertical-align:middle">
								<div class="tipWrapper">
										<span class="tip-icon"></span>
										<span class="tip-info"></span>
								</div>
							</td>
							<td class="operate">
							</td>
						  </tr>
						</table>
					  </li>
					<li class="data-li">
						<table style="table-layout:fixed">
						<tbody>
						  <tr>
							<td class="title">新密码</td>
							<td class="input">
								<div  class="inputDiv">
									<input type="password" id="newPassword" name="newPassword" class="e-input item-new-password" value="" maxlength="16"/>
									<span class="showHidePassword eye-bg" ></span>
									<div class="text-tips displayNone">
										长度8-16个字符，包含数字、大小写字母、符号"_" "."
									</div>
									<div class="capitals-tip displayNone" id="capital_newPassword"><span>大写已开启</span></div>
								</div>
							</td>
							<td class="newPasswordTip">
								<div class="tipWrapper">
									<span class="tip-icon"></span>
									<span class="tip-info"></span>
									<a class="help displayNone">帮助</a>
									<div class="help-info displayNone">
										<ul>
											<li class="help-title">密码安全</li>
											<li class="weak-help help-li">
												<p>弱：包含数字或字母字符两种类型中的一种。</p>
												<p class="help-first">示例：66666666</p>
												<p class="help-none-first">aaaabbbccc</p>
											</li>
											<li class="medium-help help-li">
												<p>中：包含数字或字母或特殊字符三种类型中的两种。</p>
												<p class="help-first">示例：6342a423</p>
												<p class="help-none-first">1.1233.2</p>
												<p class="help-none-first">A123131</p>

											</li>
											<li class="strong-help help-li">
												<p>强：必须包含数字、字母和特殊字符三种类型。</p>
												<p class="help-first">示例：1231.1aA</p>
												<p class="help-none-first">1231.2a</p>
											</li>
										</ul>
									</div>
								</div>
							</td>
							<td class="operate">
							</td>
						  </tr>
						</table>
					  </li>
					  <li class="data-li">
						<table style="table-layout:fixed">
						<tbody>
						  <tr>
							<td class="title">确认密码</td>
							<td class="input">
								<div  class="inputDiv">
									<input type="password" id="confirmPassword" name="confirmPassword" class="e-input item-confirm-password" value="" maxlength="16"/>
									<span class="showHidePassword eye-bg" ></span>
									<div class="capitals-tip displayNone" id="capital_confirmPassword"><span>大写已开启</span></div>
								</div>
							</td>
							<td class="confirmPasswordTip">
								<div class="tipWrapper">
									<span class="tip-icon"></span>
									<span class="tip-info"></span>
								</div>
							</td>
							<td class="operate">
							</td>
						  </tr>
						</table>
					  </li>
					  <div class="operate" style="text-align:center;margin-top: 55px;">
							<div id="detail-btn-save" class="mo-btn-gray mo-btn-x mo-btn-x-left disabled">保存</div>
							<div id="detail-btn-cancel" class="mo-btn-gray mo-btn-x">取消</div>
					  </div>
					  </ul>
					  </form>	
					  			
				 </div>
			</div>
		 </div>
	  </div>
	 <div class="line"></div>  
</div>
</div>
    </div>
    <div id="footer" class="clearfix">
        <div class="footer_content">
           <p class="clearfix company_info keda">
				<span class="">苏州科达科技股份有限公司</span>
				<span class="" style="margin-left: 16px">Copyright &copy; 1995-<span class="version_year">${versionYear}</span> KEDACOM. All rights reserved.</span>
				<!-- 科达视讯无备案号 摩云视讯有备案号 阿里云电信有备案号 DX6000无备案号 -->
				<span class="displayNone icp movision" style="margin-left:22px;"><a  href="http://www.beian.miit.gov.cn/" target="_blank">苏ICP备12015396号-1</a></span>				
           </p>
          
           <p class="clearfix company_info telecom"  style="display:none">
				<span>中国电信视频服务产品（上海）运营中心</span>
				<span class="" style="margin-left: 16px">Copyright &copy;<span class="version_year">${versionYear}</span>. All rights reserved.</span>
				<span class="icp" style="margin-left:22px;"><a  href="http://www.beian.miit.gov.cn/" target="_blank">沪ICP备05000141号-15</a></span>				
           </p> 
        </div>
    </div>
    <%@ include file="/inc/page_base_nav_menu_pop.jsp"%>
  </body> 
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
  <script type="text/javascript">
  		var footerHtml = template('enterprise_introduce',Mo.CompanyInfo);
		$(".footer_content","#footer").html(footerHtml);
  		var username = "${username}";
  		Mo.Base.DigestAuth.realm = "${realmName}";
  		Mo.Base.DigestAuth.username = "${umoid}";
  		var systemSecurity = "${systemSecurity}";
  		var passwordStrengthOfSecurityPolicy = "${securityPolicy.passwordStrength}";
  		var nonce = "${nonce}";
  		var strengthRegular = ${strengthRegular};
		var portrait = '${currentuser.portrait40}';
		var portraitDomain = '${portraitDomain}';
        $(document).ready(function(){
		
        	//Mo.Set.init();
        	Mo.SetFrame.initCoreSetPage();
        	$(window).resize(function(){
        		Mo.SetFrame.initCoreSetPage();
                if($('#oldPassword').val()==''&&$('#newPassword').val()==''&&$('#confirmPassword').val()==''){
                    $("#detail-btn-save").addClass('disabled');
                }
        	});
        	if($('#oldPassword').val()==''&&$('#newPassword').val()==''&&$('#confirmPassword').val()==''){
                $("#detail-btn-save").addClass('disabled');
			}
			SSO.common.setDefaultImg('.user-info');
			SSO.common.initPortrait(portrait, portraitDomain);
       		$("#help").attr("href","${RESOUCE_STATIC_URL}/${sysBrand}/help/default.html");
       		Mo.common.homeInit(Mo.CompanyInfo);
       		Mo.common.aboutInit(Mo.CompanyInfo); 
       		var options = {
       				oldPasswordId:"#oldPassword",
       				newPasswordId:"#newPassword",
       				confirmPasswordId:"#confirmPassword",
       				strongAuthentication:true
       		}
       		Mo.Password.init(options);
       		Mo.Password.capitalTip("oldPassword")
       		Mo.Password.capitalTip("newPassword")
       		Mo.Password.capitalTip("confirmPassword");
       		$("#detail-btn-cancel").click(function(){
       			location.href = Mo.Config.appUrl+"/login";
       		})
       		$("#detail-btn-save").click(function(){
       			if($(this).hasClass("disabled")){
       				return ;
       			}
       			var securityPolicyObj = {"弱":1,"中":2,"强":3};
       			var newPasswordStrength = securityPolicyObj[$(".newPasswordTip .tip-info").text()];
       			
       			if(passwordStrengthOfSecurityPolicy!=""){
	       			if(newPasswordStrength<passwordStrengthOfSecurityPolicy){
	       				if(passwordStrengthOfSecurityPolicy==3){
	       					Mo.alert("密码等级必须为强");
	       				}
	       				if(passwordStrengthOfSecurityPolicy==2){
	       					Mo.alert("密码等级至少为中");
	       				}
						if(passwordStrengthOfSecurityPolicy==1){
							Mo.alert("密码等级至少为弱");
	       				}
						return ;
	       			}
       			}else{
       				Mo.alert("未获取到用户密码等级强度");
       				return ;
       			}
       			var url = Mo.Config.appUrl+"/modifypassword/reset";
       			if (Mo.Base.throttle.isLock(url)) {
    				return false;
    			}

    			Mo.Base.throttle.lock(url); // 正在处理中...
    			var data = {};
    			if('1'==systemSecurity){
    				data = Mo.Base.DigestAuth.makePassword($("#oldPassword").val(),$("#newPassword").val());
    			}else{
    				data = Mo.Base.DigestAuth.makePassword(hex_md5($("#oldPassword").val()),$("#newPassword").val());
    				var params = Mo.Base.DigestAuth.makePassword(hex_md5($("#oldPassword").val()),$("#oldPassword").val());
    				data['key'] = params['knonce']+'_'+params['ciphertext']+'_'+params['hmac'];
    			}
    			
    			data.username = username;
    			
       			$.post(url,data,function(t){
       				if(t.success){
       					Mo.alert("修改密码成功",function(){
       					  location.href = Mo.Config.appUrl+"/login";
       					})	
       				}else{
       					alert(t.description);
       				}
       				Mo.Base.throttle.unLock(url);
       			},"json").error(function(){
       				alert("获取失败!")
       				Mo.Base.throttle.unLock(url);
       			});
       		})
		});
    
		</script>
</html>
