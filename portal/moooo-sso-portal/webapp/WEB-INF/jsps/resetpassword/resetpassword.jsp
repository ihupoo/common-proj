<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
	    <meta name="others" content="login_page">
		<%@ include file="/inc/page_common_head.jsp"%>
		<title>密码重置</title>
	<style type="text/css">
	
		#wrap{
		   padding: 0 0 0;
		}
		
	   .modifyPassword-content .info .btn-wrapper{
	       position: relative;
	   }
	   .modifyPassword-content{
	       padding-left: 100px;
	   }
	   .setting-item{
	       overflow: hidden;
	   }
	   .modifyPassword-content .info .item-msg{
	       margin-left: 120px;
	       width: 190px;
	   }
	   #footer{
        }
        #header{
        padding:0;
        }
	  .logo .companyName {
		    font-size: 13px;
		    color: #4b4b4b;
		}
		.logo .sep {
		    margin-left: 8px;
		    margin-right: 10px;
		}
	   .footer_content {
	    border-top: 2px solid #949799;
	    color: #606060;
	    margin: 0 auto;
	    padding-top: 13px;
	    position: relative;
	    text-align: center;
	    width: 1024px;
		font-family: '微软雅黑',sans-serif;
	} 
	/**解决邮件中打开效果与浏览器打开效果不一致问题**/
   .mo-dialog-content .setting-item-main {
   		display:inline-block;
   		margin-left:0px;
   }
   .newPasswordTip,.confirmPasswordTip{
	   	display: inline-block;
	    
   }
	</style>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/home.js?t=5.2.2722389346"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/password.js?t=6.0.3033644830"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/browser-polyfill.min.js?t=6.0.299853946"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/sm.min.js?t=6.0.3747877542"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/digestAuth.min.js?t=6.0.444683133"></script>
	<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/${sysBrand}/css/home.css?t=6.0.2615990444" />
	<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/css/password.css?t=6.0.3974162316" />
	<script type="text/javascript">
		$(document).ready(function(){
			var cancelUrl =BP.config.SYSTEM_URL+"/login";
			$(".cancel").attr("href",cancelUrl);
			Mo.common.homeInit(Mo.CompanyInfo);
		});
	 </script>
	</head>
	<body>
	<input type="hidden" id="email" value="${email}">
	<input type="hidden" id="sequenceNum" value="${sequenceNum}">
	<div id="wrap-all" class="wrap-all" style="height: 750px; padding-left: 200px;">
	<div class="head-nav-bg-temp"></div>
	<div id="header" class="hd-main clearfix">
		<!-- 科达视讯（摩云视讯）和电信（阿里云电信和DX6000电信）有区别 -->
        <a id="header_title_logo" href="<c:url value='/home' />"></a>
	</div>
	<div class="line"></div>
	<div id="wrap" class="clearfix" style="margin: 40px auto; width: 700px;">
		<div class="modifyPassword-content mo-dialog-content" >
			<div class="info password-form" style="margin:0px;">
				<div class="setting-item">
					<label style="text-align:left;padding:0px;font-weight:bold">重置密码</label>
					<div class="setting-item-main">
						<input type="text" id="errMsg" name="errMsg" class="e-input" style="border:none;font-weight:600;color:red;height: 24px;" readonly value="<c:if test="${securityPolicy.passwordStrength==2}">密码等级应为中或者强</c:if><c:if test="${securityPolicy.passwordStrength==3}">密码等级应为强</c:if>" maxlength="16" />
					</div>
				</div>
				<div class="setting-item">
					<label style="text-align:left;padding:0px;"><spring:message code='home.password.modify.label.newPassword' /></label>
					<div class="setting-item-main">
						<input type="password" id="newPassword" name="newPassword"
							class="input-text item-new-password" value="" maxlength="16"/>
						<span class="showHidePassword eye-bg" ></span>
									<!-- <div class="text-tips displayNone">
										8~16个数字，大小写字母、符号"_" "."，至少包含2种
									</div> -->
									<div class="capitals-tip displayNone" id="capital_newPassword"><span>大写已开启</span></div>
					</div>
					<div class="newPasswordTip">
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
							</div>
				</div>
				<div class="setting-item text-tips displayNone">
					<label style="text-align:left;padding:0px;"></label>
					<div class="setting-item-main text-tips displayNone">长度8-16个字符，包含数字、大小写字母、符号"_" "."</div>
				</div>
				<div class="setting-item">
					<label style="text-align:left;padding:0px;"><spring:message
							code='home.password.modify.label.conPassword' /></label>
					<div class="setting-item-main">
						<input type="password" id="confirmPassword" name="confirmPassword"
							class="input-text item-confirm-password" value="" maxlength="16"/>
						<span class="showHidePassword eye-bg" ></span>
						<div class="capitals-tip displayNone" id="capital_newPassword"><span>大写已开启</span></div>
					</div>
					<div class="confirmPasswordTip">
								<div class="tipWrapper">
									<span class="tip-icon"></span>
									<span class="tip-info"></span>
								</div>
					</div>
				</div>
				<div class="item-msg">
					<div class="msg"></div>
				</div>
				<div class="btn-wrapper" style="margin-top: 40px;bottom: 0px">
					<a id="detail-btn-save" class="mo-btn-gray confirm btn-x btn-x-left disabled" style="margin-left: 100px;float: left;"  href="javascript:"><spring:message
							code='home.user.modify.btn.confirm' /></a>
					<a class="mo-btn-gray cancel btn-x btn-x-left" style="margin-left: 10px;float: left;"  href="javascript:"><spring:message
							code='home.user.modify.btn.cancel' /></a>
					<a id="login-home" style="display:none" href=""></a>
				</div>
			</div>
		</div>
	</div>
	</div>
	<div id="footer" class="clearfix">
         <div class="footer_content">
            
          </div>
     </div>
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
<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/home.js?t=6.0.4291316485"></script>
<script type="text/javascript">
var footerHtml = template('enterprise_introduce',Mo.CompanyInfo);
$(".footer_content","#footer").html(footerHtml);
var username = "${currentuser.name}";
Mo.Base.DigestAuth.realm = "${realmName}";
Mo.Base.DigestAuth.username = "${email}";
var nonce = "${nonce}";
var strengthRegular = ${strengthRegular};
var passwordStrengthOfSecurityPolicy = "${securityPolicy.passwordStrength}";
$(function(){
	SSO.Size.experirdpageInit();
	var options = {
				oldPasswordId:"",
				newPasswordId:"#newPassword",
				confirmPasswordId:"#confirmPassword",
		strongAuthentication: true,
		checkUsed: true
		}
		Mo.Password.init(options);
		Mo.Password.capitalTip("")
		Mo.Password.capitalTip("newPassword")
		Mo.Password.capitalTip("confirmPassword");
	
});
function beforeSave(){
	var data = {
			newPassword : $.trim($("#newPassword").val()),
			confirmPassword : $.trim($("#confirmPassword").val()),
			email: $.trim($("#email").val()),
			sequenceNum: $.trim($("#sequenceNum").val())
	}
	
	if(data.newPassword =="" ||data.newPassword == null){
		$(".item-msg").html("请输入密码");
		$("#newPassword").focus();
		Mo.Base.throttle.unLock(url);
		return false;
	}
	
	if(data.newPassword && !SSO.verify.password(data.newPassword)){
		$(".item-msg").html('密码仅支持大小写字母、数字、"_"、"."');
		$("#newPassword").focus();
		Mo.Base.throttle.unLock(url);
		return false;
	}
	
	if(data.newPassword && !SSO.Base.validation.checkLength(data.newPassword,16)){
		$(".item-msg").html('密码长度不能大于16位字符');
		$("#newPassword").focus();
		Mo.Base.throttle.unLock(url);
		return false;
	}
	
	if($.trim(data.newPassword) != $.trim(data.confirmPassword)){
		$(".item-msg").html('两次输入密码不一致，请重新输入。');
		$("#confirmPassword").focus();
		Mo.Base.throttle.unLock(url);
		return false;
	}
	
	return data;
}

$(".confirm").on("click",function(){
	if($(".confirm").hasClass("disabled")){
		return false;
	}
	$(".item-msg").html("");
	var url = SSO.utils.getSystemUrl("forgetpassword/resetpassword");
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
	if(Mo.Base.throttle.isLock(url)){
		return false;
	}
	var data = beforeSave();
	if(!data){
		Mo.Base.throttle.unLock(url);
		return false;
	}
	var mData = Mo.Base.DigestAuth.makePassword(nonce,data.newPassword);
	mData.email = data.email;
	mData.sequenceNum = data.sequenceNum;
	Mo.Base.throttle.lock(url);
	$.post(url,mData,function(t){
		if(t.success){
			$(".confirm").addClass("disabled")
		}
		alert(t.description,function(){
			var loginUrl=SSO.utils.getSystemUrl('login');
			location.href=loginUrl;
					/*var loginUrl = BP.config.SYSTEM_URL+"/toLogin";
					var postData = {
					"remember":true,
					"isChecked":"0",
					"email":"${email}",
					"password":$.trim($("#confirmPassword").val()),
					"verifyCode":""
					}
					$.post(loginUrl,postData,function(msg){
						var msg = JSON.parse(msg)
						if(msg.success){
							var homeUrl = BP.config.SYSTEM_URL+"/home";
							$("#login-home").attr("href",homeUrl);
							document.getElementById("login-home").click();
						}else{
							var loginUrl = BP.config.SYSTEM_URL+"/login";
							$("#login-home").attr("href",loginUrl);
							document.getElementById("login-home").click();
						}
					})*/
				});
		Mo.Base.throttle.unLock(url);
	},'json');
});
</script>
</body> 
</html>
