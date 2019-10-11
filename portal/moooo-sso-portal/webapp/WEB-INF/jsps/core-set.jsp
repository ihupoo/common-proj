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
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/password.js?t=6.0.3033644830"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/browser-polyfill.min.js?t=6.0.299853946"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/md5.min.js?t=6.0.3467134369"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/sm.min.js?t=6.0.3747877542"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/js/digestAuth.min.js?t=6.0.444683133"></script>

	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/${sysBrand}/js/home.js?t=5.2.2722389346"></script>
	<script type="text/javascript" src="${RESOUCE_STATIC_URL}/jlib/portal/mo-portal.js?t=6.0.2585935213"></script>
	<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/jlib/portal/styles/css/mo-portal.css?t=6.0.1112273720" />
	<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/css/password.css?t=6.0.3974162316" />
	<link rel="stylesheet" href="${RESOUCE_STATIC_URL}/${sysBrand}/css/home.css?t=6.0.2615990444" />

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
		.btn-wrapper .color-6:hover{
			color : #ffffff
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
		.header-wrapper{
			padding-left:128px;
			padding-right:128px;
		}
		.icp a{
			margin-left:22px;
		}
		.footerWrap{
			padding-left: 128px;
			padding-right: 128px;
		}
		.public-private-cloud-content{
			display: none;
		}
		.change-account .warn-info {
			position: relative;
			top: 55px;
			text-align: left;
			line-height: 21px;
			color: #4e4e4e;
			font-size: 12px;
			margin-left: 27px;
		}
		.change-account .tipImage{
			top:55px;
			height: 28px;
			margin-left: 0;
		}
		.base-input-wrap .bmc-accountInput-tipMsg{
			top:18px;
		}
	</style>
</head>
<body class="bg">
<div class="header-wrapper">
	<input type="hidden" id="moid" value="${currentuser.moid}"/>

	<%@ include file="/inc/page_head_nav.jsp"%>

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
					<div class="detail-header">
						<div class="tabs">
							<a href="#profile" class="tab-item profile mo-btn-x" data-tab="profile">个人信息</a>
							<a href="#password" class="tab-item password mo-btn-x" data-tab="password">修改密码</a>
							<a class="tipPass" style="color:#d21e1e; display:none">请设置强度等级为中或强的密码</a>
							<span class="password-tip tab-tip hidden" style="height:23px;line-height:23px;color:#d21e1e;font-weight:bold;"><c:if test="${securityPolicy.passwordStrength==2}">密码等级应为中或者强</c:if><c:if test="${securityPolicy.passwordStrength==3}">密码等级应为强</c:if></span>
						</div>
						<div class="operate">
							<div id="detail-btn-save" class="mo-btn-gray mo-btn-x mo-btn-x-left">保存</div>
							<div id="detail-btn-cancel" class="mo-btn-gray mo-btn-x">取消</div>
						</div>

					</div>

					<div class="detail-body" style="height:auto;">
						<div class= "detail-content">
							<form class="profile-form">
								<ul id="editor-ui" >
									<li class="data-li">
										<table style="table-layout:fixed">
											<tbody>
											<div id="account" style="margin-bottom:9px"></div>
											<tr id="account-readonly">
												<td class="title">账号</td>
												<td class="input">
													<div  class="inputDiv">
														<input type="hidden" id="account1" name="account1" readonly class="input-text" value="adminTest" maxlength="21">${currentuser.account}
													</div>
												</td>
												<td class="operate"></td>
											</tr>
										</table>
									</li>
									<li class="data-li">
										<table style="table-layout:fixed">
											<tbody>
											<tr>
												<td class="title">手机</td>
												<td class="input">
													<div  class="inputDiv">
														<input type="text" id="mobile" name="mobile" class="e-input" value="${currentuser.mobile}" maxlength="11"/>
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
												<td class="title">电子邮箱</td>
												<td class="input">
													<div  class="inputDiv">
														<input type="text" id="email" name="email" class="e-input" value="${currentuser.email}" maxlength="64"/>
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
												<td class="title">办公地址</td>
												<td class="input">
													<div  class="inputDiv">
														<input type="text" id="officeLocation" name="officeLocation" class="e-input" value="${fn:escapeXml(currentuser.seat)}" maxlength="60"/>
													</div>
												</td>
												<td class="operate">
												</td>
											</tr>
										</table>
									</li>
								</ul>
							</form>
							<!--password---->
							<form class="password-form">
								<ul id="editor-ui" >

									<li class="data-li">
										<table style="table-layout:fixed">
											<tbody>
											<tr>
												<td class="title">当前密码</td>
												<td class="input" style="position: relative;">
													<div  class="inputDiv">
														<input type="password" id="oldPassword" name="oldPassword" class="e-input item-old-password" value="" maxlength="16" />
														<span class="showHidePassword eye-bg"></span>
														<div class="capitals-tip displayNone" id="capital_oldPassword"><span>大写已开启</span></div>
													</div>
													<span class ="showTip" style="color:#d21e1e; display:none;position:absolute;"><c:if test="${currentuser.moid=='mooooooo-oooo-oooo-oooo-defaultadmin'}">密码修改后，需使用新密码重新登录，请牢记新密码！</c:if></span>
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
									<li class="data-li" style="height: 30px;">
										<table style="table-layout:fixed">
											<tbody>
											<tr>
												<td class="title">新密码</td>
												<td class="input">
													<div  class="inputDiv">
														<input type="password" id="newPassword" name="newPassword" class="e-input item-new-password" value="" maxlength="16"/>
														<span class="showHidePassword eye-bg" ></span>
														<div class="text-tips displayNone" style="position: absolute">
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
								</ul>
							</form>
							<!--portrait---->
							<form class="portrait-form">
								<input type="hidden" id="fileName">
								<input type="hidden" id="selection">
								<div class="mo-dialog-content" style="padding-top: 32px;">
									<div style="width: 1000px; height: 400px;">
										<div id="file-uploader" class="clearfix">
										</div>
										<span style="float: left; margin-bottom: 20px;  margin-top: 10px;">仅支持JPG、PNG、GIF、BMP图片文件，且文件大小为3840x3840~64x64</span>
										<span style="float: left; margin-bottom: 10px; clear: both;">上传的图片将生成4种尺寸</span>
										<div class="side_256 preview_div"><img src="${RESOUCE_STATIC_URL}/images/hidden.png?t=6.0.1152577249" class="img_256"></div>
                                    	<div class="side_128 preview_div"><img src="${RESOUCE_STATIC_URL}/images/hidden.png?t=6.0.1152577249" class="img_128"></div>
                                    	<div class="side_64 preview_div"><img src="${RESOUCE_STATIC_URL}/images/hidden.png?t=6.0.1152577249" class="img_64"></div>
                                    	<div class="side_32 preview_div"><img src="${RESOUCE_STATIC_URL}/images/hidden.png?t=6.0.1152577249" class="img_32"></div>
										<div class="side_320" style="position:relative;">
											<img id="img_side_320" class="img_side_320" src="${pageContext.request.contextPath}/static/images/changehead_bg.png?t=6.0.3528474740">
										</div>
										<span class="img_span">您要上传的图片</span>
										<div style="float: left; clear: both;">
											<span style="margin-left: 98px;">256x256</span>
											<span style="margin-left: 182px;">128x128</span>
											<span style="margin-left: 84px;">64x64</span>
											<span style="margin-left: 44px;">32x32</span>
										</div>
									</div>
								</div>
							</form>


						</div>
					</div>
				</div>
			</div>
			<div class="line"></div>
		</div>
	</div>
	<div class="hidden">
		<div id="confirmAccount">
			<div class="change-content mo-dialog-content w400h260">
				<div class="title" style="margin-top: 0px;margin-bottom: 3px;">
					<span>提示</span>
					<a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
				</div>
				<div class="separater"></div>
				<div class="info change-account">
					<div class="tipImage"></div>
					<div class="warn-info">账号修改后，请牢记新账号！<br/>账号丢失后无法找回，需返厂进行初始化。</div>
				</div>
				<div class="btn-wrapper">
					<a class="mo-btn-gray save mo-btn-x mo-btn-x-left color-6" href="javascript:">修改账号</a>
					<a class="mo-btn-gray cancel mo-btn-x color-6" href="javascript:">取消</a>
				</div>
			</div>
		</div>
		<div id="passwordUpdate">
			<div class="change-content mo-dialog-content w400h260">
				<div class="title" style="margin-top: 0px;margin-bottom: 3px;">
					<span>提示</span>
					<a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
				</div>
				<div class="separater"></div>
				<div class="info change-account">
					<div class="tipImage"></div>
					<div class="warn-info">密码修改后，请牢记新密码！<br/>未配置邮箱将密码丢失后无法找回，需返厂进行初始化。</div>
				</div>
				<div class="btn-wrapper">
					<a class="mo-btn-gray save mo-btn-x mo-btn-x-left color-6" href="javascript:">重置密码</a>
					<a class="mo-btn-gray cancel mo-btn-x color-6" href="javascript:">取消</a>
				</div>
			</div>
		</div>
		<div id="changeWrapper">
			<div class="change-content mo-dialog-content w400h260">
				<div class="title" style="margin-top: 0px;margin-bottom: 3px;">
					<span>提醒</span>
					<a href="javascript:void(0);" class="w-close" hidefocus="true"></a>
				</div>
				<div class="separater"></div>
				<div class="info">
					<div class="msg"><span>内容已修改，是否保存？</span></div>

				</div>
				<div class="btn-wrapper">
					<a class="mo-btn-gray save mo-btn-x mo-btn-x-left color-6 .mo-btn-x-left" href="javascript:">保存</a>
					<a class="mo-btn-gray cancel mo-btn-x color-6" href="javascript:">取消</a>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="footer"  class="clearfix footerWrap">
	<div class="footer_content">
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
    var username = "${currentuser.account}";
    Mo.Base.DigestAuth.realm = "${realmName}";
    Mo.Base.DigestAuth.username = "${currentuser.moid}";
    var systemSecurity = "${systemSecurity}";
    var strengthRegular = ${strengthRegular};
    var passwordStrengthOfSecurityPolicy = "${securityPolicy.passwordStrength}";
	var portrait40 = '${currentuser.portrait40}';
	var portrait64 = '${currentuser.portrait64}';
	var portrait128 = '${currentuser.portrait128}';
	var portrait256 = '${currentuser.portrait256}';
	var portraitDomain = '${portraitDomain}';
    var options = {
        oldPasswordId:"#oldPassword",
        newPasswordId:"#newPassword",
        confirmPasswordId:"#confirmPassword",
        strongAuthentication: true,
        checkUsed: true
    }
    $(document).ready(function(){
        Mo.updataAccount.init();
        $("#modifyPortrait").hide();

        Mo.Set.init();
        SSO.common.modifyPortait.initUpLoad();
        Mo.SetFrame.initCoreSetPage();
        $(window).resize(function(){
            Mo.SetFrame.initCoreSetPage();
        });
		SSO.common.setDefaultImg('.user-info');
        SSO.common.initPortrait(portrait40, portraitDomain);
		if (portrait256 && portraitDomain) {
            var domain = '//' + portraitDomain + '/';
            $('.img_32').attr('src', domain + portrait40);
            $('.img_64').attr('src', domain + portrait64);
            $('.img_128').attr('src', domain + portrait128);
            $('.img_256').attr('src', domain + portrait256);
        }
        $("#help").attr("href","${RESOUCE_STATIC_URL}/${sysBrand}/help/default.html");
        Mo.common.homeInit(Mo.CompanyInfo);
        Mo.common.aboutInit(Mo.CompanyInfo);

        Mo.Password.init(options);
        Mo.Password.capitalTip("oldPassword")
        Mo.Password.capitalTip("newPassword")
        Mo.Password.capitalTip("confirmPassword");

    });

</script>
</html>
