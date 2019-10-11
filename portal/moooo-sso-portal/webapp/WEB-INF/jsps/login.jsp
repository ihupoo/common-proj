<%@ page language="java" contentType="text/html;charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html>
<html>
<head>
<meta name="others" content="login_page">
<%@ include file="/inc/page_base_head.jsp"%>
<title></title>
<!-- <title>登录-科达视讯云</title>
<title>登录-新视通（4G版）</title>
<title>登录-摩云视讯</title> -->
	<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/reset.css?t=6.0.3336199849"/>
	<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/ezmark.min.css?t=6.0.671217583"/>
	<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/common.css?t=6.0.3047861253">
	<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/commonCSS.css?t=6.0.2250813937">
	<link rel="stylesheet" type="text/css" href="${RESOUCE_STATIC_URL}/css/login.css?t=6.0.1126863061">
	<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/${sysBrand}/css/login.css?t=6.0.3138465497" />
<style type="text/css">
#wrap {
	padding: 0 0 0px;
}

.login-input {
	outline: none;
}

.login_content .login-input {
	font-size: 14px;
}
.footVerInfo {
	display: inline-block;
}

.meeting a {
	color: #4e4e4e;
}

.meeting a:hover {
	color: #007ac0;
	text-decoration: underline;
	cursor: pointer;
}

.left24 {
	margin-left: 24px;
}
input:-webkit-autofill {
	-webkit-box-shadow: 0 0 0px 1000px white inset;
}
.login_input_wrapper .pwdEye{
	display: none;
	position: absolute;
	right: 0px;
	width: 18px;
	height: 12px;
	bottom: 5px;
	background:url("${RESOUCE_STATIC_URL}/images/pwd.png?t=6.0.1347910496") 0 0 no-repeat;
}
.login_input_wrapper .pwdEye.active{
	background-position:  -20px 0;
}
.company_info .email{
	color: #4e4e4e;
}
.company_info .email:hover {
	color: #007ac0;
	text-decoration: underline;
	cursor: pointer;
}
</style>

</head>
<body class="bg">
	<script id="loginheader" type="text/html">
	       <!-- login界面黑色背景图 -->
	       <div class="login_header_bg"></div>
	       <!-- 左上角logo-->
	       <span class="login-logo mo_icons"></span>
	       <!-- 中间部分的中文与英文字体-->
		   <div class="sys_logo">
		       <span class="logo_text">
		            <span class="login-title-logo mo_icons"></span>
		        	<div class="logo_title">{systemName}</div>
		       </span>
 				<div class="logo_englishtext" >{systemEnglishName}</div>
		   </div>
	   </script>
	<div id="wrap" class="clearfix">
		<div id="login_header" class="clearfix"></div>

		<div class="content">
			<div class="login_content clearfix">
				<div id="login_form">
					<div class="clearfix form_input_holder">
						<div class="login_input_wrapper email_input_holder">
							<input type="text" class="login-input" id="email"
								value="${loginUserName}" autocomplete="off" /> <label
								class="tip_label"><spring:message
									code="SSO.login.username" /></label>
						</div>
						<div class="login_input_wrapper password_input_holder">
							<input type="password" class="login-input" id="password" value="" autocomplete="off" maxlength="16" readonly />
							<label class="tip_label"><spring:message
									code="SSO.login.password" /></label>
							<a href="javascript:void(0);" class="pwdEye"></a>
						</div>
						<div class="login_input_wrapper verifyCode_input_holder hidden">
							<input type="text" id="verifyCode" name="verifyCode"
								class="login-input" value="" maxlength="4" autocomplete="off" />
							<label id="lable_verifyCode" class="tip_label">验证码</label> <img
								align="middle" id="verifyImage"
								src="${pageContext.request.contextPath}/verifyImage"
								style="margin-top: 18px; cursor: pointer; width: 93px; height: 25px;">
						</div>
						<a class="password_forget"><spring:message
								code="SSO.login.forget_password" /></a>
						<div class="keep_login">
							<input type="checkbox" value="1" id="remember" name="keepLogin" /><span>保持登录状态</span>
						</div>
						<div class="error_msg"></div>
					</div>
					<a id="login-submit" class="icon" type="submit"><spring:message
							code="SSO.login.submit" /></a>
				</div>

				<div id="forgotPassword-wrapper"
					style="display: none; width: 230px; margin: 0 auto;">
					<div class="form_input_holder" style="position: relative;">
						<div class="login_input_wrapper">
							<input type="text" id="reg-email" name="reg-email"
								class="login-input input-email" value="" /> <label
								class="tip_label">请输入注册邮箱</label>
						</div>
						<div class="error_msg"  style="width: 230px;"></div>
						<div>
							<a id="cancel_email" class="icon small" type="button"
								href="javascript:">返回</a> <a id="send_email" class="icon small"
								type="submit">立即找回</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- content end -->
	</div>
	<!--  footer start  -->
	<div class="betwweenWraperAndContent"></div>
	<!-- footer enterprise infomation 企业信息-->
	   <div id="footer"></div>
	   <div id="isLoginEntry"></div>
	   <!-- footer enterprise infomation 企业信息模板-->
	   <script id="enterprise_introduce" type="text/html">
       <div class="enterprise_introduce_content clearfix" style="width:100%">
	       <div class="company_info_up " style="font-size:14px;font-family:'微软雅黑';color:#4e4e4e;"> 
	       		<p class="clearfix company_info">
	       			<!-- 电话图标 -->
	          		<a class="no_meeting_icon phone_icon"></a>
	          		<!-- 电话 -->
	           		<span class="phoneNumber">{phoneNumber}</span>
	           		<!-- 邮件 -->
	           		<a class="no_meeting_icon emal_icon"></a>
	           		<a class="email" href="mailto:{emailAddress}" >{emailAddress}</a>
	           		<!-- 网址 -->
	           		<a class="no_meeting_icon no_meeting"></a>
	           		<span class="meeting">
	           			<a href="{netAddress1Href}" target="_blank">{netAddress1Txt}</a>
	           		</span>
	           		<span class="meeting movision">
	           			<a class="no_meeting_icon no_meeting"></a>
	           			<a href="{netAddress2Href}" target="_blank">{netAddress2Txt}</a>
	           		</span>
	          		
	          	</p>
          	</div>
          	
          	<div class="company_info_down" type="text/html">
		        <p class="clearfix company_info">
		        	<!-- 公司名称-->
					<span class="companyName">{companyName}</span>
					<span class="copyright" >Copyright &copy;<span class="establishYear">{establishYear}</span><span class="version_year">${versionYear}</span><span class="companyDomainName">{companyDomainName}</span><span>.&nbspAll rights reserved.</span>
					<!-- 科达视讯无备案号 摩云视讯有备案号 阿里云电信有备案号 DX6000无备案号 -->
					<span class="icp">
						<a  href="{icpInfoHref}" target="_blank">{icpInfoTxt}</a>
					</span>				
	            </p>
	        </div>
	   </script>

	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/jquery/3.4.1/jquery-3.4.1.min.js?t=6.0.1541703249"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/jquery/3.4.1/jquery-migrate-3.1.0.min.js?t=6.0.2784881030"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/namespace/1.0/jquery.namespace.min.js?t=5.0.3214755290"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/template-web.js?t=6.0.3773348943"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/jlib/ezmark/1.0/jquery.ezmark.min.js?t=5.0.851139702"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/utils.js?t=6.0.2571896431"></script>
	<script type="text/javascript">
		$.namespace("BP.config");
		BP.config = {
			SYSTEM_URL: "${pageContext.request.contextPath}",
			STATIC_URL: "${pageContext.request.contextPath}/static",
			FILE_TYPE_ALLOW:"[rar,zip,doc,xls,ppt,pps,pdf,txt,jpg,jpeg,bmp,gif,png]",
			LANG:'${lang}',
		};
		$.namespace("Mo.Config");
		Mo.Config = {
			appUrl:"${APP_URL}",
		};
	</script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/common.js?t=6.0.4136976962"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/jlib/artTemplate/1.4/template.min.js?t=5.0.4284117368"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/jlib/artTemplate/1.4/template-syntax.min.js?t=5.0.4213305808"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/login.js?t=6.0.1499158763"></script>
	<script type="text/javascript">
		if(top.location.href != location.href) {
			top.location.href = location.href;
		}
		var showVerifyCode = "${showVerifyCode}";
		var realmName = "${realmName}";
		var nonceValue = "${nonceValue}";
		var systemSecurity = "${systemSecurity}";
		var outAlter = "${outAlter}";

		function isIE() {
			if (!!window.ActiveXObject || "ActiveXObject" in window)
				return true;
			else
				return false;
		}
		$(function() {

			$('input[type="checkbox"]').ezMark();
			/* if(isRent){
   checkbox-gray             $(".commercialVerInfo").css("display","inline-block");
            } */
			if(isIE()){
				$("#password").removeAttr("readonly");
			}
			$("#password").on('focus',function(){
				$("#password").removeAttr("readonly");
			});
			// 密码框抬起时，密码框内容为空则隐藏眼睛
            $("#password").on("keyup",function(){
                if($(this).val()){
                    $('.login_input_wrapper .pwdEye').show()
                }else{
                    $('.login_input_wrapper .pwdEye').hide()
                }
            });
            // 点击眼睛，切换眼睛图标的高亮状态 并 切换明文密码
            $(".login_input_wrapper .pwdEye").on("click",function(){
                $(this).toggleClass('active')
                if($(this).hasClass('active')){
                    $(".login_input_wrapper #password").prop("type",'text')
                }else{
                    $(".login_input_wrapper #password").prop("type",'password')
                }
            });
		});
	</script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/browser-polyfill.min.js?t=6.0.299853946"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/sm.min.js?t=6.0.3747877542"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/md5.min.js?t=6.0.3467134369"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/digestAuth.min.js?t=6.0.444683133"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/login.js?t=6.0.3458804519"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			Mo.common.logininit(Mo.CompanyInfo);
			SSO.login.init();
			SSO.login.initVerifyCode();
			window.onresize = function() {
				SSO.login.init();
			}
			/* if(outAlter=='100010'){
				$("#login_form .error_msg").text("token值已经登出，请重新登录！").show();
			}
			if(outAlter=='100011'){
				$("#login_form .error_msg").text("token验证错误，请重新登录！").show();
			} */
			if(outAlter=='100012'){
				$("#login_form .error_msg").text("当前账号在别处登录，请重新登录！").show();
			}
			/* if(outAlter=='100013'){
				$("#login_form .error_msg").text("认证信息不存在，请重新登录！").show();
			} */

			setTimeout(function () {
				loadOtherCss('${RESOUCE_STATIC_URL}/css/reset-easyui.css?t=6.0.1503837568');
				loadOtherCss('${RESOUCE_STATIC_URL}/css/reset-mCustomScrollbar.min.css?t=6.0.393555021');
				loadOtherCss('${RESOUCE_STATIC_URL}/js/jlib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar.min.css?t=6.0.1765382074');
				loadOtherCss('${RESOUCE_STATIC_URL}/js/jlib/imgareaselect/imgareaselect-default.css?t=5.0.1277980685');
				loadOtherCss('${RESOUCE_STATIC_URL}/css/reset-artDialog.min.css?t=6.0.3128532573');
				loadOtherCss('${RESOUCE_STATIC_URL}/js/jlib/artDialog/4.1.7/skins/simple.min.css?t=5.0.3808827147');

				loadOtherJs('${RESOUCE_STATIC_URL}/js/jlib/artDialog/4.1.7/jquery.artDialog.min.js?t=6.0.2288083125');
				loadOtherJs('${RESOUCE_STATIC_URL}/js/jlib/jquery.easyui.min.js?t=6.0.2501531710');
				loadOtherJs('${RESOUCE_STATIC_URL}/js/jlib/mousewheel/3.1.13/jquery.mousewheel.min.js?t=6.0.1689901820');
				loadOtherJs('${RESOUCE_STATIC_URL}/js/jlib/mCustomScrollbar/3.1.5/jquery.mCustomScrollbar.min.js?t=6.0.3636375954');
				loadOtherJs('${RESOUCE_STATIC_URL}/js/jlib/bootstrap.min.js?t=6.0.1157609903');
				loadOtherJs('${RESOUCE_STATIC_URL}/js/jlib/imgareaselect/jquery.imgareaselect.pack.js?t=5.0.1441039338');
				loadOtherJs('${RESOUCE_STATIC_URL}/js/messagebox.js?t=6.0.3966687589');
				loadOtherJs('${RESOUCE_STATIC_URL}/js/messageboxCustom.js?t=6.0.476928025');
			}, 0);
		});

		function loadOtherCss(url){
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = url;
			$('head').prepend(link);
		}

		function loadOtherJs(url){
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			document.body.appendChild(script);
		}
	</script>
</body>

</html>
